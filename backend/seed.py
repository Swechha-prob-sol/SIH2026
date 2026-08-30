from database import Base, SessionLocal, engine
from models import Standard

# Create tables
Base.metadata.create_all(bind=engine)

# Seed initial standards
db = SessionLocal()
if not db.query(Standard).first():
    sample_standards = [
        Standard(
            code="ISO-9001",
            title="Quality Management",
            description="Requirements for a quality management system.",
        ),
        Standard(
            code="ISO-27001",
            title="Information Security",
            description="Specification for an information security management system.",
        ),
    ]
    db.add_all(sample_standards)
    db.commit()
    print("Database seeded successfully.")
db.close()
