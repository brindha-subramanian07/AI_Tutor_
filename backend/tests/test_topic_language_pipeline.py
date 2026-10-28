import pytest
from unittest.mock import patch, MagicMock

from app.schemas.lesson import GENERIC_COMPONENTS, ML_COMPONENTS, TopicPlan
from app.services.gemini_service import GeminiService
from app.services.lesson_pipeline import (
    EducationalLessonPipeline,
    classify_topic_fallback,
    validate_code_snippet,
    post_process_and_guard,
)


# ---------------------------------------------------------------------------
# 1. Fallback Classifier Tests
# ---------------------------------------------------------------------------

def test_fallback_classifier_non_coding_topics():
    """Verifies that non-programming topics are classified as code_relevant=False,
    code_language='none', and have no 'code' in the scene plan.
    """
    non_coding = ["Photosynthesis", "Indian Constitution", "Thermodynamics", "Macroeconomics"]
    for topic in non_coding:
        plan = classify_topic_fallback(topic)
        assert plan.code_relevant is False, f"Expected {topic} to not be code relevant"
        assert plan.code_language == "none"
        assert plan.allowed_components == GENERIC_COMPONENTS
        assert "code" not in plan.scene_plan
        assert plan.is_programming_topic is False

    # Uncertain topics must default to NO code
    uncertain = classify_topic_fallback("Creative Fiction Workshop")
    assert uncertain.code_relevant is False
    assert uncertain.code_language == "none"


def test_fallback_classifier_programming_topics():
    """Verifies that programming topics correctly identify their language
    and never default to Python unless it is a Python/ML topic.
    """
    plan_sql = classify_topic_fallback("SQL joins")
    assert plan_sql.code_relevant is True
    assert plan_sql.code_language == "sql"
    assert "code" in plan_sql.scene_plan

    plan_js = classify_topic_fallback("JavaScript closures")
    assert plan_js.code_relevant is True
    assert plan_js.code_language == "javascript"
    assert "code" in plan_js.scene_plan

    plan_py = classify_topic_fallback("Linear regression")
    assert plan_py.code_relevant is True
    assert plan_py.code_language == "python"

    plan_ml = classify_topic_fallback("Basics of Machine Learning")
    assert plan_ml.code_relevant is True
    assert plan_ml.code_language == "python"
    # ML domain must allow ML components
    for ml_comp in ML_COMPONENTS:
        assert ml_comp in plan_ml.allowed_components


# ---------------------------------------------------------------------------
# 2. Multi-Language Validator Tests
# ---------------------------------------------------------------------------

def test_validator_python():
    # Valid Python
    valid, err = validate_code_snippet("def add(a, b):\n    return a + b", "python")
    assert valid is True
    assert err is None

    # Invalid Python
    valid_bad, err_bad = validate_code_snippet("def add(a, b:\n    return a + b", "python")
    assert valid_bad is False
    assert "SyntaxError" in err_bad


def test_validator_sql():
    # Valid SQL
    valid, err = validate_code_snippet("SELECT id, name FROM users WHERE age > 18;", "sql")
    assert valid is True
    assert err is None

    # Invalid SQL (unbalanced single quote)
    valid_bad, err_bad = validate_code_snippet("SELECT * FROM users WHERE name = 'Alice", "sql")
    assert valid_bad is False
    assert err_bad is not None


def test_validator_javascript():
    # Valid JavaScript
    valid, err = validate_code_snippet("function greet(name) { return 'Hello ' + name; }", "javascript")
    assert valid is True
    assert err is None

    # Invalid JavaScript (syntax error)
    valid_bad, err_bad = validate_code_snippet("function greet(name) { return 'Hello ' + ; }", "javascript")
    assert valid_bad is False
    assert err_bad is not None


# ---------------------------------------------------------------------------
# 3. Post-Processing & Hard Guards Tests
# ---------------------------------------------------------------------------

def test_guard_removes_hallucinated_python_for_photosynthesis():
    """If Gemini generates Python code for a non-coding topic like 'Photosynthesis',
    the hard guard must strip code=None from every scene.
    """
    plan = classify_topic_fallback("Photosynthesis")
    assert plan.code_relevant is False

    # Simulate Gemini returning hallucinated Python code
    mock_raw_lesson = {
        "title": "Photosynthesis Masterclass",
        "category": "Biology",
        "difficulty": "Beginner",
        "duration": "14 mins",
        "summary": "Light dependent and independent reactions.",
        "slides": [
            {
                "id": 1,
                "scene_type": "concept",
                "title": "Light Reactions",
                "narration": "Chlorophyll absorbs photon energy and generates ATP.",
                "visual": {"component": "FlowDiagram", "data": {}},
                "code": {
                    "language": "python",
                    "snippet": "def synthesize_glucose():\n    return 'ATP'\nprint(synthesize_glucose())",
                    "explanation": "Hallucinated dummy python function"
                }
            },
            {
                "id": 2,
                "scene_type": "diagram",
                "title": "Calvin Cycle",
                "narration": "Carbon fixation via Rubisco enzyme.",
                "visual": {"component": "Timeline", "data": {}},
                "code": "print('dummy script')"
            }
        ],
        "keyConcepts": [],
        "codeExamples": [{"title": "Dummy", "lang": "python", "code": "def foo(): pass"}],
        "practicalTask": {"starterCode": "def solve(): pass", "is_coding": True}
    }

    guarded = post_process_and_guard(mock_raw_lesson, plan)

    # Assert that all slides have code=None
    for slide in guarded["slides"]:
        assert slide["code"] is None, f"Slide {slide.get('id')} retained code despite non-programming plan"

    assert guarded["codeExamples"] == []
    assert guarded["practicalTask"]["starterCode"] is None
    assert guarded["practicalTask"]["is_coding"] is False


