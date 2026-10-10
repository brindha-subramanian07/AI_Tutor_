from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, JSON, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database.database import Base


class Lesson(Base):
    __tablename__ = "lessons"

    id = Column(Integer, primary_key=True, index=True)
    lesson_slug = Column(String(255), unique=True, index=True, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    topic = Column(String(255), index=True, nullable=False)
    title = Column(String(255), nullable=False)
    category = Column(String(255), default="AI Synthesized Course")
    difficulty = Column(String(100), default="Beginner")
    duration = Column(String(50), default="12 mins")
    summary = Column(Text, nullable=True)
    # JSON content containing slides, key_concepts, code_examples, practical_task
    content = Column(JSON, nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # Relationships
    user = relationship("User", back_populates="lessons")
    quizzes = relationship("Quiz", back_populates="lesson", cascade="all, delete-orphan")
    projects = relationship("PracticalProject", back_populates="lesson", cascade="all, delete-orphan")
