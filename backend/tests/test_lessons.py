def test_create_and_get_lesson(client):
    payload = {
        "topic": "Python Generators and Iterators",
        "category": "Advanced Python",
        "difficulty": "Intermediate",
    }
    res = client.post("/api/lessons", json=payload)
    assert res.status_code == 201
    data = res.json()
    assert data["topic"] == "Python Generators and Iterators"
    assert "slides" in data["content"]
    assert "keyConcepts" in data["content"]
    slug = data["lesson_slug"]

    # Retrieve by slug
    res_get = client.get(f"/api/lessons/{slug}")
    assert res_get.status_code == 200
    assert res_get.json()["title"] == data["title"]

    # List lessons
    res_list = client.get("/api/lessons")
    assert res_list.status_code == 200
    assert len(res_list.json()) >= 1
