from sqlalchemy import Column, Integer, String, Text, JSON, ForeignKey
from sqlalchemy.orm import relationship
from app.database.database import Base


class Question(Base):
    __tablename__ = "questions"

    id = Column(Integer, primary_key=True, index=True)
    quiz_id = Column(Integer, ForeignKey("quizzes.id", ondelete="CASCADE"), nullable=False)
    question_type = Column(String(50), nullable=False)  # "mcq", "true_false", "fill_blank", "coding", "application"
    question_text = Column(Text, nullable=False)
    options = Column(JSON, nullable=True)  # List of string options for MCQ
    correct_answer = Column(Text, nullable=False)  # Raw answer / index string (Never exposed to student before submission!)
    explanation = Column(Text, nullable=False)
    marks = Column(Integer, default=1)
    difficulty = Column(String(50), default="intermediate")  # "basic", "intermediate", "application"
    related_concept = Column(String(255), nullable=True)  # E.g. "Termination Conditions & Infinite Loops"
    coding_details = Column(JSON, nullable=True)  # Test cases, starter code, problem statement, constraints, etc.

    # Relationships
    quiz = relationship("Quiz", back_populates="questions")
    answers = relationship("QuizAnswer", back_populates="question", cascade="all, delete-orphan")
