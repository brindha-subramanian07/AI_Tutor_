from typing import Any, Dict, List, Optional, Union
from pydantic import BaseModel, Field, ConfigDict


class QuizGenerateRequest(BaseModel):
    lesson_id: Optional[int] = None
    topic: str = Field(..., min_length=2, max_length=255)
    lesson_content: Optional[Dict[str, Any]] = None
    difficulty: Optional[str] = "Intermediate"
    desired_distribution: Optional[Dict[str, int]] = None  # e.g. {"mcq": 5, "true_false": 3, "fill_blank": 3, "coding": 2}


class QuestionPublic(BaseModel):
    id: int
    question_type: str
    question_text: str
    options: Optional[List[str]] = None
    marks: int = 1
    difficulty: str = "intermediate"
    related_concept: Optional[str] = None
    coding_details: Optional[Dict[str, Any]] = None  # sanitized: starter_code, problem_statement, requirements (hidden test cases excluded)

    model_config = ConfigDict(from_attributes=True)


class QuizResponse(BaseModel):
    id: int
    lesson_id: Optional[int] = None
    topic: str
    difficulty: str
    questions: List[QuestionPublic]

    model_config = ConfigDict(from_attributes=True)


class QuizSubmitRequest(BaseModel):
    # Maps question_id (as string or int) to student's answer (int index, bool, string, or code)
    answers: Dict[Union[int, str], Any]


class QuizEvaluationDetail(BaseModel):
    questionId: Union[int, str]
    question: str
    question_type: str
    options: Optional[List[str]] = None
    studentAnswer: Any
    correctAnswer: Any
    isCorrect: bool
    marksObtained: float
    explanation: str
    subtopic: str


class WeakSubtopicItem(BaseModel):
    id: str
    name: str
    missedCount: int
    totalQuestions: int
    gapWeight: int
    color: str
    severity: str
    recommendation: str


class StrengthSubtopicItem(BaseModel):
    id: str
    name: str
    correctCount: int
    totalQuestions: int
    accuracy: int
    color: str
    status: str


class QuizSubmitResponse(BaseModel):
    attempt_id: int
    score: float
    percentage: float
    correctCount: int
    incorrectCount: int = 0
    partialCount: int = 0
    notAttemptedCount: int = 0
    correct_count: Optional[int] = None
    incorrect_count: Optional[int] = None
    partial_count: Optional[int] = None
    not_attempted_count: Optional[int] = None
    totalQuestions: int
    total_questions: Optional[int] = None
    accuracy: float
    details: List[QuizEvaluationDetail]
    weakSubtopics: List[WeakSubtopicItem]
    strengthsSubtopics: List[StrengthSubtopicItem]
    weakTopics: List[str]
    strengths: List[str]
    needsPractice: Optional[List[str]] = None
    conceptAnalysis: Optional[List[Dict[str, Any]]] = None
    concept_analysis: Optional[List[Dict[str, Any]]] = None
    nextRecommendations: List[Dict[str, Any]]
    submittedAt: str
