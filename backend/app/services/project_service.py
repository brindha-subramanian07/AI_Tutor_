from datetime import datetime, timezone
from typing import Any, Dict, Optional
from sqlalchemy.orm import Session
from app.models.project import PracticalProject, ProjectSubmission
from app.models.user import User
from app.services.gemini_service import GeminiService


class ProjectService:
    @classmethod
    def generate_project(
        cls,
        db: Session,
        topic: str,
        user_id: Optional[int] = None,
        lesson_id: Optional[int] = None,
        difficulty: str = "Intermediate",
    ) -> PracticalProject:
        """Generates a practical mini project and persists it in the database."""
        raw_project = GeminiService.generate_practical_project(topic, difficulty)

        project = PracticalProject(
            user_id=user_id,
            lesson_id=lesson_id,
            topic=topic,
            title=raw_project.get("title", f"{topic} Mini Project"),
            scenario=raw_project.get("scenario", "Real-world engineering implementation."),
            problem_statement=raw_project.get("problem_statement", "Build a working prototype."),
            objective=raw_project.get("objective", "Demonstrate conceptual mastery."),
            requirements=raw_project.get("requirements", []),
            expected_functionality=raw_project.get("expected_functionality", ""),
            input_description=raw_project.get("input_description", ""),
            expected_output=raw_project.get("expected_output", ""),
            constraints=raw_project.get("constraints", ""),
            evaluation_criteria=raw_project.get("evaluation_criteria", []),
            skills_tested=raw_project.get("skills_tested", []),
            hints=raw_project.get("hints", []),
            starter_code=raw_project.get("starter_code", ""),
            solution_code=raw_project.get("solution_code", ""),
            test_cases=raw_project.get("test_cases", []),
            is_coding_project=raw_project.get("is_coding_project", True),
            created_at=datetime.now(timezone.utc),
        )
        db.add(project)
        db.commit()
        db.refresh(project)
        return project

    @classmethod
    def submit_and_evaluate_project(
        cls,
        db: Session,
        project: PracticalProject,
        user: User,
        submitted_solution: str,
    ) -> ProjectSubmission:
        """Evaluates project submission with secure sandbox testing and persists submission record."""
        project_dict = {
            "title": project.title,
            "topic": project.topic,
            "requirements": project.requirements or [],
            "test_cases": project.test_cases or [],
        }

        eval_result = GeminiService.evaluate_project_submission(project_dict, submitted_solution)

        submission = ProjectSubmission(
            project_id=project.id,
            user_id=user.id,
            submitted_solution=submitted_solution,
            score=eval_result.get("score", 0.0),
            percentage=eval_result.get("percentage", 0.0),
            feedback=eval_result.get("feedback", ""),
            completed_requirements=eval_result.get("completed_requirements", []),
            missing_requirements=eval_result.get("missing_requirements", []),
            improvement_suggestions=eval_result.get("improvement_suggestions", []),
            evaluation_details=eval_result.get("evaluation_details", {}),
            submitted_at=datetime.now(timezone.utc),
        )
        db.add(submission)
        db.commit()
        db.refresh(submission)
        return submission
