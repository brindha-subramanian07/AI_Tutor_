import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from app.core.config import settings
from app.database.database import init_db, SessionLocal
from app.models.user import User
from app.models.lesson import Lesson
from app.models.quiz import Quiz
from app.models.question import Question
from app.routes import (
    auth_router,
    lessons_router,
    quiz_router,
    assessment_router,
    projects_router,
    progress_router,
    recommendations_router,
    code_router,
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("ai_tutor_api")


def seed_initial_curriculum():
    """Seeds default student and initial lessons if the database is newly initialized."""
    db = SessionLocal()
    try:
        # Seed default student
        user = db.query(User).first()
        if not user:
            user = User(
                name="Dheepana K.N.",
                email="dheepana.kn@college.edu",
                department="Artificial Intelligence & Data Science",
                semester="Semester 6",
                streak=7,
                topics_completed=24,
                quizzes_taken=18,
                average_score=86.0,
            )
            db.add(user)
            db.commit()
            db.refresh(user)
            logger.info("Default student profile seeded.")

        # Seed 'loops-in-python' lesson if not present
        lesson = db.query(Lesson).filter(Lesson.lesson_slug == "loops-in-python").first()
        if not lesson:
            from app.services.gemini_service import GeminiService
            content = GeminiService.generate_lesson_content("Loops in Python: For & While Mechanisms", "Beginner")
            lesson = Lesson(
                lesson_slug="loops-in-python",
                user_id=user.id,
                topic="Loops in Python: For & While Mechanisms",
                title="Loops in Python: For & While Mechanisms",
                category="Programming & Python",
                difficulty="Beginner",
                duration="12 mins",
                summary="Master iterative execution in Python, internal pointer mechanics of iterables, range generators, and avoiding infinite loops.",
                content=content,
            )
            db.add(lesson)
            db.commit()
            db.refresh(lesson)
            logger.info("Initial lesson 'loops-in-python' seeded.")

            # Seed an initial quiz for loops-in-python
            from app.services.quiz_service import QuizService
            QuizService.create_or_generate_quiz(
                db=db,
                topic=lesson.topic,
                user_id=user.id,
                lesson_id=lesson.id,
                difficulty="Intermediate",
            )
            logger.info("Initial quiz for 'loops-in-python' seeded.")

    except Exception as exc:
        logger.error(f"Error seeding database: {exc}")
    finally:
        db.close()


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Initialize tables and seed initial data
    logger.info("Initializing database tables...")
    init_db()
    seed_initial_curriculum()
    yield
    # Teardown
    logger.info("Application shutting down...")


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Enterprise Backend for AI Tutor with Google Gemini AI, Safe Code Execution, and Relational Database.",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    lifespan=lifespan,
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Global Exception Handlers
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "error": "Validation Error",
            "detail": exc.errors(),
        },
    )


@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception on {request.method} {request.url.path}: {exc}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": "Internal Server Error",
            "message": "An unexpected error occurred. Please try again later.",
        },
    )


# Register all API sub-routers
app.include_router(auth_router, prefix=settings.API_V1_STR)
app.include_router(lessons_router, prefix=settings.API_V1_STR)
app.include_router(quiz_router, prefix=settings.API_V1_STR)
app.include_router(assessment_router, prefix=settings.API_V1_STR)
app.include_router(projects_router, prefix=settings.API_V1_STR)
app.include_router(progress_router, prefix=settings.API_V1_STR)
app.include_router(recommendations_router, prefix=settings.API_V1_STR)
app.include_router(code_router, prefix=settings.API_V1_STR)


@app.get("/", tags=["Health"])
def root():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "docs": "/docs",
        "redoc": "/redoc",
    }


@app.get("/health", tags=["Health"])
def health_check():
    return {"status": "ok"}


@app.get("/openapi.json", include_in_schema=False)
def get_openapi_alias():
    return app.openapi()
