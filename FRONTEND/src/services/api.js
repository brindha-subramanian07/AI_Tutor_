// API Client Service connecting React Frontend to FastAPI Backend

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const API_PREFIX = `${BASE_URL}/api`;

const getAuthHeaders = () => {
  const token = localStorage.getItem('ai_tutor_token');
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const api = {
  // Authentication
  async register(data) {
    const res = await fetch(`${API_PREFIX}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Registration failed');
    }
    const result = await res.json();
    if (result.access_token) {
      localStorage.setItem('ai_tutor_token', result.access_token);
    }
    return result;
  },

  async login(email, password) {
    const res = await fetch(`${API_PREFIX}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Invalid email or password');
    }
    const result = await res.json();
    if (result.access_token) {
      localStorage.setItem('ai_tutor_token', result.access_token);
    }
    return result;
  },

  async getMe() {
    const res = await fetch(`${API_PREFIX}/auth/me`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) return null;
    return await res.json();
  },

  async googleAuth(googleData) {
    const res = await fetch(`${API_PREFIX}/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(googleData),
    });
    if (!res.ok) {
      throw new Error('Google sign-in failed');
    }
    const result = await res.json();
    if (result.access_token) {
      localStorage.setItem('ai_tutor_token', result.access_token);
    }
    return result;
  },

  logout() {
    localStorage.removeItem('ai_tutor_token');
  },

  // Lessons
  async getLessons() {
    const res = await fetch(`${API_PREFIX}/lessons`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) return [];
    return await res.json();
  },

  async getLesson(lessonId) {
    const res = await fetch(`${API_PREFIX}/lessons/${lessonId}`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) return null;
    return await res.json();
  },

  async createLesson(topic, category = "AI Synthesized Course", difficulty = "Beginner", force_regenerate = false) {
    const res = await fetch(`${API_PREFIX}/lessons`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ topic, category, difficulty, force_regenerate }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Failed to generate lesson');
    }
    return await res.json();
  },

  // Quizzes
  async generateQuiz(topic, lessonId = null, difficulty = "Intermediate") {
    const res = await fetch(`${API_PREFIX}/quizzes/generate`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ topic, lesson_id: lessonId, difficulty }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Failed to generate quiz');
    }
    return await res.json();
  },

  async getQuiz(quizId) {
    const res = await fetch(`${API_PREFIX}/quizzes/${quizId}`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) return null;
    return await res.json();
  },

  async submitQuiz(quizId, answers) {
    const res = await fetch(`${API_PREFIX}/quizzes/${quizId}/submit`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ answers }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Failed to submit quiz');
    }
    return await res.json();
  },

  // Assessment Analysis
  async getAssessment(attemptId) {
    const res = await fetch(`${API_PREFIX}/assessment/${attemptId}`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) return null;
    return await res.json();
  },

  // Practical Mini Projects
  async generateProject(topic, lessonId = null, difficulty = "Intermediate") {
    const res = await fetch(`${API_PREFIX}/projects/generate`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ topic, lesson_id: lessonId, difficulty }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Failed to generate project');
    }
    return await res.json();
  },

  async getProject(projectId) {
    const res = await fetch(`${API_PREFIX}/projects/${projectId}`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) return null;
    return await res.json();
  },

  async submitProject(projectId, submittedSolution) {
    const res = await fetch(`${API_PREFIX}/projects/${projectId}/submit`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ submitted_solution: submittedSolution }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Failed to evaluate project');
    }
    return await res.json();
  },

  // Safe Code Execution Sandbox
  async executeCode(code, language = "python", testCases = []) {
    const res = await fetch(`${API_PREFIX}/code/execute`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ code, language, test_cases: testCases }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Code execution failed');
    }
    return await res.json();
  },

  // Personalized Recommendations
  async getRecommendations(userId) {
    const res = await fetch(`${API_PREFIX}/recommendations/${userId}`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) return [];
    return await res.json();
  },

  // Learning Progress Tracking
  async getProgress(userId) {
    const res = await fetch(`${API_PREFIX}/progress/${userId}`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) return null;
    return await res.json();
  },
};
