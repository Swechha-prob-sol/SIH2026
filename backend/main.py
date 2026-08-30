from fastapi import FastAPI
import json
from pathlib import Path

app = FastAPI()

# Location of BIS standard JSON files
STANDARDS_DIR = Path(__file__).resolve().parent.parent / "data" / "standards"


@app.get("/health")
def health_check():
    return {"status": "ok"}


@app.get("/standards")
def get_standards():
    standards = []

    for file_path in STANDARDS_DIR.glob("*.json"):
        with open(file_path, "r", encoding="utf-8") as file:
            standard = json.load(file)

        standards.append({
            "standard_id": standard["standard_id"],
            "standard_number": standard["standard_number"],
            "title": standard["title"],
            "year": standard["year"],
            "status": standard["status"],
            "domain": standard["domain"]
        })

    return standards