# AI Tutor - Enterprise FastAPI Backend

High-performance, secure backend for the AI Tutor personalized & collaborative educational web platform. Powered by **FastAPI**, **PostgreSQL / SQLite with SQLAlchemy ORM**, **Alembic**, **Official Google Gemini AI SDK**, and **Isolated Sandbox Code Execution**.

---

## Architecture & Technology Stack

| Layer | Technology |
|---|---|
| **Framework** | Python 3.13+, FastAPI, Uvicorn (ASGI) |
| **Database** | PostgreSQL / SQLite fallback, SQLAlchemy 2.0 ORM, Alembic |
| **Authentication** | JWT (PyJWT), Bcrypt password hashing, Google OAuth integration |
| **AI Engine** | Official Google Gemini Python SDK (`google-genai` / `google-generativeai`) |
| **Code Sandbox** | Isolated subprocess runner with AST static security validation and timeout handling |
| **Validation** | Pydantic v2 & Pydantic Settings |
| **Testing** | Pytest, FastAPI TestClient |
| **API Docs** | Interactive OpenAPI / Swagger UI at `/docs`, ReDoc at `/redoc` |

---

## Database Entities & Tables

1. **`users`**:
   - `id`, `name`, `email`, `hashed_password`, `auth_provider`, `avatar`, `department`, `semester`, `streak`, `topics_completed`, `quizzes_taken`, `average_score`, `created_at`, `updated_at`
2. **`lessons`**:
   - `id`, `lesson_slug`, `user_id`, `topic`, `title`, `category`, `difficulty`, `duration`, `summary`, `content` (slides, key concepts, code examples, practical task), `created_at`, `updated_at`
3. **`quizzes`**:
   - `id`, `lesson_id`, `user_id`, `topic`, `difficulty`, `created_at`
4. **`questions`**:
   - `id`, `quiz_id`, `question_type` (MCQ, True/False, Fill-in-the-Blank, Coding, Application), `question_text`, `options`, `correct_answer` (*strictly hidden from students during quiz taking*), `explanation`, `marks`, `difficulty`, `related_concept`, `coding_details`
5. **`quiz_attempts`**:
   - `id`, `user_id`, `quiz_id`, `start_time`, `submission_time`, `score`, `total_marks`, `percentage`, `status`
6. **`quiz_answers`**:
   - `id`, `attempt_id`, `question_id`, `student_answer`, `is_correct`, `marks_obtained`, `feedback`
7. **`assessment_results`**:
   - `id`, `attempt_id`, `user_id`, `overall_score`, `percentage`, `correct_count`, `incorrect_count`, `partial_count`, `not_attempted_count`, `strong_concepts`, `weak_concepts`, `needs_practice_concepts`, `weak_subtopics` (for pie chart slices), `strengths_subtopics` (for mastery wheel), `concept_analysis`, `next_recommendations`
8. **`practical_projects`**:
   - `id`, `user_id`, `lesson_id`, `topic`, `title`, `scenario`, `problem_statement`, `objective`, `requirements`, `expected_functionality`, `input_description`, `expected_output`, `constraints`, `evaluation_criteria`, `skills_tested`, `hints`, `starter_code`, `solution_code`, `test_cases`, `is_coding_project`
9. **`project_submissions`**:
   - `id`, `project_id`, `user_id`, `submitted_solution`, `score`, `percentage`, `feedback`, `completed_requirements`, `missing_requirements`, `improvement_suggestions`, `evaluation_details`
10. **`learning_progress`**:
    - `id`, `user_id`, `topic`, `mastery_score`, `attempts_count`, `strong_areas`, `weak_areas`, `last_studied_at`

---

## API Endpoints Summary

### Authentication (`/api/auth`)
- `POST /api/auth/register`: Register new student account with email and password
- `POST /api/auth/login`: Authenticate email & password, return JWT token
- `GET /api/auth/me`: Get current authenticated student profile (Bearer token protected)
- `POST /api/auth/google`: Google OAuth sign-in / registration

### Lessons (`/api/lessons`)
- `POST /api/lessons`: Request or generate interactive visual lesson using Gemini AI
- `GET /api/lessons`: List all curriculum lessons
- `GET /api/lessons/{id_or_slug}`: Retrieve specific lesson by ID or URL slug

### Diagnostic Quizzes (`/api/quizzes`)
- `POST /api/quizzes/generate`: Generate diagnostic assessment (MCQ, True/False, Fill in blanks, Coding) with correct answers hidden
- `GET /api/quizzes/{id}`: Retrieve quiz questions (with correct answers safely stripped)
- `POST /api/quizzes/{id}/submit`: Submit answers, evaluate against criteria, compute score and weak subtopics for pie charts

### Safe Code Sandbox (`/api/code`)
- `POST /api/code/execute`: Isolated sandbox execution against test cases with AST sanitization and timeout defense

### Assessment Analytics (`/api/assessment`)
- `GET /api/assessment/{attempt_id}`: Retrieve diagnostic analysis, pie chart slices, and concept mastery

### Practical Mini Projects (`/api/projects`)
- `POST /api/projects/generate`: Generate real-world mini project based on lesson topic
- `GET /api/projects/{id}`: Retrieve project details, scenario, requirements, and starter code
- `POST /api/projects/{id}/submit`: Submit project solution, execute tests in sandbox, receive score & feedback

### Learning Progress & Recommendations
- `GET /api/progress/{user_id}`: Comprehensive student progress, weekly activity, and mastery tracking
- `GET /api/recommendations/{user_id}`: Dynamic personalized next learning topics based on diagnostic results

---

## Quickstart & Local Execution

### 1. Backend Setup
From the `backend/` directory:
```bash
# Activate virtual environment (Windows PowerShell)
.\venv\Scripts\Activate.ps1

# Install dependencies (if not already installed)
pip install -r requirements.txt

# Run the FastAPI server with live reloading
uvicorn app.main:app --reload --port 8000
```

The backend will start at:
- **API Base:** `http://localhost:8000`
- **Interactive Swagger Docs:** `http://localhost:8000/docs`
- **ReDoc Documentation:** `http://localhost:8000/redoc`

### 2. Frontend Execution
From the `FRONTEND/` directory:
```bash
# Run Vite dev server
npm.cmd run dev
```
The frontend will run at:
- **URL:** `http://localhost:5173`

---

## Running Test Suite
```bash
cd backend
.\venv\Scripts\pytest.exe -v
```
All 12 unit and integration tests validate authentication, protected endpoints, quiz generation, sandbox execution security, and assessment analytics.
   