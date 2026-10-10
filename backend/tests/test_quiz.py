def test_quiz_generation_and_submission(client):
    # Generate quiz
    gen_payload = {
        "topic": "Python Loops",
        "difficulty": "Intermediate",
    }
    res_gen = client.post("/api/quizzes/generate", json=gen_payload)
    assert res_gen.status_code == 201
    quiz_data = res_gen.json()
    quiz_id = quiz_data["id"]
    questions = quiz_data["questions"]
    assert len(questions) >= 5

    # CRITICAL CHECK: Verify correct answers are NOT exposed!
    for q in questions:
        assert "correct_answer" not in q
        assert "correctAnswer" not in q

    # Retrieve quiz via GET
    res_get = client.get(f"/api/quizzes/{quiz_id}")
    assert res_get.status_code == 200
    for q in res_get.json()["questions"]:
        assert "correct_answer" not in q
        assert "correctAnswer" not in q

    # Submit answers
    # Answer first question with option 0, second with 0, etc.
    answers_map = {}
    for q in questions:
        if q["question_type"] == "mcq":
            answers_map[q["id"]] = 0
        elif q["question_type"] == "true_false":
            answers_map[q["id"]] = "True"
        elif q["question_type"] == "fill_blank":
            answers_map[q["id"]] = "break"
        elif q["question_type"] == "coding":
            answers_map[q["id"]] = "def solve(): return True"

    sub_res = client.post(f"/api/quizzes/{quiz_id}/submit", json={"answers": answers_map})
    assert sub_res.status_code == 200
    eval_data = sub_res.json()

    assert "score" in eval_data
    assert "percentage" in eval_data
    assert "weakSubtopics" in eval_data
    assert "strengthsSubtopics" in eval_data
    assert "nextRecommendations" in eval_data
    assert len(eval_data["details"]) == len(questions)
