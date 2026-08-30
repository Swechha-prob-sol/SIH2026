from datetime import datetime

from backend.database import Base

from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text, JSON
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.orm import relationship


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, nullable=False, index=True)
    email = Column(String(100), unique=True, nullable=False, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    queries = relationship("Query", back_populates="user")
    bookmarks = relationship("Bookmark", back_populates="user")


class Standard(Base):
    __tablename__ = "standards"

    id = Column(Integer, primary_key=True, index=True)
    standard_id = Column(String(50), unique=True, nullable=False, index=True)
    standard_number = Column(String(50), nullable=False)
    title = Column(String(500), nullable=False)
    short_title = Column(String(255), nullable=True)
    edition = Column(String(100), nullable=True)
    year = Column(Integer, nullable=False)
    reaffirmation_year = Column(Integer, nullable=True)
    status = Column(String(30), nullable=False)
    domain = Column(String(255), nullable=True)
    category = Column(String(255), nullable=True)
    department = Column(String(255), nullable=True)
    technical_committee = Column(String(255), nullable=True)
    ics_code = Column(String(30), nullable=True)
    scope = Column(Text, nullable=True)
    description = Column(Text, nullable=True)
    key_requirements = Column(JSON, nullable=True)
    sections = Column(JSON, nullable=True)
    applicable_products_or_industries = Column(ARRAY(String), nullable=True)
    keywords = Column(ARRAY(String), nullable=True)
    related_standards = Column(JSON, nullable=True)
    source = Column(String(255), nullable=True)
    source_url = Column(String(500), nullable=True)
    citation = Column(JSON, nullable=True)
    meta = Column(JSON, nullable=True)
    embedding_id = Column(String(120), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    bookmarks = relationship("Bookmark", back_populates="standard")


class Query(Base):
    __tablename__ = "queries"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    query_text = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="queries")


class Bookmark(Base):
    __tablename__ = "bookmarks"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    standard_id = Column(Integer, ForeignKey("standards.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="bookmarks")
    standard = relationship("Standard", back_populates="bookmarks")