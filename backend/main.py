from fastapi import Depends, FastAPI
from sqlalchemy.orm import Session

from backend.database import get_db
from backend.models import Standard

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