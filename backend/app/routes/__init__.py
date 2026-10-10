from app.routes.auth import router as auth_router
from app.routes.lessons import router as lessons_router
from app.routes.quiz import router as quiz_router
from app.routes.assessment import router as assessment_router
from app.routes.projects import router as projects_router
from app.routes.progress import router as progress_router
from app.routes.recommendations import router as recommendations_router
from app.routes.code import router as code_router

__all__ = [
    "auth_router",
    "lessons_router",
    "quiz_router",
    "assessment_router",
    "projects_router",
    "progress_router",
    "recommendations_router",
    "code_router",
]
