# AI Tutor - Personalized & Collaborative AI-Powered Learning Platform

An AI-driven educational web platform featuring visual interactive lectures, diagnostic multi-format quizzes with immediate deep feedback, an isolated Python code sandbox, and gamified mastery analytics.

---

## 🚀 Features

- **Interactive Visual Lessons**: Adaptive lesson generation powered by Google Gemini AI.
- **Diagnostic Quizzes & Assessments**: Real-time evaluation, mastery wheels, knowledge gap analytics, and personalized recommendations.
- **In-Browser Python Code Sandbox**: Secure, isolated code execution runner with static AST security inspection and instant test evaluation.
- **Gamified Student Dashboard**: Streaks, progress metrics, concept mastery breakdown, and leaderboard statistics.
- **Modern Responsive UI**: Built with React 18, Vite, Lucide Icons, and Tailwind CSS.
- **Robust Enterprise API**: FastAPI backend with SQLAlchemy ORM, Alembic migrations, JWT authentication, and Google OAuth support.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS
- **Icons & Effects**: Lucide React, Canvas Confetti

### Backend
- **Framework**: FastAPI (Python 3.13+) & Uvicorn
- **Database**: PostgreSQL / SQLite with SQLAlchemy 2.0 ORM & Alembic
- **Authentication**: JWT (PyJWT), Bcrypt, Google OAuth
- **AI Integration**: Google Gemini AI SDK
- **Execution Engine**: Secure isolated subprocess execution sandbox

---

## 📦 Project Structure

```text
├── FRONTEND/              # Vite + React Frontend Application
│   ├── src/
│   │   ├── components/    # Reusable UI components (tutor, quiz, sandbox, dashboard)
│   │   ├── services/      # API clients and utilities
│   │   ├── App.jsx        # Root application component
│   │   └── index.css      # Core styling and theme tokens
│   ├── package.json
│   └── vite.config.js
│
├── backend/               # FastAPI Backend Service
│   ├── app/
│   │   ├── core/          # App config, database session, security & auth utilities
│   │   ├── models/        # SQLAlchemy database schemas
│   │   ├── routes/        # API route handlers (auth, lessons, quizzes, code, etc.)
│   │   └── services/      # Gemini AI integration, code execution runner
│   ├── tests/             # Pytest test suite
│   ├── requirements.txt
│   └── alembic.ini
│
└── README.md
```

---

## ⚡ Quickstart & Local Setup

### 1. Backend Setup

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# macOS / Linux
source venv/bin/activate

pip install -r requirements.txt
cp .env.example .env     # Update your GEMINI_API_KEY and secrets in .env
uvicorn app.main:app --reload --port 8000
```

The interactive Swagger API documentation will be available at:
`http://localhost:8000/docs`

### 2. Frontend Setup

```bash
cd FRONTEND
npm install
npm run dev
```

The application will be available at:
`http://localhost:5173`
