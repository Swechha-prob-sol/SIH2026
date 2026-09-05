from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class StandardBase(BaseModel):
    code: str
    title: str
    description: Optional[str] = None


class StandardResponse(StandardBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class QueryRequest(BaseModel):
    query_text: str
    top_k: Optional[int] = 2

class QueryMatch(BaseModel):
    standard_id: Optional[str] = None
    standard_number: Optional[str] = None
    title: Optional[str] = None
    type: Optional[str] = None
    text: Optional[str] = None
    score: float

class QueryResponse(BaseModel):
    query: str
    cached: bool
    results: list[QueryMatch]