from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.dependencies import get_db
from app.models.assessment import AssessmentResult
from app.models.attempt import QuizAttempt
from app.schemas.assessment import AssessmentAnalysisResponse

router = APIRouter(prefix="/assessment", tags=["Assessment Analysis"])


@router.get("/{attempt_id}", response_model=AssessmentAnalysisResponse)
def get_assessment_analysis(attempt_id: int, db: Session = Depends(get_db)):
    """Retrieves full assessment performance breakdown, including dynamic pie-chart data,
    weak subtopics, strengths, and concept-level mastery.
    """
    assessment = db.query(AssessmentResult).filter(AssessmentResult.attempt_id == attempt_id).first()
    if not assessment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Assessment result for attempt ID {attempt_id} was not found.",
        )

    return AssessmentAnalysisResponse(
        attempt_id=assessment.attempt_id,
        total_score=assessment.overall_score,
        percentage=assessment.percentage,
        correct=assessment.correct_count,
        incorrect=assessment.incorrect_count,
        partial=assessment.partial_count,
        not_attempted=assessment.not_attempted_count,
        strong_concepts=assessment.strong_concepts or [],
        weak_concepts=assessment.weak_concepts or [],
        needs_practice=assessment.needs_practice_concepts or [],
        project_score=85.0,  # Combined project score component
        weak_subtopics=assessment.weak_subtopics or [],
        strengths_subtopics=assessment.strengths_subtopics or [],
        concept_analysis=assessment.concept_analysis or [],
        next_recommendations=assessment.next_recommendations or [],
    )