def test_guard_drops_mismatched_language():
    """For 'SQL joins', if a Python snippet is generated, the guard must drop it."""
    plan = classify_topic_fallback("SQL joins")
    assert plan.code_language == "sql"

    mock_lesson = {
        "title": "SQL Joins Masterclass",
        "category": "Databases",
        "difficulty": "Intermediate",
        "duration": "14 mins",
        "summary": "Inner and outer joins.",
        "slides": [
            {
                "id": 1,
                "scene_type": "concept",
                "title": "Join Basics",
                "narration": "Connecting tables via foreign keys.",
                "visual": {"component": "FlowDiagram", "data": {}},
                "code": {
                    "language": "python",  # MISMATCH!
                    "snippet": "users.merge(orders, on='id')",
                    "explanation": "Pandas merge instead of SQL"
                }
            },
            {
                "id": 2,
                "scene_type": "code",
                "title": "Inner Join SQL",
                "narration": "Combining user and order rows.",
                "visual": {"component": "ComparisonTable", "data": {}},
                "code": {
                    "language": "sql",  # CORRECT
                    "snippet": "SELECT * FROM users u INNER JOIN orders o ON u.id = o.user_id;",
                    "explanation": "Standard inner join"
                }
            }
        ],
        "keyConcepts": [],
        "codeExamples": []
    }

    guarded = post_process_and_guard(mock_lesson, plan)
    slides = guarded["slides"]

    # Scene 1 had Python -> dropped
    assert slides[0]["code"] is None
    # Scene 2 had valid SQL -> kept
    assert slides[1]["code"] is not None
    assert slides[1]["code"]["language"] == "sql"


def test_guard_replaces_disallowed_ml_components_on_non_ml_topic():
    """If a non-ML topic (e.g. Indian Constitution) has an ml_* component,
    the guard must replace it with an allowed generic component.
    """
    plan = classify_topic_fallback("Indian Constitution")
    assert "ml_spam_classifier" not in plan.allowed_components

    mock_lesson = {
        "title": "Indian Constitution Masterclass",
        "category": "Law & Governance",
        "difficulty": "Beginner",
        "duration": "14 mins",
        "summary": "Preamble and Fundamental Rights.",
        "slides": [
            {
                "id": 1,
                "scene_type": "concept",
                "title": "The Preamble",
                "narration": "Sovereign, socialist, secular, democratic republic.",
                "visual": {"component": "ml_spam_classifier", "data": {}},  # Disallowed
                "code": None
            }
        ]
    }

    guarded = post_process_and_guard(mock_lesson, plan)
    comp = guarded["slides"][0]["visual"]["component"]
    assert comp != "ml_spam_classifier"
    assert comp in GENERIC_COMPONENTS


def test_guard_repairs_scene_type_sequence():
    """Ensures slides follow the exact ordered scene_type sequence of the plan."""
    plan = classify_topic_fallback("Photosynthesis")
    expected_sequence = plan.scene_plan

    mock_lesson = {
        "title": "Photosynthesis",
        "category": "Biology",
        "slides": [
            {"id": 1, "scene_type": "unknown_type", "title": "S1", "narration": "Narration 1", "visual": {"component": "FlowDiagram", "data": {}}, "code": None}
        ]
    }

    guarded = post_process_and_guard(mock_lesson, plan)
    actual_sequence = [s["scene_type"] for s in guarded["slides"]]
    assert actual_sequence == expected_sequence
    assert len(guarded["slides"]) == len(expected_sequence)


# ---------------------------------------------------------------------------
# 4. Mocked Gemini Pipeline Integration Tests
# ---------------------------------------------------------------------------

