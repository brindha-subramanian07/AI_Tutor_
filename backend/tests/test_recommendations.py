def test_recommendations_and_progress(client):
    # 1. Register a test student
    reg_res = client.post("/api/auth/register", json={
        "name": "Progress User",
        "email": "progressuser@college.edu",
        "password": "password123",
    })
    assert reg_res.status_code == 201
    user_id = reg_res.json()["user"]["id"]

    # 2. Get recommendations
    rec_res = client.get(f"/api/recommendations/{user_id}")
    assert rec_res.status_code == 200
    recs = rec_res.json()
    assert isinstance(recs, list)
    assert len(recs) >= 1
    assert "title" in recs[0]

    # 3. Get learning progress
    prog_res = client.get(f"/api/progress/{user_id}")
    assert prog_res.status_code == 200
    prog = prog_res.json()
    assert prog["user_id"] == user_id
    assert "overall_percentage" in prog
    assert "strong_areas" in prog
    assert "weak_areas" in prog
