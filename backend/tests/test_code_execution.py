def test_code_execution_correct(client):
    payload = {
        "code": "print('Hello AI Tutor')",
        "language": "python",
        "test_cases": [
            {"input": "", "expected_output": "Hello AI Tutor"}
        ]
    }
    res = client.post("/api/code/execute", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["passed"] is True
    assert data["passed_tests"] == 1
    assert data["score"] == 100.0
 

def test_code_execution_incorrect(client):
    payload = {
        "code": "print('Wrong Output')",
        "language": "python",
        "test_cases": [
            {"input": "", "expected_output": "Expected String"}
        ]
    }
    res = client.post("/api/code/execute", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["passed"] is False
    assert data["failed_tests"] == 1


def test_code_execution_compilation_error(client):
    payload = {
        "code": "def broken_syntax(:\n    pass",
        "language": "python",
    }
    res = client.post("/api/code/execute", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["passed"] is False
    assert data["compilation_errors"] is not None


def test_code_execution_timeout(client):
    payload = {
        "code": "while True: pass",
        "language": "python",
    }
    res = client.post("/api/code/execute", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["passed"] is False
    assert data["runtime_errors"] is not None
    assert "timed out" in data["runtime_errors"].lower() or "timeout" in data["runtime_errors"].lower()


def test_code_execution_restricted_operation(client):
    # Try forbidden os import
    payload = {
        "code": "import os\nprint(os.listdir('.'))",
        "language": "python",
    }
    res = client.post("/api/code/execute", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["passed"] is False
    assert data["compilation_errors"] is not None
    assert "forbidden" in data["compilation_errors"].lower()
