from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Float, DateTime
from sqlalchemy.orm import relationship
from app.database.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=True)
    auth_provider = Column(String(50), default="local")  # "local", "google"
    avatar = Column(String(500), nullable=True, default="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250")
    department = Column(String(255), default="Artificial Intelligence & Data Science")
    semester = Column(String(100), default="Semester 6")
    streak = Column(Integer, default=7)
    topics_completed = Column(Integer, default=0)
    quizzes_taken = Column(Integer, default=0)
    average_score = Column(Float, default=0.0)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # Relationships
    lessons = relationship("Lesson", back_populates="user", cascade="all, delete-orphan")
    quizzes = relationship("Quiz", back_populates="user", cascade="all, delete-orphan")
    attempts = relationship("QuizAttempt", back_populates="user", cascade="all, delete-orphan")
    projects = relationship("PracticalProject", back_populates="user", cascade="all, delete-orphan")
    project_submissions = relationship("ProjectSubmission", back_populates="user", cascade="all, delete-orphan")
    progress_records = relationship("LearningProgress", back_populates="user", cascade="all, delete-orphan")
