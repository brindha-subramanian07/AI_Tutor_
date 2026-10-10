from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.dependencies import get_db, get_optional_current_user
from app.models.project import PracticalProject
from app.models.user import User
from app.schemas.project import (
    ProjectGenerateRequest,
    PracticalProjectResponse,
    ProjectSubmitRequest,
    ProjectSubmitResponse,
)
from app.services.project_service import ProjectService

router = APIRouter(prefix="/projects", tags=["Practical Mini Projects"])


@router.post("/generate", response_model=PracticalProjectResponse, status_code=status.HTTP_201_CREATED)
def generate_project(
    payload: ProjectGenerateRequest,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user),
):
    """Generates a real-world, practical mini project based on the lesson topic."""
    project = ProjectService.generate_project(
        db=db,
        topic=payload.topic,
        user_id=current_user.id if current_user else None,
        lesson_id=payload.lesson_id,
        difficulty=payload.difficulty or "Intermediate",
    )
    return project


@router.get("/{project_id}", response_model=PracticalProjectResponse)
def get_project(project_id: int, db: Session = Depends(get_db)):
    """Retrieves project requirements and starter code."""
    project = db.query(PracticalProject).filter(PracticalProject.id == project_id).first()
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Project with ID {project_id} not found.",
        )
    return project


@router.post("/{project_id}/submit", response_model=ProjectSubmitResponse)
def submit_project(
    project_id: int,
    payload: ProjectSubmitRequest,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user),
):
    """Evaluates student mini project solution using safe sandbox execution
    and structured criteria verification.
    """
    project = db.query(PracticalProject).filter(PracticalProject.id == project_id).first()
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Project with ID {project_id} not found.",
        )

    user = current_user
    if not user:
        user = db.query(User).first()
        if not user:
            user = User(
                name="Dheepana K.N.",
                email="dheepana.kn@college.edu",
            )
            db.add(user)
            db.commit()
            db.refresh(user)

    submission = ProjectService.submit_and_evaluate_project(
        db=db,
        project=project,
        user=user,
        submitted_solution=payload.submitted_solution,
    )

    return ProjectSubmitResponse(
        submission_id=submission.id,
        project_id=submission.project_id,
        score=submission.score,
        percentage=submission.percentage,
        feedback=submission.feedback,
        completed_requirements=submission.completed_requirements or [],
        missing_requirements=submission.missing_requirements or [],
        improvement_suggestions=submission.improvement_suggestions or [],
        evaluation_details=submission.evaluation_details or {},
    )
