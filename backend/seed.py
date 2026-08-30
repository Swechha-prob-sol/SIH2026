import json
from pathlib import Path

from backend.database import SessionLocal
from backend.models import Standard


BASE_DIR = Path(__file__).resolve().parent.parent
STANDARDS_DIR = BASE_DIR / "data" / "standards"


def seed_standards():
    db = SessionLocal()

    try:
        existing_ids = {
            standard_id
            for (standard_id,) in db.query(Standard.standard_id).all()
        }

        added = 0

        for file_path in STANDARDS_DIR.glob("*.json"):
            with open(file_path, "r", encoding="utf-8") as file:
                data = json.load(file)

            standard_id = data["standard_id"]

            if standard_id in existing_ids:
                continue

            standard = Standard(
                standard_id=standard_id,
                standard_number=data["standard_number"],
                title=data["title"],
                short_title=data.get("short_title"),
                edition=data.get("edition"),
                year=data["year"],
                reaffirmation_year=data.get("reaffirmation_year"),
                status=data["status"],
                domain=data.get("domain"),
                category=data.get("category"),
                department=data.get("department"),
                technical_committee=data.get("technical_committee"),
                ics_code=data.get("ics_code"),
                scope=data.get("scope"),
                description=data.get("description"),
                key_requirements=data.get("key_requirements"),
                sections=data.get("sections"),
                applicable_products_or_industries=data.get(
                    "applicable_products_or_industries"
                ),
                keywords=data.get("keywords"),
                related_standards=data.get("related_standards"),
                source=data.get("source"),
                source_url=data.get("source_url"),
                citation=data.get("citation"),
                meta=data.get("meta"),
                embedding_id=data.get("embedding_id"),
            )

            db.add(standard)
            existing_ids.add(standard_id)
            added += 1

        db.commit()
        print(f"Database seeded successfully. Added {added} standards.")

    except Exception:
        db.rollback()
        raise

    finally:
        db.close()


if __name__ == "__main__":
    seed_standards()