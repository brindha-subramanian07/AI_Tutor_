import re
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.dependencies import get_db, get_optional_current_user
from app.models.lesson import Lesson
from app.models.user import User
from app.schemas.lesson import LessonCreateRequest, LessonResponse
from app.services.gemini_service import GeminiService

router = APIRouter(prefix="/lessons", tags=["Lessons"])


def make_slug(topic: str) -> str:
    slug = re.sub(r"[^a-zA-Z0-9]+", "-", topic.lower()).strip("-")
    return slug[:50] or "lesson"


@router.post("", response_model=LessonResponse, status_code=status.HTTP_201_CREATED)
def create_or_generate_lesson(
    payload: LessonCreateRequest,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user),
):
    """Validates topic, generates interactive lesson slides via Gemini AI,
    persists in the database, and returns the lesson structure.
    """
    topic_clean = payload.topic.strip()
    if not topic_clean:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A valid topic name is required.",
        )

    slug = make_slug(topic_clean)

    # Check if a lesson with this slug already exists
    existing = db.query(Lesson).filter(Lesson.lesson_slug == slug).first()
    is_stale = False
    if existing:
        slides = (existing.content or {}).get("slides", [])
        if len(slides) < 5 or any("explore_machine-le" in str(s) for s in slides):
            is_stale = True

    if existing and not payload.force_regenerate and not is_stale:
        return existing

    # Generate structured lesson content using EducationalLessonPipeline / Gemini
    content = GeminiService.generate_lesson_content(
        topic=topic_clean,
        difficulty=payload.difficulty or "Beginner",
    )

    if existing:
        existing.title = content.get("title", f"{topic_clean} Masterclass")
        existing.category = content.get("category", payload.category or "AI Synthesized Course")
        existing.difficulty = content.get("difficulty", payload.difficulty or "Beginner")
        existing.duration = content.get("duration", "14 mins")
        existing.summary = content.get("summary", f"AI synthesized lecture on {topic_clean}")
        existing.content = content
        db.commit()
        db.refresh(existing)
        return existing

    lesson = Lesson(
        lesson_slug=slug,
        user_id=current_user.id if current_user else None,
        topic=topic_clean,
        title=content.get("title", f"{topic_clean} Masterclass"),
        category=content.get("category", payload.category or "AI Synthesized Course"),
        difficulty=content.get("difficulty", payload.difficulty or "Beginner"),
        duration=content.get("duration", "14 mins"),
        summary=content.get("summary", f"AI synthesized lecture on {topic_clean}"),
        content=content,
    )
    db.add(lesson)
    db.commit()
    db.refresh(lesson)
    return lesson


@router.get("", response_model=List[LessonResponse])
def list_lessons(db: Session = Depends(get_db)):
    """Retrieves all generated and preloaded curriculum lessons."""
    lessons = db.query(Lesson).order_by(Lesson.id.desc()).all()
    return lessons


@router.get("/{lesson_id}", response_model=LessonResponse)
def get_lesson(lesson_id: str, db: Session = Depends(get_db)):
    """Retrieves a specific lesson by integer ID or URL slug."""
    if lesson_id.isdigit():
        lesson = db.query(Lesson).filter(Lesson.id == int(lesson_id)).first()
    else:
        lesson = db.query(Lesson).filter(Lesson.lesson_slug == lesson_id).first()

    if not lesson:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Lesson '{lesson_id}' not found.",
        )
    return lesson
