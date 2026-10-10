from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Float, Boolean, Text, JSON, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database.database import Base


class PracticalProject(Base):
    __tablename__ = "practical_projects"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    lesson_id = Column(Integer, ForeignKey("lessons.id", ondelete="SET NULL"), nullable=True)
    topic = Column(String(255), index=True, nullable=False)
    title = Column(String(255), nullable=False)
    scenario = Column(Text, nullable=False)
    problem_statement = Column(Text, nullable=False)
    objective = Column(Text, nullable=True)
    requirements = Column(JSON, default=list)  # List of requirement strings
    expected_functionality = Column(Text, nullable=True)
    input_description = Column(Text, nullable=True)
    expected_output = Column(Text, nullable=True)
    constraints = Column(Text, nullable=True)
    evaluation_criteria = Column(JSON, default=list)
    skills_tested = Column(JSON, default=list)
    hints = Column(JSON, default=list)
    starter_code = Column(Text, nullable=True)
    solution_code = Column(Text, nullable=True)
    test_cases = Column(JSON, default=list)
    is_coding_project = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    # Relationships
    user = relationship("User", back_populates="projects")
    lesson = relationship("Lesson", back_populates="projects")
    submissions = relationship("ProjectSubmission", back_populates="project", cascade="all, delete-orphan")


class ProjectSubmission(Base):
    __tablename__ = "project_submissions"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("practical_projects.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    submitted_solution = Column(Text, nullable=False)
    score = Column(Float, default=0.0)
    percentage = Column(Float, default=0.0)
    feedback = Column(Text, nullable=True)
    completed_requirements = Column(JSON, default=list)
    missing_requirements = Column(JSON, default=list)
    improvement_suggestions = Column(JSON, default=list)
    evaluation_details = Column(JSON, default=dict)
    submitted_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    # Relationships
    project = relationship("PracticalProject", back_populates="submissions")
    user = relationship("User", back_populates="project_submissions")
