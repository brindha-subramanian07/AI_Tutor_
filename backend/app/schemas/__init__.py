from app.schemas.auth import (
    UserRegister,
    UserLogin,
    GoogleAuthRequest,
    UserResponse,
    TokenResponse,
)
from app.schemas.lesson import LessonCreateRequest, LessonResponse
from app.schemas.quiz import (
    QuizGenerateRequest,
    QuestionPublic,
    QuizResponse,
    QuizSubmitRequest,
    QuizSubmitResponse,
    QuizEvaluationDetail,
    WeakSubtopicItem,
    StrengthSubtopicItem,
)
from app.schemas.assessment import (
    AssessmentAnalysisResponse,
    ConceptPerformanceItem,
)
from app.schemas.project import (
    ProjectGenerateRequest,
    PracticalProjectResponse,
    ProjectSubmitRequest,
    ProjectSubmitResponse,
)
from app.schemas.progress import ProgressResponse
from app.schemas.code import (
    CodeExecutionRequest,
    CodeExecutionResponse,
    TestCase,
    TestCaseResult,
)

__all__ = [
    "UserRegister",
    "UserLogin",
    "GoogleAuthRequest",
    "UserResponse",
    "TokenResponse",
    "LessonCreateRequest",
    "LessonResponse",
    "QuizGenerateRequest",
    "QuestionPublic",
    "QuizResponse",
    "QuizSubmitRequest",
    "QuizSubmitResponse",
    "QuizEvaluationDetail",
    "WeakSubtopicItem",
    "StrengthSubtopicItem",
    "AssessmentAnalysisResponse",
    "ConceptPerformanceItem",
    "ProjectGenerateRequest",
    "PracticalProjectResponse",
    "ProjectSubmitRequest",
    "ProjectSubmitResponse",
    "ProgressResponse",
    "CodeExecutionRequest",
    "CodeExecutionResponse",
    "TestCase",
    "TestCaseResult",
]
