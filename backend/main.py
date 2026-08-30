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
            "standard_id": standard.standard_id,
            "standard_number": standard.standard_number,
            "title": standard.title,
            "year": standard.year,
            "status": standard.status,
            "domain": standard.domain,
        }
        for standard in standards
    ]   