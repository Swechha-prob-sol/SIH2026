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
