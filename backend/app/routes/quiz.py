from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.dependencies import get_db, get_optional_current_user, get_current_user
from app.models.quiz import Quiz
from app.models.lesson import Lesson
from app.models.user import User
from app.schemas.quiz import (
    QuizGenerateRequest,
    QuizResponse,
    QuizSubmitRequest,
    QuizSubmitResponse,
    QuestionPublic,
)
from app.services.quiz_service import QuizService

router = APIRouter(prefix="/quizzes", tags=["Quizzes"])


def sanitize_question_for_student(q) -> QuestionPublic:
    """Sanitizes question to NEVER expose correct answers or hidden test cases during quiz taking."""
    sanitized_coding = None
    if q.coding_details:
        sanitized_coding = {
            "problem_statement": q.coding_details.get("problem_statement"),
            "requirements": q.coding_details.get("requirements", []),
            "input_description": q.coding_details.get("input_description"),
            "output_description": q.coding_details.get("output_description"),
            "constraints": q.coding_details.get("constraints"),
            "sample_input": q.coding_details.get("sample_input"),
            "sample_output": q.coding_details.get("sample_output"),
            "starter_code": q.coding_details.get("starter_code"),
            # Exclude hidden test cases and solution code!
        }

    return QuestionPublic(
        id=q.id,
        question_type=q.question_type,
        question_text=q.question_text,
        options=q.options,
        marks=q.marks,
        difficulty=q.difficulty,
        related_concept=q.related_concept,
        coding_details=sanitized_coding,
    )


@router.post("/generate", response_model=QuizResponse, status_code=status.HTTP_201_CREATED)
def generate_quiz(
    payload: QuizGenerateRequest,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user),
):
    """Generates a complete diagnostic quiz based on the lesson content,
    persisting all questions while hiding correct answers in the response.
    """
    quiz = QuizService.create_or_generate_quiz(
        db=db,
        topic=payload.topic,
        user_id=current_user.id if current_user else None,
        lesson_id=payload.lesson_id,
        difficulty=payload.difficulty or "Intermediate",
    )

    public_questions = [sanitize_question_for_student(q) for q in quiz.questions]

    return QuizResponse(
        id=quiz.id,
        lesson_id=quiz.lesson_id,
        topic=quiz.topic,
        difficulty=quiz.difficulty,
        questions=public_questions,
    )


@router.get("/{quiz_id}", response_model=QuizResponse)
def get_quiz(quiz_id: int, db: Session = Depends(get_db)):
    """Retrieves quiz for the student. Correct answers are strictly hidden."""
    quiz = db.query(Quiz).filter(Quiz.id == quiz_id).first()
    if not quiz:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Quiz with ID {quiz_id} not found.",
        )

    public_questions = [sanitize_question_for_student(q) for q in quiz.questions]

    return QuizResponse(
        id=quiz.id,
        lesson_id=quiz.lesson_id,
        topic=quiz.topic,
        difficulty=quiz.difficulty,
        questions=public_questions,
    )


@router.post("/{quiz_id}/submit", response_model=QuizSubmitResponse)
def submit_quiz(
    quiz_id: int,
    payload: QuizSubmitRequest,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user),
):
    """Evaluates student quiz answers across all question types,
    stores results, and returns diagnostic score, weak subtopics for pie charts, and recommendations.
    """
    quiz = db.query(Quiz).filter(Quiz.id == quiz_id).first()
    if not quiz:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Quiz with ID {quiz_id} not found.",
        )

    # If guest user, assign or retrieve a default demo user
    user = current_user
    if not user:
        user = db.query(User).first()
        if not user:
            user = User(
                name="Dheepana K.N.",
                email="dheepana.kn@college.edu",
                department="Artificial Intelligence & Data Science",
                semester="Semester 6",
            )
            db.add(user)
            db.commit()
            db.refresh(user)

    result = QuizService.submit_and_evaluate_quiz(
        db=db,
        quiz=quiz,
        user=user,
        answers=payload.answers,
    )
    return result
