import json
import sys
import httpx

BASE_URL = "http://localhost:8000/api"

def run_full_e2e_test():
    client = httpx.Client(base_url=BASE_URL, timeout=30.0)
    print("==================================================")
    print("STARTING FULL END-TO-END SYSTEM INTEGRATION TEST")
    print("==================================================")

    # 1. REGISTER USER
    print("\n[Step 1] Registering New User...")
    user_payload = {
        "name": "Dheepana K.N.",
        "email": f"dheepana.e2e@college.edu",
        "password": "SecurePassword#2026",
        "department": "Artificial Intelligence & Data Science",
        "semester": "Semester 6"
    }
    # If already exists, login instead
    reg_res = client.post("/auth/register", json=user_payload)
    if reg_res.status_code == 201:
        auth_data = reg_res.json()
        print(" -> User registered successfully.")
    else:
        # 2. LOGIN
        print(" -> User exists, attempting login...")
        login_res = client.post("/auth/login", json={
            "email": user_payload["email"],
            "password": user_payload["password"]
        })
        assert login_res.status_code == 200, f"Login failed: {login_res.text}"
        auth_data = login_res.json()
        print(" -> User logged in successfully.")

    token = auth_data["access_token"]
    user = auth_data["user"]
    user_id = user["id"]
    headers = {"Authorization": f"Bearer {token}"}
    print(f" -> Authenticated User: {user['name']} (ID: {user_id})")

    # Verify protected profile endpoint
    me_res = client.get("/auth/me", headers=headers)
    assert me_res.status_code == 200
    assert me_res.json()["email"] == user_payload["email"]
    print(" -> GET /api/auth/me verified successfully.")

    # 3. SELECT TOPIC & GENERATE LESSON
    print("\n[Step 2] Selecting Topic & Generating Lesson with Gemini AI...")
    topic = "Python Loops & Control Structures"
    lesson_res = client.post("/lessons", json={
        "topic": topic,
        "category": "Programming & Computer Science",
        "difficulty": "Intermediate"
    }, headers=headers)
    assert lesson_res.status_code == 201 or lesson_res.status_code == 200, f"Lesson failed: {lesson_res.text}"
    lesson = lesson_res.json()
    lesson_id = lesson["id"]
    print(f" -> Lesson Created: '{lesson['title']}' (ID: {lesson_id})")
    assert "slides" in lesson["content"]
    assert "keyConcepts" in lesson["content"]
    assert len(lesson["content"]["slides"]) >= 3
    print(f" -> Slides Generated: {len(lesson['content']['slides'])} slides with narration & visual diagrams.")

    # 4. GENERATE QUIZ
    print("\n[Step 3] Generating Comprehensive Diagnostic Quiz...")
    quiz_res = client.post("/quizzes/generate", json={
        "topic": topic,
        "lesson_id": lesson_id,
        "difficulty": "Intermediate"
    }, headers=headers)
    assert quiz_res.status_code == 201, f"Quiz generation failed: {quiz_res.text}"
    quiz = quiz_res.json()
    quiz_id = quiz["id"]
    questions = quiz["questions"]
    print(f" -> Quiz ID: {quiz_id} generated with {len(questions)} questions.")

    # VERIFY CORRECT ANSWERS ARE HIDDEN
    for q in questions:
        assert "correct_answer" not in q, "SECURITY VIOLATION: correct_answer exposed in quiz questions!"
        assert "correctAnswer" not in q
    print(" -> Verified: Correct answers strictly hidden from student view.")

    # 5. ANSWER QUESTIONS (MCQ, TRUE/FALSE, FILL IN BLANKS, CODING)
    print("\n[Step 4] Answering MCQ, True/False, Fill-ups, and Coding Questions...")
    answers_map = {}
    for q in questions:
        q_type = q["question_type"]
        q_id = q["id"]
        if q_type == "mcq":
            answers_map[q_id] = 0  # Select first option
        elif q_type == "true_false":
            answers_map[q_id] = "True"
        elif q_type == "fill_blank":
            answers_map[q_id] = "break"
        elif q_type == "coding":
            answers_map[q_id] = "def solve(): return True"
        else:
            answers_map[q_id] = "answer"

    # 6. SUBMIT QUIZ & CALCULATE SCORE
    print("\n[Step 5] Submitting Quiz to Backend Evaluation Engine...")
    submit_res = client.post(f"/quizzes/{quiz_id}/submit", json={"answers": answers_map}, headers=headers)
    assert submit_res.status_code == 200, f"Submit failed: {submit_res.text}"
    eval_data = submit_res.json()
    attempt_id = eval_data["attempt_id"]
    print(f" -> Evaluation Result: Score = {eval_data['score']}%, Accuracy = {eval_data['accuracy']}%")
    print(f" -> Correct: {eval_data['correctCount']}, Incorrect: {eval_data['incorrectCount']}")

    # 7. PERFORMANCE ANALYSIS & PIE CHART DATA
    print("\n[Step 6] Verifying Pie Chart Breakdown & Dynamic Diagnostic Matrix...")
    assert "weakSubtopics" in eval_data
    assert "strengthsSubtopics" in eval_data
    print(f" -> Weak Subtopics (Pie Slices): {len(eval_data['weakSubtopics'])} slices")
    for ws in eval_data["weakSubtopics"][:2]:
        print(f"    - {ws['name']} ({ws['gapWeight']}% gap weight, Color: {ws['color']})")
    print(f" -> Strengths Subtopics (Mastery Wheel): {len(eval_data['strengthsSubtopics'])} slices")

    # 8. ASSESSMENT ANALYSIS ENDPOINT
    print("\n[Step 7] Checking Assessment Analysis Endpoint...")
    ass_res = client.get(f"/assessment/{attempt_id}", headers=headers)
    assert ass_res.status_code == 200
    ass_data = ass_res.json()
    assert ass_data["attempt_id"] == attempt_id
    assert "concept_analysis" in ass_data
    print(" -> Assessment Analysis endpoint verified.")

    # 9. GENERATE REAL-LIFE MINI PROJECT
    print("\n[Step 8] Generating Practical Real-Life Mini Project...")
    proj_gen_res = client.post("/projects/generate", json={
        "topic": topic,
        "lesson_id": lesson_id,
        "difficulty": "Intermediate"
    }, headers=headers)
    assert proj_gen_res.status_code == 201
    project = proj_gen_res.json()
    project_id = project["id"]
    print(f" -> Generated Project: '{project['title']}' (ID: {project_id})")
    print(f" -> Requirements: {len(project['requirements'])} criteria")

    # 10. SUBMIT PROJECT & EVALUATE IN SAFE SANDBOX
    print("\n[Step 9] Submitting Solution to Isolated Sandbox Runner...")
    solution_code = """
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
    proj_sub_res = client.post(f"/projects/{project_id}/submit", json={
        "submitted_solution": solution_code
    }, headers=headers)
    assert proj_sub_res.status_code == 200
    proj_eval = proj_sub_res.json()
    print(f" -> Mini Project Score: {proj_eval['score']}%")
    print(f" -> Completed Requirements: {len(proj_eval['completed_requirements'])}")
    print(f" -> Feedback: {proj_eval['feedback']}")

    # 11. PERSONALIZED RECOMMENDATIONS BASED ON ACTUAL RESULTS
    print("\n[Step 10] Retrieving Personalized Next Learning Recommendations...")
    rec_res = client.get(f"/recommendations/{user_id}", headers=headers)
    assert rec_res.status_code == 200
    recs = rec_res.json()
    assert len(recs) >= 1
    print(f" -> Generated {len(recs)} personalized recommendations:")
    for r in recs[:2]:
        print(f"    * {r['title']} ({r['urgency']}, Match: {r['matchScore']}%) - Reason: {r['reason']}")

    # 12. LEARNING PROGRESS TRACKING
    print("\n[Step 11] Verifying Learning Progress & Dashboard Analytics...")
    prog_res = client.get(f"/progress/{user_id}", headers=headers)
    assert prog_res.status_code == 200
    prog = prog_res.json()
    print(f" -> Overall Progress: {prog['overall_percentage']}%, Streak: {prog['streak_days']} Days")
    print(f" -> Total Quiz Attempts Tracked: {prog['total_quiz_attempts']}")
    print(f" -> Strong Areas: {len(prog['strong_areas'])}, Weak Areas: {len(prog['weak_areas'])}")

    print("\n==================================================")
    print("ALL 11 END-TO-END WORKFLOW STAGES PASSED SUCCESSFULLY!")
    print("==================================================")

if __name__ == "__main__":
    run_full_e2e_test()
