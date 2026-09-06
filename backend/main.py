from fastapi import Depends, FastAPI
from sqlalchemy.orm import Session
from backend.database import get_db
from backend.models import Standard
import json
import hashlib
from backend.redis_client import redis_client
from backend.schemas import QueryRequest, QueryResponse, QueryMatch
from rag_pipeline import query_standards, generate_answer

app = FastAPI()

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.get("/standards")
def get_standards(db: Session = Depends(get_db)):
    standards = db.query(Standard).all()
    return [
        {
            "id": standard.id,
            "code": standard.code,
            "title": standard.title,
            "description": standard.description,
            "created_at": standard.created_at,
        }
        for standard in standards
    ]

@app.post("/query", response_model=QueryResponse)
def query_endpoint(request: QueryRequest):
    cache_key = f"query:{hashlib.sha256(request.query_text.encode()).hexdigest()}:{request.top_k}"
    cached_result = redis_client.get(cache_key)
    if cached_result:
        return QueryResponse(**json.loads(cached_result))

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

    answer = generate_answer(request.query_text, matches)

    response = QueryResponse(
        query=request.query_text,
        cached=False,
        results=results,
        answer=answer,
    )

    redis_client.setex(cache_key, 3600, response.model_dump_json())
    return response