def test_mocked_gemini_photosynthesis_produces_no_code():
    """Unit test with a mocked Gemini client where the model tries to return Python code
    for 'Photosynthesis', verifying that the post-process guard reliably removes it.
    """
    topic = "Photosynthesis"

    # Mock planner response
    mock_plan_dict = {
        "domain": "Biology & Botany",
        "code_relevant": False,
        "code_language": "none",
        "allowed_components": GENERIC_COMPONENTS,
        "scene_plan": ["concept", "diagram", "example", "diagram", "quiz", "summary"],
        "pedagogical_focus": "Light and dark biochemical cycles."
    }

    # Mock generator response that mistakenly hallucinates a Python snippet
    mock_gen_dict = {
        "title": "Photosynthesis: Biochemical Mechanisms",
        "category": "Biology",
        "difficulty": "Beginner",
        "duration": "14 mins",
        "summary": "Photosynthesis converts light into chemical energy.",
        "code_relevant": False,
        "code_language": "none",
        "slides": [
            {
                "id": i + 1,
                "scene_type": st,
                "title": f"Scene {i+1}",
                "narration": f"Spoken explanation for scene {i+1} covering photosynthetic reactions.",
                "visual": {"component": "FlowDiagram", "data_json": '{"nodes": []}'},
                "code": {"language": "python", "snippet": "def calc(): return 1", "explanation": "Hallucinated code"}
            }
            for i, st in enumerate(mock_plan_dict["scene_plan"])
        ],
        "keyConcepts": [{"term": "Chloroplast", "definition": "Organelle for photosynthesis"}],
        "codeExamples": []
    }

    with patch("app.services.gemini_service.call_gemini_structured") as mock_call:
        # First call is plan_topic, second is generate_lesson_from_plan
        mock_call.side_effect = [mock_plan_dict, mock_gen_dict]

        lesson = GeminiService.generate_lesson_content(topic, "Beginner")

        assert lesson is not None
        assert "slides" in lesson
        assert len(lesson["slides"]) == len(mock_plan_dict["scene_plan"])

        # Hard guard MUST have stripped code on every scene
        for s in lesson["slides"]:
            assert s["code"] is None, f"Slide {s.get('id')} has code: {s.get('code')}"

        assert lesson.get("codeExamples") == []


# ---------------------------------------------------------------------------
# 5. Live Gemini Topic Tests (Run with: pytest -m live)
# ---------------------------------------------------------------------------

@pytest.mark.live
def test_live_photosynthesis():
    lesson = GeminiService.generate_lesson_content("Photosynthesis", "Beginner")
    assert lesson is not None
    slides = lesson.get("slides", [])
    assert len(slides) >= 4
    # Rule: Non-programming topic must contain NO code on any scene
    for s in slides:
        assert s.get("code") is None, f"Scene {s.get('id')} contained code: {s.get('code')}"
    assert lesson.get("codeExamples", []) == []


@pytest.mark.live
def test_live_indian_constitution():
    lesson = GeminiService.generate_lesson_content("Indian Constitution", "Beginner")
    assert lesson is not None
    slides = lesson.get("slides", [])
    assert len(slides) >= 4
    # Rule: Non-programming topic must contain NO code on any scene
    for s in slides:
        assert s.get("code") is None, f"Scene {s.get('id')} contained code: {s.get('code')}"
    assert lesson.get("codeExamples", []) == []


@pytest.mark.live
def test_live_sql_joins():
    lesson = GeminiService.generate_lesson_content("SQL joins", "Intermediate")
    assert lesson is not None
    slides = lesson.get("slides", [])
    assert len(slides) >= 4
    # Rule: Programming topic must use SQL, NEVER default to Python
    code_found = False
    for s in slides:
        code_obj = s.get("code")
        if code_obj:
            code_found = True
            lang = code_obj.get("language") if isinstance(code_obj, dict) else "unknown"
            assert lang.lower() == "sql", f"Expected SQL language, got: {lang}"
            assert "def " not in code_obj.get("snippet", ""), "Found Python 'def' in SQL lesson"
    assert code_found, "Expected at least one SQL code snippet in SQL joins lecture"


@pytest.mark.live
def test_live_javascript_closures():
    lesson = GeminiService.generate_lesson_content("JavaScript closures", "Intermediate")
    assert lesson is not None
    slides = lesson.get("slides", [])
    assert len(slides) >= 4
    # Rule: Programming topic must use JavaScript, NEVER default to Python
    code_found = False
    for s in slides:
        code_obj = s.get("code")
        if code_obj:
            code_found = True
            lang = code_obj.get("language") if isinstance(code_obj, dict) else "unknown"
            assert lang.lower() in ("javascript", "js"), f"Expected JavaScript, got: {lang}"
            assert "def " not in code_obj.get("snippet", ""), "Found Python 'def' in JavaScript lesson"
    assert code_found, "Expected at least one JS code snippet in JavaScript closures lecture"


@pytest.mark.live
def test_live_linear_regression():
    lesson = GeminiService.generate_lesson_content("Linear regression", "Beginner")
    assert lesson is not None
    slides = lesson.get("slides", [])
    assert len(slides) >= 4
    # Rule: Linear regression uses Python
    for s in slides:
        code_obj = s.get("code")
        if code_obj:
            lang = code_obj.get("language") if isinstance(code_obj, dict) else "unknown"
            assert lang.lower() == "python", f"Expected Python language, got: {lang}"
