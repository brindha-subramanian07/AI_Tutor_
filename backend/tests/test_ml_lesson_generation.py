import ast
from fastapi.testclient import TestClient
from app.main import app


def test_basics_of_machine_learning_e2e(client):
    """End-to-end test verifying the 8-stage educational pipeline
    for the topic 'Basics of Machine Learning'.
    """
    payload = {
        "topic": "Basics of Machine Learning",
        "category": "Artificial Intelligence",
        "difficulty": "Beginner",
        "force_regenerate": True
    }

    # 1. Generate lesson
    response = client.post("/api/lessons", json=payload)
    assert response.status_code == 201, f"Failed to generate lesson: {response.text}"
    lesson_data = response.json()

    assert "Basics of Machine Learning" in lesson_data["title"]
    assert lesson_data["difficulty"] == "Beginner"
    content = lesson_data["content"]
    assert content is not None

    slides = content["slides"]
    # 2. Must contain exactly 8 pedagogically structured scenes
    assert len(slides) == 8, f"Expected 8 scenes for Basics of Machine Learning, got {len(slides)}"

    expected_visual_types = [
        "ml_paradigm_shift",
        "ml_spam_classifier",
        "ml_workflow_pipeline",
        "ml_paradigms_matrix",
        "ml_train_test_split",
        "ml_worked_example",
        "ml_evaluation_metrics",
        "ml_summary_checklist"
    ]

    for idx, slide in enumerate(slides):
        # Verify scene attributes
        assert slide["id"] == idx + 1
        assert len(slide["title"].strip()) > 0
        assert len(slide["narration"].strip()) > 30, f"Scene {idx+1} narration is too short"
        assert slide["estimated_duration_sec"] >= 15, f"Scene {idx+1} duration is unrealistic"
        assert slide["visual_type"] == expected_visual_types[idx], f"Scene {idx+1} visual mismatch"
        assert slide["visual_data"] is not None

        # Verify that all Python code blocks have 100% valid syntax via AST parsing
        code = slide.get("code")
        if code:
            snippet = code.get("snippet") if isinstance(code, dict) else code
            if snippet and snippet.strip():
                try:
                    ast.parse(snippet)
                except SyntaxError as e:
                    assert False, f"Syntax error in scene {idx+1} code: {e}\nCode:\n{snippet}"

    # 3. Verify key concepts & code examples
    assert len(content.get("keyConcepts", [])) >= 4
    assert len(content.get("codeExamples", [])) >= 1
    assert content.get("practicalTask") is not None

    # 4. Generate aligned quiz based on this completed lesson
    quiz_res = client.post("/api/quizzes/generate", json={
        "topic": "Basics of Machine Learning",
        "lesson_id": lesson_data["id"],
        "difficulty": "Beginner"
    })
    assert quiz_res.status_code == 201
    quiz_data = quiz_res.json()
    questions = quiz_data["questions"]

    # Verify comprehensive assessment with all supported question types
    assert len(questions) >= 10, f"Expected at least 10 questions, got {len(questions)}"
    q_types = {q["question_type"] for q in questions}
    assert "mcq" in q_types
    assert "true_false" in q_types
    assert "fill_blank" in q_types
    assert "coding" in q_types

    # Ensure student questions DO NOT expose correct answers before submission
    for q in questions:
        assert "correct_answer" not in q

    # 5. Submit quiz answers and verify grading
    # Answer the first question (correct index 0)
    submission_payload = {
        "answers": {
            str(questions[0]["id"]): 0
        }
    }
    submit_res = client.post(f"/api/quizzes/{quiz_data['id']}/submit", json=submission_payload)
    assert submit_res.status_code == 200
    submit_data = submit_res.json()
    assert "score" in submit_data
    assert "percentage" in submit_data
    assert "details" in submit_data
