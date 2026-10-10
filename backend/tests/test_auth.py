def test_register_and_login(client):
    # Test Register
    reg_payload = {
        "name": "Test Student",
        "email": "teststudent@college.edu",
        "password": "secretpassword123",
        "department": "Computer Science",
        "semester": "Semester 4",
    }
    res = client.post("/api/auth/register", json=reg_payload)
    assert res.status_code == 201
    data = res.json()
    assert "access_token" in data
    assert data["user"]["email"] == "teststudent@college.edu"

    # Test Duplicate Register
    res_dup = client.post("/api/auth/register", json=reg_payload)
    assert res_dup.status_code == 400

    # Test Login with correct credentials
    login_payload = {
        "email": "teststudent@college.edu",
        "password": "secretpassword123",
    }
    res_login = client.post("/api/auth/login", json=login_payload)
    assert res_login.status_code == 200
    token = res_login.json()["access_token"]
    assert token

    # Test Login with invalid password
    res_bad = client.post("/api/auth/login", json={
        "email": "teststudent@college.edu",
        "password": "wrongpassword",
    })
    assert res_bad.status_code == 401

    # Test Protected /me endpoint
    headers = {"Authorization": f"Bearer {token}"}
    res_me = client.get("/api/auth/me", headers=headers)
    assert res_me.status_code == 200
    assert res_me.json()["email"] == "teststudent@college.edu"


def test_google_auth(client):
    google_payload = {
        "email": "googleuser@college.edu",
        "name": "Google User",
        "avatar": "https://example.com/avatar.png",
    }
    res = client.post("/api/auth/google", json=google_payload)
    assert res.status_code == 200
    data = res.json()
    assert "access_token" in data
    assert data["user"]["email"] == "googleuser@college.edu"
    assert data["user"]["auth_provider"] == "google"
