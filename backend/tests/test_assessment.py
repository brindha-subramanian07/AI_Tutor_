def test_assessment_and_pie_chart_data(client):
    # 1. Generate Quiz
    gen_res = client.post("/api/quizzes/generate", json={"topic": "Python Conditionals", "difficulty": "Intermediate"})
    assert gen_res.status_code == 201
    quiz_id = gen_res.json()["id"]

    # 2. Submit quiz to produce an attempt and assessment
    sub_res = client.post(f"/api/quizzes/{quiz_id}/submit", json={"answers": {}})
    assert sub_res.status_code == 200
    attempt_id = sub_res.json()["attempt_id"]

    # 3. Retrieve assessment by attempt_id
    res_ass = client.get(f"/api/assessment/{attempt_id}")
    assert res_ass.status_code == 200
    data = res_ass.json()

    assert "total_score" in data
    assert "percentage" in data
    assert "correct" in data
    assert "incorrect" in data
    assert "weak_subtopics" in data
    assert "strengths_subtopics" in data
    assert "concept_analysis" in data
    assert "next_recommendations" in data
