import hashlib
import json
from typing import List, Optional

from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from backend.compliance import (
    check_compliance,
    load_all_schemes,
    load_all_testing_labs,
    load_standards_catalog,
    recommend_standards,
)
from backend.database import get_db
from backend.models import Standard
from backend.redis_client import redis_client
from backend.schemas import (
    ComplianceCheckRequest,
    ComplianceCheckResponse,
    QueryMatch,
    QueryRequest,
    QueryResponse,
    RecommendStandardsRequest,
    RecommendStandardsResponse,
)
from rag_pipeline import query_standards

app = FastAPI(
    title="BIS Standards AI Assistant API",
    description="Intelligent Conversational and Compliance Assessment API for Bureau of Indian Standards (BIS)",
    version="1.0.0",
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health_check():
    return {"status": "ok", "service": "BIS Assistant Compliance & RAG Engine"}


@app.get("/standards")
def get_standards(db: Session = Depends(get_db)):
    try:
        standards = db.query(Standard).all()
        if standards:
            return [
                {
                    "id": standard.id,
                    "standard_id": getattr(standard, "standard_id", ""),
                    "standard_number": getattr(standard, "standard_number", getattr(standard, "code", "")),
                    "code": getattr(standard, "standard_number", getattr(standard, "code", "")),
                    "title": standard.title,
                    "domain": getattr(standard, "domain", ""),
                    "category": getattr(standard, "category", ""),
                    "description": standard.description,
                    "created_at": standard.created_at,
                }
                for standard in standards
            ]
    except Exception:
        pass

    # Fallback to local catalog if DB is empty / offline
    catalog = load_standards_catalog()
    return [
        {
            "id": idx + 1,
            "standard_id": item.get("standard_id"),
            "standard_number": item.get("standard_number"),
            "code": item.get("standard_number"),
            "title": item.get("title"),
            "domain": item.get("domain"),
            "category": item.get("category"),
            "description": item.get("description"),
            "mandatory_certification": item.get("mandatory_certification", False),
        }
        for idx, item in enumerate(catalog)
    ]


@app.post("/query", response_model=QueryResponse)
def query_endpoint(request: QueryRequest):
    cache_key = f"query:{hashlib.sha256(request.query_text.encode()).hexdigest()}:{request.top_k}"

    try:
        cached_result = redis_client.get(cache_key)
        if cached_result:
            return QueryResponse(query=request.query_text, cached=True, results=json.loads(cached_result))
    except Exception:
        pass

    matches = query_standards(request.query_text, top_k=request.top_k)

    results = [
        QueryMatch(
            standard_id=match.get("metadata", {}).get("standard_id"),
            standard_number=match.get("metadata", {}).get("standard_number"),
            title=match.get("metadata", {}).get("title"),
            type=match.get("metadata", {}).get("type"),
            text=match.get("metadata", {}).get("text"),
            score=match.get("score", 0.0),
        )
        for match in matches
    ]

    try:
        redis_client.set(cache_key, json.dumps([r.model_dump() for r in results]), ex=3600)
    except Exception:
        pass


    return QueryResponse(query=request.query_text, cached=False, results=results)


# ---------------------------------------------------------
# Member 4 Endpoints: Recommend Standards & Compliance Checker
# ---------------------------------------------------------

@app.post("/compliance/recommend", response_model=RecommendStandardsResponse)
@app.post("/api/compliance/recommend", response_model=RecommendStandardsResponse)
def api_recommend_standards(request: RecommendStandardsRequest, db: Session = Depends(get_db)):
    """
    Recommend Standards Mode (per PS gap):
    User provides a natural language product description, intended use, or domain.
    The system performs semantic RAG retrieval and recommends matching Indian Standards,
    applicable BIS schemes (ISI Mark, CRS, Hallmarking), key mandatory parameters,
    and recognized testing laboratories.
    """
    return recommend_standards(request, db)


@app.post("/compliance/check", response_model=ComplianceCheckResponse)
@app.post("/api/compliance/check", response_model=ComplianceCheckResponse)
def api_check_compliance(request: ComplianceCheckRequest, db: Session = Depends(get_db)):
    """
    Compliance Checker Mode:
    User provides measured laboratory test specifications against an Indian Standard.
    The system verifies each parameter against acceptable and permissible limits,
    evaluating PASS/FAIL/WARNING statuses, overall compliance score (0-100%),
    missing mandatory parameters, and corrective remediation steps.
    """
    return check_compliance(request, db)


@app.get("/compliance/standards")
@app.get("/api/compliance/standards")
def api_get_compliance_standards():
    """
    Returns full list of available standards in catalog for frontend dropdowns and selector widgets.
    """
    return load_standards_catalog()


@app.get("/compliance/schemes")
@app.get("/api/compliance/schemes")
def api_get_compliance_schemes():
    """
    Returns available BIS certification schemes and recognized laboratory network details.
    """
    schemes = load_all_schemes()
    labs = load_all_testing_labs()
    return {
        "schemes": schemes,
        "laboratories_count": len(labs),
        "laboratories_sample": labs[:5],
    }

