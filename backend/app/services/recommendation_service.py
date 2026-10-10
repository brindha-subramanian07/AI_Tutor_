from typing import Any, Dict, List
from sqlalchemy.orm import Session
from sqlalchemy import desc
from app.models.assessment import AssessmentResult
from app.models.progress import LearningProgress
from app.services.gemini_service import GeminiService


class RecommendationService:
    @classmethod
    def get_user_recommendations(cls, db: Session, user_id: int) -> List[Dict[str, Any]]:
        """Generates dynamic recommendations based on latest assessment results and historical progress."""
        latest_assessment = db.query(AssessmentResult).filter(
            AssessmentResult.user_id == user_id
        ).order_by(desc(AssessmentResult.created_at)).first()

        if latest_assessment and latest_assessment.next_recommendations:
            return latest_assessment.next_recommendations

        # Check learning progress records
        progress = db.query(LearningProgress).filter(
            LearningProgress.user_id == user_id
        ).all()

        weak_all = []
        strong_all = []
        for p in progress:
            if p.weak_areas:
                weak_all.extend(p.weak_areas)
            if p.strong_areas:
                strong_all.extend(p.strong_areas)

        topic = progress[0].topic if progress else "Python Programming & Algorithmic Design"
        return GeminiService.generate_recommendations(weak_all, strong_all, topic)
