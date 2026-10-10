from datetime import datetime, timezone
from sqlalchemy import Column, Integer, Float, JSON, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database.database import Base


class AssessmentResult(Base):
    __tablename__ = "assessment_results"

    id = Column(Integer, primary_key=True, index=True)
    attempt_id = Column(Integer, ForeignKey("quiz_attempts.id", ondelete="CASCADE"), unique=True, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    overall_score = Column(Float, default=0.0)
    percentage = Column(Float, default=0.0)
    total_questions = Column(Integer, default=0)
    correct_count = Column(Integer, default=0)
    incorrect_count = Column(Integer, default=0)
    partial_count = Column(Integer, default=0)
    not_attempted_count = Column(Integer, default=0)

    # Conceptual analysis
    strong_concepts = Column(JSON, default=list)  # List of string concept names
    weak_concepts = Column(JSON, default=list)    # List of string concept names
    needs_practice_concepts = Column(JSON, default=list)

    # Detailed pie chart & analytics objects
    weak_subtopics = Column(JSON, default=list)  # List of dicts for pie chart slices
    strengths_subtopics = Column(JSON, default=list)  # List of dicts for mastery wheel
    concept_analysis = Column(JSON, default=list)  # [{"concept": "...", "performance": 85}]
    next_recommendations = Column(JSON, default=list)

    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    # Relationships
    attempt = relationship("QuizAttempt", back_populates="assessment")
