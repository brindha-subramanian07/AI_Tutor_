from typing import Any, Dict, List, Optional
from pydantic import BaseModel


class AreaPerformance(BaseModel):
    subject: str
    mastery: float
    status: str
    tip: Optional[str] = None


class ActivityDay(BaseModel):
    day: str
    hours: float
    quizzes: int
    score: float


class ProgressResponse(BaseModel):
    user_id: int
    overall_percentage: float
    streak_days: int
    topics_mastered: int
    topics_in_progress: int
    total_quiz_attempts: int
    average_accuracy: float
    strong_areas: List[AreaPerformance]
    weak_areas: List[AreaPerformance]
    weekly_activity: List[ActivityDay]
    recent_quiz_scores: List[Dict[str, Any]]
