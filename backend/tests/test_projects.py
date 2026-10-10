def test_project_generation_and_submission(client):
    # Generate practical project
    gen_payload = {
        "topic": "Python Loops",
        "difficulty": "Intermediate",
    }
    res_gen = client.post("/api/projects/generate", json=gen_payload)
    assert res_gen.status_code == 201
    proj_data = res_gen.json()
    project_id = proj_data["id"]

    assert proj_data["title"]
    assert proj_data["scenario"]
    assert len(proj_data["requirements"]) >= 1

    # Retrieve project
    res_get = client.get(f"/api/projects/{project_id}")
    assert res_get.status_code == 200
    assert res_get.json()["title"] == proj_data["title"]

    # Submit solution
    sub_payload = {
        "submitted_solution": """
def analyze_telemetry(readings):
    valid = []
    status = "Normal"
    for r in readings:
        if r == -999:
            status = "Emergency Halt"
            break
        if r < 0:
            continue
        valid.append(r)
    avg = sum(valid) / len(valid) if valid else 0.0
    return {"count": len(valid), "average": round(avg, 2), "status": status}
"""
    }
    res_sub = client.post(f"/api/projects/{project_id}/submit", json=sub_payload)
    assert res_sub.status_code == 200
    sub_data = res_sub.json()
    assert sub_data["score"] > 0
    assert "feedback" in sub_data
    assert "completed_requirements" in sub_data
