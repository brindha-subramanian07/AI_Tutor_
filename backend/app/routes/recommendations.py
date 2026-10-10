from typing import Any, Dict, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.dependencies import get_db
from app.models.user import User
from app.services.recommendation_service import RecommendationService

router = APIRouter(prefix="/recommendations", tags=["Personalized Recommendations"])


@router.get("/{user_id}", response_model=List[Dict[str, Any]])
def get_user_recommendations(user_id: int, db: Session = Depends(get_db)):
    """Returns tailored next learning recommendations derived from the student's actual performance."""
    user = db.query(User).filter(User.id == user_id).first()
    target_id = user.id if user else user_id
    recs = RecommendationService.get_user_recommendations(db, target_id)
    return recs
