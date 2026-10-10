from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.dependencies import get_db, get_optional_current_user
from app.models.user import User
from app.schemas.progress import ProgressResponse
from app.services.analytics_service import AnalyticsService

router = APIRouter(prefix="/progress", tags=["Learning Progress"])


@router.get("/{user_id}", response_model=ProgressResponse)
def get_user_progress(user_id: int, db: Session = Depends(get_db)):
    """Returns comprehensive learning progress, weekly activity, and concept mastery for a student."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        # Create or retrieve fallback user
        user = db.query(User).first()
        if not user:
            user = User(
                name="Dheepana K.N.",
                email="dheepana.kn@college.edu",
            )
            db.add(user)
            db.commit()
            db.refresh(user)

    data = AnalyticsService.get_progress_dashboard(db, user.id)
    return data
