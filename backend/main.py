from fastapi import Depends, FastAPI
from sqlalchemy.orm import Session

from backend.database import get_db
from backend.models import Standard

import json
import hashlib
from backend.redis_client import redis_client
from backend.schemas import QueryRequest, QueryResponse, QueryMatch
from rag_pipeline import query_standards

app = FastAPI()


@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.get("/standards")
def get_standards(db: Session = Depends(get_db)):
    standards = db.query(Standard).all()

    return [
        {
            "standard_id": standard.standard_id,
            "standard_number": standard.standard_number,
            "title": standard.title,
            "year": standard.year,
            "status": standard.status,
            "domain": standard.domain,
        }
        for standard in standards
    ]   
@app.post("/query", response_model=QueryResponse)
def query_endpoint(request: QueryRequest):
    cache_key = f"query:{hashlib.sha256(request.query_text.encode()).hexdigest()}:{request.top_k}"

    cached_result = redis_client.get(cache_key)
    if cached_result:
        return QueryResponse(query=request.query_text, cached=True, results=json.loads(cached_result))

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

    redis_client.setex(cache_key, 3600, json.dumps([r.model_dump() for r in results]))

    return QueryResponse(query=request.query_text, cached=False, results=results)