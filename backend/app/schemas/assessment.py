from typing import Any, Dict, List, Optional
from pydantic import BaseModel
from app.schemas.quiz import WeakSubtopicItem, StrengthSubtopicItem


class ConceptPerformanceItem(BaseModel):
    concept: str
    performance: float


class AssessmentAnalysisResponse(BaseModel):
    attempt_id: int
    total_score: float
    percentage: float
    correct: int
    incorrect: int
    partial: int
    not_attempted: int
    strong_concepts: List[str]
    weak_concepts: List[str]
    needs_practice: List[str]
    project_score: Optional[float] = None
    weak_subtopics: List[WeakSubtopicItem]
    strengths_subtopics: List[StrengthSubtopicItem]
    concept_analysis: List[ConceptPerformanceItem]
    next_recommendations: List[Dict[str, Any]]
