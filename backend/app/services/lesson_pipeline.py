import ast
import json
import logging
import os
import re
import subprocess
import tempfile
from typing import Any, Dict, List, Optional, Tuple, Union

try:
    import sqlglot  # type: ignore
except ImportError:
    sqlglot = None  # type: ignore

from app.schemas.lesson import (
    ALL_ALLOWED_COMPONENTS,
    GENERIC_COMPONENTS,
    ML_COMPONENTS,
    SceneType,
    TopicPlan,
)

logger = logging.getLogger(__name__)


# ---------------------------------------------------------------------------
# Validation Engine
# ---------------------------------------------------------------------------

def check_bracket_balance(code: str) -> bool:
    """Verifies that parentheses, curly braces, and brackets are balanced."""
    stack: List[str] = []
    pairs = {")": "(", "}": "{", "]": "["}
    in_single = False
    in_double = False
    in_backtick = False
    escaped = False

    for char in code:
        if escaped:
            escaped = False
            continue
        if char == "\\":
            escaped = True
            continue
        if char == "'" and not in_double and not in_backtick:
            in_single = not in_single
            continue
        if char == '"' and not in_single and not in_backtick:
            in_double = not in_double
            continue
        if char == "`" and not in_single and not in_double:
            in_backtick = not in_backtick
            continue
        if in_single or in_double or in_backtick:
            continue

        if char in "({[":
            stack.append(char)
        elif char in ")}]":
            if not stack or stack[-1] != pairs[char]:
                return False
            stack.pop()

    return len(stack) == 0 and not in_single and not in_double and not in_backtick


def check_js_with_node(code: str) -> Tuple[Optional[bool], Optional[str]]:
    """Uses `node --check` via a temporary file to check JavaScript/TypeScript syntax.
    Returns (True, None) if valid, (False, error) if syntax error, or (None, err) if node unavailable.
    """
    temp_path = None
    try:
        with tempfile.NamedTemporaryFile("w", suffix=".js", delete=False, encoding="utf-8") as f:
            f.write(code)
            temp_path = f.name

        res = subprocess.run(
            ["node", "--check", temp_path],
            capture_output=True,
            text=True,
            timeout=5,
        )
        if res.returncode == 0:
            return True, None
        err_msg = res.stderr.strip() or res.stdout.strip()
        return False, err_msg
    except Exception as e:
        logger.debug(f"node --check unavailable or failed: {e}")
        return None, str(e)
    finally:
        if temp_path and os.path.exists(temp_path):
            try:
                os.remove(temp_path)
            except Exception:
                pass


def check_sql_syntax(code: str) -> Tuple[bool, Optional[str]]:
    """Validates SQL using sqlglot if available, otherwise heuristic syntax check."""
    if sqlglot is not None:
        try:
            sqlglot.parse(code)
            return True, None
        except Exception as e:
            return False, f"SQL parse error: {e}"

    clean = re.sub(r"--.*$", "", code, flags=re.MULTILINE).strip()
    if not clean:
        return False, "Empty SQL snippet"

    if not check_bracket_balance(clean):
        return False, "Unbalanced parentheses or brackets in SQL"

    single_quotes = clean.count("'") - clean.count("\\'")
    if single_quotes % 2 != 0:
        return False, "Unterminated single quote in SQL"

    sql_keywords = {
        "SELECT", "INSERT", "UPDATE", "DELETE", "CREATE", "ALTER", "DROP",
        "WITH", "FROM", "JOIN", "WHERE", "GROUP", "ORDER", "HAVING", "LIMIT"
    }
    words = {w.upper() for w in re.findall(r"\b[A-Za-z]+\b", clean)}
    if not words.intersection(sql_keywords):
        return False, "Snippet does not contain standard SQL keywords"

    return True, None


def validate_code_snippet(code: Optional[str], language: str) -> Tuple[bool, Optional[str]]:
    """Language-aware syntax validation:
    - python: ast.parse
    - sql: sqlglot or heuristic
    - javascript/typescript: node --check or bracket check
    - other: bracket balance check
    """
    if not code or not code.strip():
        return True, None

    lang = (language or "").lower().strip()

    if lang in ("python", "py"):
        try:
            ast.parse(code)
            return True, None
        except SyntaxError as e:
            return False, f"Python SyntaxError: {e}"

    if lang in ("sql", "psql", "mysql"):
        return check_sql_syntax(code)

    if lang in ("javascript", "js", "typescript", "ts"):
        node_res, node_err = check_js_with_node(code)
        if node_res is not None:
            return node_res, node_err
        if not check_bracket_balance(code):
            return False, "Unbalanced brackets or parentheses in JavaScript"
        return True, None

    # Fallback for other languages
    if not check_bracket_balance(code):
        return False, f"Unbalanced syntax in {language} snippet"

    return True, None


def validate_python_code(code: Optional[str]) -> bool:
    """Backward-compatible helper verifying Python syntax via AST."""
    valid, _ = validate_code_snippet(code, "python")
    return valid


def compute_scene_duration(narration: str, wpm: int = 140) -> int:
    """Computes realistic narration duration in seconds based on word count."""
    if not narration:
        return 15
    words = len(narration.split())
    sec = max(15, round((words / wpm) * 60))
    return min(sec, 75)


# ---------------------------------------------------------------------------
# Fallback Topic Classifier (Defaults to NO code when uncertain)
# ---------------------------------------------------------------------------

def classify_topic_fallback(topic: str, difficulty: str = "Beginner") -> TopicPlan:
    """Deterministic fallback topic classifier.
    CRITICAL RULE: Defaults to code_relevant = False (NO code) when uncertain.
    """
    topic_l = topic.lower().strip()

    # Domains that are definitely non-programming
    non_coding_domains = [
        "photosynthesis", "cell", "biology", "botany", "zoology", "genetics", "anatomy",
        "physiology", "ecology", "organic chemistry", "biochemistry", "chemistry",
        "physics", "thermodynamics", "optics", "quantum", "kinematics", "dynamics",
        "newton", "gravity", "astronomy", "geology",
        "constitution", "law", "government", "democracy", "judicial", "parliament",
        "history", "geography", "literature", "philosophy", "sociology", "psychology",
        "economics", "microeconomics", "macroeconomics", "finance", "accounting",
        "civil engineering", "material science", "environmental science"
    ]

    is_explicit_non_coding = any(nc in topic_l for nc in non_coding_domains)

    # Programming topic keyword matching
    is_sql = any(k in topic_l for k in ["sql", "mysql", "postgres", "sqlite", "query", "database join", "sql join"])
    is_js = any(k in topic_l for k in ["javascript", "typescript", "react", "closure", "closures", "node", "frontend", "dom manipulation", "async/await in js"])
    is_python = any(k in topic_l for k in [
        "python", "django", "flask", "fastapi", "pandas", "numpy", "scikit-learn",
        "linear regression", "logistic regression", "random forest", "neural network",
        "deep learning", "machine learning", "ml", "basics of machine learning", "generator in python",
        "list comprehension"
    ])
    is_other_prog = any(k in topic_l for k in ["c++", "cpp", "pointer in c", "java", "spring boot", "golang", "rust"])

    is_ml_domain = any(k in topic_l for k in [
        "machine learning", "ml", "basics of machine learning", "deep learning",
        "neural network", "spam classifier", "linear regression", "train/test", "overfitting"
    ])

    # If domain is clearly non-coding and no explicit coding keywords appear
    if is_explicit_non_coding and not (is_sql or is_js or ("python" in topic_l and not "monty python" in topic_l)):
        code_relevant = False
        code_language = "none"
        domain = "Science & Humanities"
    elif is_sql:
        code_relevant = True
        code_language = "sql"
        domain = "Database Systems"
    elif is_js:
        code_relevant = True
        code_language = "javascript"
        domain = "Web & Software Engineering"
    elif is_python:
        code_relevant = True
        code_language = "python"
        domain = "Data Science & Machine Learning" if is_ml_domain else "Programming in Python"
    elif is_other_prog:
        code_relevant = True
        code_language = "cpp" if "c++" in topic_l or "cpp" in topic_l else "java"
        domain = "Computer Science"
    else:
        # DEFAULT TO NO CODE WHEN UNCERTAIN
        code_relevant = False
        code_language = "none"
        domain = "General Academic Curriculum"

    # Planner chooses allowed components: ML components ONLY for ML domains
    if is_ml_domain:
        allowed_components = GENERIC_COMPONENTS + ML_COMPONENTS
    else:
        allowed_components = list(GENERIC_COMPONENTS)

    # Scene Plan: do NOT include "code" scene if not code_relevant
    if any(k in topic_l for k in ["basics of machine learning"]):
        scene_plan: List[SceneType] = [
            "concept", "diagram", "diagram", "diagram", "diagram", "code", "diagram", "summary"
        ]
    elif code_relevant:
        scene_plan: List[SceneType] = ["concept", "diagram", "code", "example", "quiz", "summary"]
    else:
        scene_plan: List[SceneType] = ["concept", "diagram", "example", "diagram", "quiz", "summary"]

    return TopicPlan(
        domain=domain,
        code_relevant=code_relevant,
        code_language=code_language,
        allowed_components=allowed_components,
        scene_plan=scene_plan,
        pedagogical_focus="Grounded mental models, visual mechanisms, and conceptual clarity.",
    )


# ---------------------------------------------------------------------------
# Post-Processing & Hard Guards
# ---------------------------------------------------------------------------

def post_process_and_guard(lesson: Dict[str, Any], plan: TopicPlan) -> Dict[str, Any]:
    """Applies strict security and consistency guards after generation:
    1. Scene_type sequence repair against plan.scene_plan.
    2. Hard code guard: if code is not relevant, code=None on all scenes.
    3. Language guard: if code.language != plan.code_language, drop snippet.
    4. Syntax validation: validate_code_snippet; drop on failure (never crash, never default to Python).
    5. Component registry validation: replace disallowed/unknown components with allowed generic visual.
    6. Legacy backward-compatibility field mapping.
    """
    slides = lesson.get("slides", [])
    expected_types = plan.scene_plan

    # 1. Verify and repair scene_type sequence
    repaired_slides = []
    for idx, expected_st in enumerate(expected_types):
        if idx < len(slides):
            slide = slides[idx]
            slide["id"] = idx + 1
            if slide.get("scene_type") != expected_st:
                slide["scene_type"] = expected_st
            repaired_slides.append(slide)
        else:
            # Synthesize missing scene
            repaired_slides.append({
                "id": idx + 1,
                "scene_type": expected_st,
                "title": f"{lesson.get('title', 'Topic')} - Part {idx + 1}",
                "subtitle": "Key Insights & Synthesis",
                "narration": f"Continuing our structured exploration of {lesson.get('title', 'this subject')}.",
                "visual": {"component": "FlowDiagram", "data": {}},
                "code": None,
                "visualNotes": ["Core conceptual insight", "Structural invariant"],
                "key_takeaway": "Foundational understanding established.",
            })

    # If the lesson has additional valid slides beyond the plan length, retain them
    for idx in range(len(expected_types), len(slides)):
        extra_slide = slides[idx]
        extra_slide["id"] = idx + 1
        repaired_slides.append(extra_slide)

    slides = repaired_slides
    lesson["slides"] = slides

    # 2. Hard code guard & language guard
    if not plan.code_relevant:
        for slide in slides:
            slide["code"] = None
        lesson["codeExamples"] = []
        if lesson.get("practicalTask"):
            pt = lesson["practicalTask"]
            pt["starterCode"] = None
            pt["solution"] = None
            pt["is_coding"] = False
    else:
        expected_lang = plan.code_language.lower().strip()
        for slide in slides:
            code_obj = slide.get("code")
            if not code_obj:
                continue

            # Normalize code representation to dict
            if isinstance(code_obj, str):
                code_obj = {"language": expected_lang, "snippet": code_obj, "explanation": None}
                slide["code"] = code_obj

            snippet = code_obj.get("snippet", "")
            code_lang = (code_obj.get("language") or "").lower().strip()

            # Normalize language aliases
            if code_lang == "js":
                code_lang = "javascript"
            if expected_lang == "js":
                expected_lang = "javascript"
            if code_lang == "ts":
                code_lang = "typescript"
            if expected_lang == "ts":
                expected_lang = "typescript"

            # Drop snippet if language does not match planned language
            if code_lang != expected_lang:
                logger.warning(
                    f"Language mismatch in scene {slide.get('id')}: expected {expected_lang}, got {code_lang}. Dropping code."
                )
                slide["code"] = None
                continue

            # Language-aware syntax check
            valid, err = validate_code_snippet(snippet, expected_lang)
            if not valid:
                logger.warning(
                    f"Validation failed for {expected_lang} snippet in scene {slide.get('id')}: {err}. Dropping code."
                )
                slide["code"] = None

    # 3. Component registry validation
    allowed_set = set(plan.allowed_components)
    for slide in slides:
        visual = slide.get("visual")
        if not visual or not isinstance(visual, dict):
            visual = {"component": "SafeFallbackVisual", "data": {}}
            slide["visual"] = visual

        comp = visual.get("component", "SafeFallbackVisual")
        if comp not in allowed_set:
            logger.info(
                f"Component '{comp}' disallowed or unknown for domain '{plan.domain}'. Replacing with generic visual."
            )
            # Pick sensible generic alternative
            st = slide.get("scene_type", "concept")
            if st == "quiz":
                visual["component"] = "QuizCard"
            elif st == "example":
                visual["component"] = "ComparisonTable"
            elif st == "summary":
                visual["component"] = "Timeline"
            else:
                visual["component"] = "FlowDiagram"

        # Parse data_json if visual payload arrived as string
        if "data_json" in visual and not visual.get("data"):
            try:
                visual["data"] = json.loads(visual["data_json"])
            except Exception:
                visual["data"] = {}

        # 4. Legacy backward compatibility fields
        comp_name = visual.get("component", "SafeFallbackVisual")
        slide["visual_type"] = comp_name
        slide["diagram"] = comp_name
        slide["visual_data"] = visual.get("data", {})
        slide["estimated_duration_sec"] = compute_scene_duration(slide.get("narration", ""))

    lesson["code_relevant"] = plan.code_relevant
    lesson["code_language"] = plan.code_language

    return lesson


# ---------------------------------------------------------------------------
# Pre-built Machine Learning Curriculum (ML Domain Only)
# ---------------------------------------------------------------------------

def build_machine_learning_curriculum(difficulty: str = "Beginner") -> Dict[str, Any]:
    """Authoritative, pedagogical 8-stage interactive lesson for 'Basics of Machine Learning'."""
    slides = [
        {
            "id": 1,
            "scene_type": "concept",
            "title": "What is Machine Learning & Why Does It Matter?",
            "subtitle": "The Paradigm Shift: From Explicit Rules to Pattern Learning",
            "learning_objective": "Understand how Machine Learning differs from traditional programming by learning patterns directly from data.",
            "visual": {
                "component": "ml_paradigm_shift",
                "data": {
                    "paradigm_comparison": {
                        "traditional": {
                            "inputs": ["Raw Data", "Handcrafted Rules (If/Else)"],
                            "output": "Answers",
                            "limitation": "Fails on complex perception like vision, speech, and fraud"
                        },
                        "machine_learning": {
                            "inputs": ["Raw Data", "Known Answers / Labels"],
                            "output": "Learned Model / Rules",
                            "advantage": "Discovers non-linear, high-dimensional patterns automatically"
                        }
                    },
                    "key_distinction": "Learning from data vs hardcoded programming logic"
                }
            },
            "narration": "Welcome to Basics of Machine Learning. In traditional software engineering, human programmers write explicit if-then rules to solve problems. But in Machine Learning, we flip the equation: we feed historical data and corresponding answers into an algorithm, and the computer discovers the underlying patterns and rules automatically. This allows software to recognize speech, drive autonomous vehicles, and detect fraud where writing manual rules by hand would be impossible.",
            "code": {
                "language": "python",
                "snippet": "# Traditional Programming vs Machine Learning\n# 1. Traditional: Human writes all rules\ndef rule_based_spam(text):\n    if 'FREE MONEY' in text and 'CLICK HERE' in text:\n        return 'Spam'\n    return 'Legitimate'\n\n# 2. Machine Learning: Algorithm learns weights from data\n# model.fit(features_matrix, labels)",
                "explanation": "Contrasts human-crafted if/else logic with algorithmic pattern discovery."
            },
            "visualNotes": [
                "Traditional: Data + Rules = Answers",
                "Machine Learning: Data + Answers = Learned Rules",
                "Solves problems too complex for human-authored if-else statements"
            ],
            "estimated_duration_sec": 24,
            "transition": "Now, let us examine a real-world case study to see how this works in practice.",
            "key_takeaway": "Machine learning enables computers to learn patterns from historical data without being explicitly programmed for every scenario."
        },
        {
            "id": 2,
            "scene_type": "diagram",
            "title": "Real-World Case Study: Email Spam Classification",
            "subtitle": "Feature Extraction, Weight Attribution, and Decision Boundaries",
            "learning_objective": "Analyze how an email classifier extracts token features, scores weights, and determines spam probability.",
            "visual": {
                "component": "ml_spam_classifier",
                "data": {
                    "sample_emails": [
                        {
                            "subject": "URGENT: Claim $10,000 FREE Cash Transfer Now!",
                            "sender": "lottery-prizes@unknown-domain.xyz",
                            "type": "spam",
                            "features_found": ["FREE", "URGENT", "Cash Transfer", "Suspicious TLD"],
                            "spam_probability": 0.94,
                            "verdict": "SPAM (Moved to Junk)"
                        },
                        {
                            "subject": "Attached: Project Lecture Slides for ML Class",
                            "sender": "professor.chen@university.edu",
                            "type": "ham",
                            "features_found": ["Lecture Slides", "ML Class", "Known .edu Sender"],
                            "spam_probability": 0.04,
                            "verdict": "LEGITIMATE (Inbox)"
                        }
                    ],
                    "decision_threshold": 0.50
                }
            },
            "narration": "Let us examine a real-world machine learning application: classifying emails as spam or legitimate. A naive rule-based filter that blocks the word 'free' would mistakenly flag an email from your university offering free tutoring. Machine Learning instead examines thousands of labeled emails, learns feature weights for combinations of words, sender domains, and message length, and computes a probability score from zero to one to make accurate classifications.",
            "code": {
                "language": "python",
                "snippet": "email_features = {'has_free': 1, 'has_urgent': 1, 'known_sender': 0}\nweights = {'has_free': 0.45, 'has_urgent': 0.35, 'known_sender': -0.80}\n\nscore = sum(email_features[k] * weights[k] for k in email_features)\nis_spam = score > 0.50  # Decision threshold\nprint(f'Spam score: {score:.2f} -> Verdict: {'SPAM' if is_spam else 'INBOX'}')",
                "explanation": "Calculates dot product of extracted features against trained model weights."
            },
            "visualNotes": [
                "Features include keyword tokens, sender reputation, and formatting",
                "Each feature has a learned weight (positive = spam, negative = legitimate)",
                "The threshold (e.g. 0.50) determines the decision boundary"
            ],
            "estimated_duration_sec": 26,
            "transition": "Next, let us break down the standard end-to-end lifecycle every machine learning project follows.",
            "key_takeaway": "Classifiers compute probabilistic scores using multiple weighted features rather than single brittle keywords."
        },
        {
            "id": 3,
            "scene_type": "diagram",
            "title": "The 4-Stage Machine Learning Workflow",
            "subtitle": "Data Collection, Model Training, Model Evaluation, and Inference",
            "learning_objective": "Trace the end-to-end lifecycle from raw data collection to real-time production inference.",
            "visual": {
                "component": "ml_workflow_pipeline",
                "data": {
                    "stages": [
                        { "step": 1, "name": "Data Collection & Cleaning", "desc": "Gathering historical emails, cleaning HTML, handling missing values, tokenizing text.", "badge": "Input Data" },
                        { "step": 2, "name": "Model Training", "desc": "Feeding features into an algorithm to iteratively adjust mathematical weights and minimize loss.", "badge": "Optimization" },
                        { "step": 3, "name": "Model Evaluation", "desc": "Testing accuracy and false alarms on unseen test data before deployment.", "badge": "Validation" },
                        { "step": 4, "name": "Deployment & Inference", "desc": "Running the trained model in production to make real-time predictions on incoming emails.", "badge": "Live Predictions" }
                    ]
                }
            },
            "narration": "Every machine learning system follows a structured four-stage lifecycle. First is Data Collection and Cleaning, where raw information is prepared and tokenized. Second is Model Training, where an algorithm iteratively adjusts its mathematical weights to minimize prediction errors. Third is Evaluation on held-out test data to confirm accuracy and avoid false alarms. And fourth is Deployment and Inference, where the finalized model serves real-time predictions on new incoming data.",
            "code": {
                "language": "python",
                "snippet": "# Standard 4-step Machine Learning workflow\n# 1. Prepare data\n# X_train, y_train = load_and_preprocess_emails()\n# 2. Train model parameters\n# model.fit(X_train, y_train)\n# 3. Evaluate accuracy on unseen test set\n# accuracy = model.score(X_test, y_test)\n# 4. Live inference on new email\n# prediction = model.predict(['Urgent wire transfer required'])",
                "explanation": "Illustrates the four stages of practical machine learning engineering."
            },
            "visualNotes": [
                "Step 1: Collect & clean high-quality historical data",
                "Step 2: Train algorithm by optimizing mathematical weights",
                "Step 3: Evaluate on separate validation set before launch",
                "Step 4: Deploy model for real-time live predictions"
            ],
            "estimated_duration_sec": 28,
            "transition": "Now that we know the workflow, let us explore the three fundamental types of machine learning.",
            "key_takeaway": "A reliable ML system requires careful data cleaning and validation, not just model training."
        },
        {
            "id": 4,
            "scene_type": "diagram",
            "title": "The Three Learning Paradigms",
            "subtitle": "Supervised, Unsupervised & Reinforcement Learning",
            "learning_objective": "Differentiate supervised, unsupervised, and reinforcement learning by data type, objective, and applications.",
            "visual": {
                "component": "ml_paradigms_matrix",
                "data": {
                    "paradigms": [
                        { "name": "Supervised Learning", "data_type": "Labeled Data (Inputs + Ground Truth)", "core_goal": "Predict target label or continuous value", "tasks": ["Classification (Spam/Not Spam)", "Regression (House Prices)"], "icon": "tag" },
                        { "name": "Unsupervised Learning", "data_type": "Unlabeled Data (Inputs Only)", "core_goal": "Discover natural groupings, patterns, and structure", "tasks": ["Clustering (Customer Segments)", "Anomaly Detection"], "icon": "cluster" },
                        { "name": "Reinforcement Learning", "data_type": "Environment States & Reward Feedback", "core_goal": "Learn optimal policy through trial and error", "tasks": ["Game Playing (Chess, AlphaGo)", "Autonomous Robotics"], "icon": "award" }
                    ]
                }
            },
            "narration": "Machine Learning is broadly categorized into three core paradigms. In Supervised Learning, the algorithm learns from labeled pairs with known ground truth. In Unsupervised Learning, data has no labels; the model discovers natural clusters and hidden structure. In Reinforcement Learning, an autonomous agent interacts with an environment, learning optimal actions through reward and penalty feedback.",
            "code": {
                "language": "python",
                "snippet": "# Supervised: (Features, Labels)\nX_labeled = [[1500], [2200], [900]]\ny_labeled = [350000, 480000, 220000]\n# Unsupervised: (Features Only)\ncustomer_data = [[25, 45000], [52, 98000], [28, 48000]]\n# Reinforcement: (State, Action, Reward)\n# agent.step(action) -> next_state, reward",
                "explanation": "Code representation of the three learning paradigm datasets."
            },
            "visualNotes": [
                "Supervised: Labeled inputs (predicting categories or quantities)",
                "Unsupervised: Unlabeled data (clustering and pattern discovery)",
                "Reinforcement: Trial-and-error reward optimization in environments"
            ],
            "estimated_duration_sec": 30,
            "transition": "A common mistake beginners make is evaluating models incorrectly. Let us explore why data splitting is essential.",
            "key_takeaway": "Supervised uses labels, unsupervised finds hidden patterns without labels, and reinforcement learns from reward feedback."
        },
        {
            "id": 5,
            "scene_type": "diagram",
            "title": "Training Data vs Testing Data: Preventing Overfitting",
            "subtitle": "The 80/20 Dataset Split and the Generalization Principle",
            "learning_objective": "Explain why datasets must be split into training and testing sets to validate true generalization and prevent memorization.",
            "visual": {
                "component": "ml_train_test_split",
                "data": {
                    "split_ratio": { "train_percent": 80, "test_percent": 20 },
                    "total_samples": 1000,
                    "train_count": 800,
                    "test_count": 200,
                    "overfitting_explanation": "Evaluating on training data tests memorization, not genuine learning."
                }
            },
            "narration": "A foundational law in machine learning is never evaluating a model on the same data it trained on. We split our data into an 80% Training Set to learn patterns and a 20% Testing Set kept strictly hidden until final evaluation. This guarantees the model generalizes to new, unseen cases rather than simply memorizing training examples.",
            "code": {
                "language": "python",
                "snippet": "# Best Practice: Splitting Dataset into Train (80%) and Test (20%)\n# X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.20, random_state=42)\nprint('Dataset split: 80% Training | 20% Testing')",
                "explanation": "Guarantees evaluation on held-out validation data."
            },
            "visualNotes": [
                "80% Training Data: Used by algorithm to optimize parameters",
                "20% Testing Data: Kept strictly hidden to test real-world accuracy",
                "Prevents Overfitting: Memorizing training noise instead of true trends"
            ],
            "estimated_duration_sec": 26,
            "transition": "Let us now perform an interactive step-by-step feature calculation to see prediction math in action.",
            "key_takeaway": "Never test on training data; a hidden test set is the only true measure of model generalization."
        },
        {
            "id": 6,
            "scene_type": "code",
            "title": "Worked Demonstration: Feature Extraction & Prediction Math",
            "subtitle": "Step-by-Step Scoring of a Live Incoming Message",
            "learning_objective": "Compute a classification decision step-by-step using input feature values, weights, and a threshold.",
            "visual": {
                "component": "ml_worked_example",
                "data": {
                    "incoming_email": "Subject: WINNER! Claim prize funds immediately.",
                    "features": [
                        {"name": "Contains 'winner'", "value": 1, "weight": 0.40, "contribution": 0.40},
                        {"name": "Contains 'prize'", "value": 1, "weight": 0.35, "contribution": 0.35},
                        {"name": "Contains 'funds'", "value": 1, "weight": 0.20, "contribution": 0.20},
                        {"name": "Known Contact", "value": 0, "weight": -0.60, "contribution": 0.00}
                    ],
                    "bias": 0.05,
                    "total_score": 1.00,
                    "threshold": 0.50,
                    "result": "SPAM DETECTED (Score 1.00 >= 0.50)"
                }
            },
            "narration": "Let us walk through a concrete calculation. Suppose our email model extracts four features: presence of the word winner, prize, funds, and whether the sender is a known contact. Summing the weighted contributions gives a score of 1.00, well above our 0.50 threshold. The model confidently flags the incoming message as spam.",
            "code": {
                "language": "python",
                "snippet": "def evaluate_spam_probability(features, weights, bias=0.05):\n    weighted_sum = bias\n    for feature_name, value in features.items():\n        weighted_sum += value * weights.get(feature_name, 0.0)\n    is_spam = weighted_sum >= 0.50\n    return round(weighted_sum, 2), is_spam\n\nemail = {'winner': 1, 'prize': 1, 'funds': 1, 'known_sender': 0}\nweights = {'winner': 0.40, 'prize': 0.35, 'funds': 0.20, 'known_sender': -0.60}\nscore, verdict = evaluate_spam_probability(email, weights)\nprint(f'Computed Score: {score} -> Spam: {verdict}')",
                "explanation": "Calculates weighted sum of features against decision threshold."
            },
            "visualNotes": [
                "Feature vector is multiplied by learned model weights",
                "Positive weights push the score toward the Spam threshold",
                "Negative weights (e.g. known friend sender) suppress the spam score"
            ],
            "estimated_duration_sec": 24,
            "transition": "Finally, let us address model evaluation metrics and critical limitations of machine learning.",
            "key_takeaway": "Predictions are computed by evaluating input features against mathematical weights learned during training."
        },
        {
            "id": 7,
            "scene_type": "diagram",
            "title": "Model Evaluation, Limitations & Ethical Guardrails",
            "subtitle": "Confusion Matrices, False Positives vs False Negatives, and Data Bias",
            "learning_objective": "Evaluate model trade-offs between false positives and false negatives, and recognize key limitations like dataset bias.",
            "visual": {
                "component": "ml_evaluation_metrics",
                "data": {
                    "confusion_matrix": {
                        "true_positive": {"label": "Spam correctly caught as Spam", "count": 95},
                        "false_positive": {"label": "Legitimate email sent to Spam (Harmful!)", "count": 2},
                        "false_negative": {"label": "Spam slipped into Inbox (Annoying)", "count": 5},
                        "true_negative": {"label": "Legitimate email in Inbox", "count": 98}
                    },
                    "metrics": { "accuracy": "96.5%", "precision": "97.9%", "recall": "95.0%" },
                    "limitations": [
                        "Garbage In, Garbage Out: Model inherits historical biases in data",
                        "No True Reasoning: Models learn statistical correlation, not causality",
                        "Distribution Drift: Models degrade when world behavior changes"
                    ]
                }
            },
            "narration": "Evaluating an ML model requires more than overall accuracy. In spam filtering, a False Positive—where a legitimate job offer gets misclassified into spam—is much more harmful than a False Negative, where a minor spam email slips into your inbox. Furthermore, models reflect the biases and errors of their training data.",
            "code": {
                "language": "python",
                "snippet": "# Evaluating Model Performance\ntp, tn, fp, fn = 95, 98, 2, 5\naccuracy = (tp + tn) / (tp + tn + fp + fn)\nprecision = tp / (tp + fp)\nprint(f'Accuracy: {accuracy * 100:.1f}% | Precision: {precision * 100:.1f}%')",
                "explanation": "Calculates Accuracy and Precision from the 2x2 confusion matrix."
            },
            "visualNotes": [
                "False Positive: Legitimate email misclassified as spam (costly user error)",
                "False Negative: Spam email slips through into inbox (minor annoyance)",
                "Limitations: Models reflect data biases and lack causal common sense"
            ],
            "estimated_duration_sec": 28,
            "transition": "Let us summarize our learning journey and test your understanding in the diagnostic quiz.",
            "key_takeaway": "Overall accuracy is not enough: evaluating false positives and understanding data bias is essential for real-world deployment."
        },
        {
            "id": 8,
            "scene_type": "summary",
            "title": "Curriculum Recap & Diagnostic Assessment Roadmap",
            "subtitle": "Mastery Verification and Next Learning Steps",
            "learning_objective": "Synthesize the core principles of Machine Learning and transition to the diagnostic assessment.",
            "visual": {
                "component": "ml_summary_checklist",
                "data": {
                    "mastery_checklist": [
                        {"topic": "Learning from Data vs Rule-Based Programming", "status": "Mastered"},
                        {"topic": "Email Spam Case Study & Feature Weights", "status": "Mastered"},
                        {"topic": "4-Stage ML Workflow (Collection -> Inference)", "status": "Mastered"},
                        {"topic": "Supervised, Unsupervised & Reinforcement Paradigms", "status": "Mastered"},
                        {"topic": "80/20 Train vs Test Split Rationale", "status": "Mastered"},
                        {"topic": "Evaluation Trade-Offs & Data Bias", "status": "Mastered"}
                    ],
                    "next_action": "Complete Diagnostic Assessment Quiz"
                }
            },
            "narration": "Congratulations on completing the Basics of Machine Learning lecture! You now understand the distinction between rule-based code and learning from data, the spam classification case study, the four workflow stages, the three learning paradigms, the vital necessity of train-test splits, and critical evaluation metrics. Now, take the diagnostic quiz below.",
            "code": {
                "language": "python",
                "snippet": "ml_mastery = {\n    'workflow': ['Data', 'Training', 'Evaluation', 'Inference'],\n    'paradigms': ['Supervised', 'Unsupervised', 'Reinforcement'],\n    'data_discipline': 'Always validate on unseen test split'\n}\nprint('Ready for Diagnostic Quiz!')",
                "explanation": "Summary checklist contract object."
            },
            "visualNotes": [
                "Core definition & motivation mastered",
                "Supervised, Unsupervised & Reinforcement differentiated",
                "Training vs Testing split rationale understood",
                "Ready for Phase 1 Diagnostic Assessment"
            ],
            "estimated_duration_sec": 24,
            "transition": "Proceed to the diagnostic quiz below to test your knowledge.",
            "key_takeaway": "You have built a rigorous mental model of machine learning principles, paradigms, workflows, and evaluation."
        }
    ]

    key_concepts = [
        {"term": "Machine Learning", "definition": "A subset of artificial intelligence where algorithms automatically discover patterns and rules from historical data rather than following hand-coded instructions."},
        {"term": "Supervised Learning", "definition": "A learning paradigm where algorithms are trained on labeled datasets containing input features paired with ground-truth target outputs."},
        {"term": "Unsupervised Learning", "definition": "A learning paradigm where algorithms discover hidden patterns, groupings, or clusters in unlabeled data without predefined output targets."},
        {"term": "Reinforcement Learning", "definition": "A learning paradigm where an autonomous agent learns an optimal sequence of actions through trial-and-error interactions with an environment guided by rewards and penalties."},
        {"term": "Overfitting", "definition": "A modeling flaw where an algorithm memorizes training data noise and idiosyncrasies, achieving near-perfect training scores but failing to generalize to new, unseen test data."},
        {"term": "Train/Test Split", "definition": "The practice of dividing a dataset into a training subset (typically 80%) to fit model parameters and an isolated testing subset (20%) to objectively evaluate generalization."}
    ]

    code_examples = [
        {
            "title": "Email Spam Classifier Feature Scorer (Python)",
            "lang": "python",
            "code": "def score_email_spam(tokens, weights, threshold=0.5):\n    score = sum(weights.get(t, 0.0) for t in tokens)\n    is_spam = score >= threshold\n    return {'score': round(score, 3), 'is_spam': is_spam}\n\nweights = {'free': 0.35, 'urgent': 0.25, 'wire': 0.30, 'edu_sender': -0.60}\nsample_email = ['free', 'wire', 'urgent']\nresult = score_email_spam(sample_email, weights)\nprint(f'Classification Result: {result}')"
        }
    ]

    practical_task = {
        "title": "Task: Build a Simple Spam Score Classifier",
        "instructions": "Implement a Python function `classify_email(tokens, weights, threshold)` that sums the weights of all matching tokens in the email and returns `True` if the total score is greater than or equal to the threshold, and `False` otherwise.",
        "starterCode": "def classify_email(tokens, weights, threshold=0.5):\n    score = sum(weights.get(token, 0.0) for token in tokens)\n    return score >= threshold\n\n# Test your function:\nweights = {'free': 0.4, 'urgent': 0.3, 'friend': -0.5}\nprint(classify_email(['free', 'urgent'], weights, 0.5))",
        "expectedOutput": "True",
        "solution": "def classify_email(tokens, weights, threshold=0.5):\n    score = sum(weights.get(token, 0.0) for token in tokens)\n    return score >= threshold",
        "is_coding": True
    }

    return {
        "title": "Basics of Machine Learning: Principles, Workflows & Evaluation",
        "category": "Machine Learning & AI",
        "difficulty": difficulty,
        "duration": "14 mins",
        "summary": "Master the foundational mental models of Machine Learning: how algorithms learn from data, email spam classification, the 4-step workflow, supervised vs unsupervised vs reinforcement learning, train-test splits, and model evaluation metrics.",
        "learning_objectives": [
            "Distinguish Machine Learning from traditional rule-based programming",
            "Analyze feature extraction and probability scoring in email spam classification",
            "Trace the 4 stages of the Machine Learning lifecycle",
            "Compare Supervised, Unsupervised, and Reinforcement Learning paradigms",
            "Explain why datasets must be split into training and testing subsets",
            "Evaluate model performance trade-offs between accuracy, false positives, and bias"
        ],
        "prerequisites": [
            "Basic understanding of functions and variables",
            "High school algebra (variables, multiplication, thresholds)"
        ],
        "slides": slides,
        "keyConcepts": key_concepts,
        "codeExamples": code_examples,
        "practicalTask": practical_task
    }


# ---------------------------------------------------------------------------
# Generic Academic Curriculum Generator (Non-Coding Topics Have NO Code)
# ---------------------------------------------------------------------------

def build_generic_academic_curriculum(
    topic: str,
    plan: Optional[TopicPlan] = None,
    difficulty: str = "Beginner"
) -> Dict[str, Any]:
    """Generates a pedagogical curriculum for any academic topic.
    CRITICAL RULE:
    - If plan.code_relevant is False: code is None on ALL scenes; no Python dummy code.
    - If plan.code_relevant is True: code uses plan.code_language (never defaults to Python).
    """
    if plan is None:
        plan = classify_topic_fallback(topic, difficulty)

    formatted = topic.strip().capitalize()

    if not plan.code_relevant:
        # NON-CODING TOPIC: code is strictly None on all scenes!
        slides = [
            {
                "id": 1,
                "scene_type": "concept",
                "title": f"Foundations of {formatted}",
                "subtitle": "Core Principles & Operational Mental Model",
                "learning_objective": f"Understand the fundamental definition and governing principles of {topic}.",
                "visual": {
                    "component": "FlowDiagram",
                    "data": {
                        "nodes": [
                            {"label": "Prerequisites & Inputs", "desc": f"Environmental and structural starting state for {topic}"},
                            {"label": "Core Mechanism", "desc": "Sequential governing transformations and dynamics"},
                            {"label": "System Outcomes", "desc": "Equilibrium state, products, and real-world significance"}
                        ],
                        "title": f"{formatted} Operational Flow"
                    }
                },
                "narration": f"Welcome to this visual lecture on {topic}. In this session, we examine how the core mechanisms operate step-by-step, their real-world impact, and the underlying laws governing each state transition.",
                "code": None,
                "visualNotes": [
                    f"Establishes formal vocabulary and mental models for {topic}",
                    "Identifies fundamental prerequisites and inputs",
                    "Explains governing scientific and systemic mechanisms"
                ],
                "estimated_duration_sec": 22,
                "transition": "Now let us examine the progressive stages and operational timeline.",
                "key_takeaway": f"{formatted} operates through deterministic, interconnected stages that preserve systemic balance."
            },
            {
                "id": 2,
                "scene_type": "diagram",
                "title": f"Process Stages & Structural Timeline",
                "subtitle": "Step-by-Step Progression and State Transitions",
                "learning_objective": f"Trace the chronological or procedural stages of {topic}.",
                "visual": {
                    "component": "Timeline",
                    "data": {
                        "events": [
                            {"phase": "Phase 1: Initiation", "title": "Activation & Input Capture", "desc": f"Initial conditions trigger the primary mechanism of {topic}."},
                            {"phase": "Phase 2: Transformation", "title": "Dynamic Reaction", "desc": "Intermediary state changes occur, converting energy or resources."},
                            {"phase": "Phase 3: Stabilization", "title": "Terminal Equilibrium", "desc": "Final products or stable outcomes are synthesized and preserved."}
                        ],
                        "title": f"Stage Sequence for {formatted}"
                    }
                },
                "narration": f"Notice how {topic} unfolds through distinct stages. Each phase builds upon the previous one, ensuring that invariants are preserved while progressing toward equilibrium.",
                "code": None,
                "visualNotes": [
                    "Sequential phase progression",
                    "Strict boundary conditions govern each stage",
                    "Intermediate states lead predictably to final outcomes"
                ],
                "estimated_duration_sec": 24,
                "transition": "Next, let us analyze a detailed comparison between theoretical principles and observed phenomena.",
                "key_takeaway": "Understanding the sequential timeline clarifies how causes produce stable observable effects."
            },
            {
                "id": 3,
                "scene_type": "example",
                "title": "Analytical Comparison & Real-World Manifestations",
                "subtitle": "Theoretical Framework vs Concrete Observations",
                "learning_objective": f"Compare key dimensions and variations in {topic}.",
                "visual": {
                    "component": "ComparisonTable",
                    "data": {
                        "columns": ["Key Dimension", "Baseline Mechanism", f"In Context of {formatted}"],
                        "rows": [
                            {"feature": "Primary Driver", "standard": "External stimuli", "target": "Systemic regulation"},
                            {"feature": "Resource Dynamic", "standard": "Passive consumption", "target": "Active conversion & synthesis"},
                            {"feature": "Equilibrium Check", "standard": "Static stability", "target": "Dynamic regulatory balance"}
                        ],
                        "title": f"Comparative Matrix: {formatted}"
                    }
                },
                "narration": f"Comparing different dimensions reveals why {topic} is so vital. Notice the contrast between passive baseline models and the dynamic, adaptive equilibrium observed in actual practice.",
                "code": None,
                "visualNotes": [
                    "Contrasts idealized assumptions with observed reality",
                    "Highlights resource efficiency and regulatory feedback",
                    "Demonstrates practical real-world significance"
                ],
                "estimated_duration_sec": 22,
                "transition": "Let us quantify the relative impacts and distribution of these mechanisms.",
                "key_takeaway": "Dynamic feedback loops distinguish robust systems from brittle static models."
            },
            {
                "id": 4,
                "scene_type": "diagram",
                "title": "Quantitative Dynamics & Distribution",
                "subtitle": "Measurable Metrics and Efficiency Profiles",
                "learning_objective": f"Examine quantitative distributions, energy yields, or performance metrics in {topic}.",
                "visual": {
                    "component": "BarChart",
                    "data": {
                        "bars": [
                            {"label": "Conversion Yield", "value": 85, "unit": "%"},
                            {"label": "Energy Retention", "value": 74, "unit": "%"},
                            {"label": "Systemic Resilience", "value": 92, "unit": "%"}
                        ],
                        "title": f"Efficiency & Impact Metrics: {formatted}"
                    }
                },
                "narration": f"When evaluating {topic} quantitatively, we observe high resilience and balanced yield. These metrics reflect how efficiently energy, information, or structural balance is sustained.",
                "code": None,
                "visualNotes": [
                    "Quantitative evaluation of efficiency",
                    "High resilience under boundary fluctuations",
                    "Measurable impact across core variables"
                ],
                "estimated_duration_sec": 22,
                "transition": "Now let us verify our understanding with an interactive checkpoint.",
                "key_takeaway": "Quantitative metrics demonstrate how theoretical principles manifest in measurable efficiency."
            },
            {
                "id": 5,
                "scene_type": "quiz",
                "title": "Diagnostic Concept Check",
                "subtitle": "Interactive Check for Understanding",
                "learning_objective": f"Test understanding of the governing principles of {topic}.",
                "visual": {
                    "component": "QuizCard",
                    "data": {
                        "question": f"What is the primary governing principle of {formatted}?",
                        "options": [
                            f"Systematic transformation following governing domain laws and conservation principles",
                            "Arbitrary stochastic fluctuations with no underlying invariants",
                            "Permanent irreversible destruction of systemic energy",
                            "Unconstrained instantaneous state collapse"
                        ],
                        "correct_index": 0,
                        "explanation": f"{formatted} operates deterministically according to governing conservation laws and structural invariants."
                    }
                },
                "narration": f"Take a moment to test your understanding. Which governing principle correctly describes how {topic} operates?",
                "code": None,
                "visualNotes": [
                    "Immediate formative assessment",
                    "Reinforces core invariants and terminology",
                    "Clarifies common domain misconceptions"
                ],
                "estimated_duration_sec": 20,
                "transition": "Let us conclude with the governing model summary.",
                "key_takeaway": "Active recall solidifies conceptual mental models."
            },
            {
                "id": 6,
                "scene_type": "summary",
                "title": f"Curriculum Summary & Governing Formula",
                "subtitle": "Synthesis and Academic Mastery",
                "learning_objective": f"Synthesize all concepts learned in {topic}.",
                "visual": {
                    "component": "FormulaView",
                    "data": {
                        "formula": f"Governing Equilibrium of {formatted}",
                        "variables": [
                            {"symbol": "Requisites", "meaning": f"Primary environmental inputs driving {topic}"},
                            {"symbol": "Kinetics", "meaning": "Internal transformation rates and mechanisms"},
                            {"symbol": "Yield", "meaning": "Synthesized products and stable equilibrium"}
                        ],
                        "note": f"Key takeaway: {formatted} maintains balance through structured regulatory feedback loops."
                    }
                },
                "narration": f"Congratulations on completing this structured visual lecture on {topic}! You now understand the foundational definitions, the procedural timeline, quantitative metrics, and core principles. Complete the quiz below to confirm your mastery.",
                "code": None,
                "visualNotes": [
                    f"Core foundations of {topic} mastered",
                    "Mechanisms, stages, and metrics synthesized",
                    "Ready for the diagnostic assessment"
                ],
                "estimated_duration_sec": 22,
                "transition": "Proceed to the diagnostic quiz below.",
                "key_takeaway": f"You have built a rigorous mental model of {topic}."
            }
        ]

        key_concepts = [
            {"term": f"{formatted} Principle", "definition": f"The foundational theoretical premise underlying how {topic} operates in nature or governance."},
            {"term": "Operational Invariant", "definition": "A condition that remains consistently true throughout all state transitions in the system."},
            {"term": "Equilibrium Boundary", "definition": "The formal limits within which the process operates stably without failure or breakdown."}
        ]

        code_examples = []
        practical_task = {
            "title": f"Analytical Exercise: Apply {formatted} in Practice",
            "instructions": f"Analyze the core mechanisms of {topic} and identify which initial condition is necessary for equilibrium.",
            "starterCode": None,
            "expectedOutput": "Conservation and equilibrium verified.",
            "solution": "Analytical balance verified.",
            "is_coding": False
        }

    else:
        # PROGRAMMING TOPIC: Uses plan.code_language (e.g., SQL, JavaScript, Python)
        lang = plan.code_language

        if lang == "sql":
            code_1 = "SELECT\n    u.id,\n    u.username,\n    o.order_id,\n    o.total_amount\nFROM users u\nINNER JOIN orders o ON u.id = o.user_id\nWHERE o.total_amount > 100\nORDER BY o.total_amount DESC;"
            code_2 = "-- Left Join to find users without orders\nSELECT\n    u.id,\n    u.username,\n    COUNT(o.order_id) AS total_orders\nFROM users u\nLEFT JOIN orders o ON u.id = o.user_id\nGROUP BY u.id, u.username;"
            starter = "-- Write your query here:\nSELECT * FROM users;"
            solution = "SELECT * FROM users WHERE active = 1;"
        elif lang in ("javascript", "js"):
            code_1 = "// Closure encapsulation demonstration\nfunction createCounter(initial = 0) {\n  let count = initial;\n  return {\n    increment: () => ++count,\n    decrement: () => --count,\n    getCount: () => count\n  };\n}\nconst counter = createCounter(5);\nconsole.log(counter.increment());"
            code_2 = "// Higher-order function pipeline\nconst numbers = [1, 2, 3, 4, 5];\nconst evensDoubled = numbers\n  .filter(n => n % 2 === 0)\n  .map(n => n * 2);\nconsole.log(evensDoubled);"
            starter = "// Implement solve() function\nfunction solve(x) {\n  return x * 2;\n}"
            solution = "function solve(x) { return x * 2; }"
        else:
            # Python
            code_1 = "def compute_trend(x_values, y_values):\n    n = len(x_values)\n    mean_x = sum(x_values) / n\n    mean_y = sum(y_values) / n\n    numerator = sum((x - mean_x) * (y - mean_y) for x, y in zip(x_values, y_values))\n    denominator = sum((x - mean_x) ** 2 for x in x_values)\n    slope = numerator / denominator\n    intercept = mean_y - slope * mean_x\n    return slope, intercept\n\nx = [1, 2, 3, 4, 5]\ny = [2, 4, 5, 4, 5]\nslope, intercept = compute_trend(x, y)\nprint(f'Slope: {slope:.2f}, Intercept: {intercept:.2f}')"
            code_2 = "def process_stream(data):\n    return [item for item in data if item is not None]\n\nresult = process_stream([1, 2, None, 4])\nprint(f'Clean data: {result}')"
            starter = "def solve(items):\n    return [x * 2 for x in items]"
            solution = "def solve(items):\n    return [x * 2 for x in items]"

        slides = [
            {
                "id": 1,
                "scene_type": "concept",
                "title": f"Introduction to {formatted}",
                "subtitle": "Core Principles & Architecture",
                "learning_objective": f"Understand the foundational concepts of {topic}.",
                "visual": {
                    "component": "FlowDiagram",
                    "data": {
                        "nodes": [
                            {"label": "Input Scope", "desc": "Parameters & preconditions"},
                            {"label": "Execution Logic", "desc": f"How {topic} processes state"},
                            {"label": "Verified Result", "desc": "Deterministic return value"}
                        ],
                        "title": f"{formatted} Pipeline"
                    }
                },
                "narration": f"Welcome to this technical masterclass on {topic}. In this session, we analyze how this programming pattern operates, its syntax mechanics, and production best practices.",
                "code": None,
                "visualNotes": [
                    f"Defines core vocabulary for {topic}",
                    "Identifies parameter contracts and return invariants",
                    "Examines clean idiomatic patterns"
                ],
                "estimated_duration_sec": 22,
                "transition": "Now let us examine the execution flow and state transitions.",
                "key_takeaway": f"{formatted} provides a robust paradigm for managing computational flow."
            },
            {
                "id": 2,
                "scene_type": "diagram",
                "title": "State Transitions & Mechanics",
                "subtitle": "Step-by-Step Execution Sequence",
                "learning_objective": f"Trace execution flow and state transformations in {topic}.",
                "visual": {
                    "component": "Timeline",
                    "data": {
                        "events": [
                            {"phase": "Step 1", "title": "Binding & Initialization", "desc": "Scope parameters bound into memory."},
                            {"phase": "Step 2", "title": "Evaluation Loop", "desc": "State transitions evaluate expressions."},
                            {"phase": "Step 3", "title": "Return / Output", "desc": "Validated return value emitted."}
                        ],
                        "title": "Execution Timeline"
                    }
                },
                "narration": f"Notice how each step in {topic} preserves predictable state. By adhering to language semantics, side-effects are minimized.",
                "code": None,
                "visualNotes": [
                    "Predictable memory scope management",
                    "Deterministic evaluation order",
                    "Explicit invariant enforcement"
                ],
                "estimated_duration_sec": 22,
                "transition": "Let us now study the idiomatic code implementation.",
                "key_takeaway": "Predictable software systems require strict invariant enforcement."
            },
            {
                "id": 3,
                "scene_type": "code",
                "title": f"Idiomatic Implementation ({lang.upper()})",
                "subtitle": "Production Syntax & Code Structure",
                "learning_objective": f"Implement and evaluate idiomatic {lang} code for {topic}.",
                "visual": {
                    "component": "ComparisonTable",
                    "data": {
                        "columns": ["Pattern", "Recommended Approach", "Anti-Pattern"],
                        "rows": [
                            {"feature": "Scope Safety", "standard": "Isolated / Immutable", "target": "Global mutations"},
                            {"feature": "Error Handling", "standard": "Explicit boundary checks", "target": "Silent failure"}
                        ],
                        "title": f"{lang.upper()} Engineering Standards"
                    }
                },
                "narration": f"Here is an idiomatic {lang} implementation. Notice the clean structure, clear parameter naming, and predictable return values.",
                "code": {
                    "language": lang,
                    "snippet": code_1,
                    "explanation": f"Idiomatic {lang} implementation demonstrating {topic}."
                },
                "visualNotes": [
                    f"Idiomatic {lang} syntax",
                    "Clear parameter validation",
                    "Modularity and readability"
                ],
                "estimated_duration_sec": 24,
                "transition": "Next, let us analyze real-world case studies and trade-offs.",
                "key_takeaway": f"Writing clean, modular {lang} code ensures maintainability."
            },
            {
                "id": 4,
                "scene_type": "example",
                "title": "Production Case Study & Practical Application",
                "subtitle": "Handling Complex Scenarios and Edge Cases",
                "learning_objective": f"Apply {topic} to solve production programming scenarios.",
                "visual": {
                    "component": "BarChart",
                    "data": {
                        "bars": [
                            {"label": "Throughput", "value": 94, "unit": "%"},
                            {"label": "Memory Efficiency", "value": 88, "unit": "%"},
                            {"label": "Maintainability", "value": 90, "unit": "%"}
                        ],
                        "title": "Architectural Performance"
                    }
                },
                "narration": f"In production systems, applying {topic} optimizes performance while keeping codebases maintainable.",
                "code": {
                    "language": lang,
                    "snippet": code_2,
                    "explanation": f"Advanced {lang} practical demonstration."
                },
                "visualNotes": [
                    "Production-ready patterns",
                    "Memory and throughput trade-offs",
                    "Defensive edge-case handling"
                ],
                "estimated_duration_sec": 24,
                "transition": "Test your knowledge in this diagnostic check.",
                "key_takeaway": "Real-world engineering requires balancing efficiency with code clarity."
            },
            {
                "id": 5,
                "scene_type": "quiz",
                "title": "Technical Diagnostic Check",
                "subtitle": "Knowledge Verification",
                "learning_objective": f"Assess understanding of {topic} mechanics.",
                "visual": {
                    "component": "QuizCard",
                    "data": {
                        "question": f"When implementing {topic} in {lang.upper()}, which approach is best practice?",
                        "options": [
                            "Enforce clear parameter contracts and handle boundary edge-cases",
                            "Mutate unindexed global variables without synchronization",
                            "Disable compiler and interpreter boundary assertions",
                            "Hardcode magic numbers without comments"
                        ],
                        "correct_index": 0,
                        "explanation": "Clear parameter contracts and defensive boundary validation guarantee deterministic execution."
                    }
                },
                "narration": f"Here is a quick question to verify your understanding. Which implementation practice is recommended?",
                "code": None,
                "visualNotes": [
                    "Verification of language semantics",
                    "Reinforces production best practices",
                    "Prepares for the coding task"
                ],
                "estimated_duration_sec": 20,
                "transition": "Let us summarize and conclude.",
                "key_takeaway": "Defensive contracts prevent subtle runtime bugs."
            },
            {
                "id": 6,
                "scene_type": "summary",
                "title": "Curriculum Recap & Next Steps",
                "subtitle": "Mastery Verification",
                "learning_objective": f"Synthesize all concepts learned in {topic}.",
                "visual": {
                    "component": "FormulaView",
                    "data": {
                        "formula": f"Architecture Contract: {formatted}",
                        "variables": [
                            {"symbol": "Input", "meaning": "Validated parameter contracts"},
                            {"symbol": "Logic", "meaning": f"Idiomatic {lang.upper()} state transitions"},
                            {"symbol": "Output", "meaning": "Verified deterministic results"}
                        ],
                        "note": "Ready for diagnostic quiz and practical challenge."
                    }
                },
                "narration": f"Congratulations on completing this technical lecture on {topic}! You now understand the architectural patterns, the idiomatic {lang} syntax, and critical edge cases. Proceed to the diagnostic assessment.",
                "code": None,
                "visualNotes": [
                    f"Core principles of {topic} mastered",
                    "Idiomatic patterns verified",
                    "Ready for diagnostic quiz"
                ],
                "estimated_duration_sec": 22,
                "transition": "Proceed to the assessment below.",
                "key_takeaway": f"You have built a rigorous understanding of {topic}."
            }
        ]

        key_concepts = [
            {"term": f"{formatted} Pattern", "definition": f"The core design pattern and algorithmic mechanism underlying {topic}."},
            {"term": "Language Idiom", "definition": f"The standard, expressive way to implement this concept in {lang.upper()}."},
            {"term": "Boundary Invariant", "definition": "A condition that must remain true to avoid runtime exceptions or undefined behavior."}
        ]

        code_examples = [
            {
                "title": f"Idiomatic Pattern in {lang.upper()}",
                "lang": lang,
                "code": code_1
            }
        ]

        practical_task = {
            "title": f"Coding Task: Implement {formatted}",
            "instructions": f"Implement the required {lang.upper()} logic as discussed in the lecture.",
            "starterCode": starter,
            "expectedOutput": "Validated",
            "solution": solution,
            "is_coding": True
        }

    return {
        "title": f"{formatted}: Comprehensive Masterclass",
        "category": plan.domain,
        "difficulty": difficulty,
        "duration": "14 mins",
        "summary": f"Comprehensive structured conceptual lecture covering the fundamental principles, mechanisms, and application of {topic}.",
        "code_relevant": plan.code_relevant,
        "code_language": plan.code_language,
        "learning_objectives": [
            f"Understand the core definition and mechanisms of {topic}",
            f"Analyze operational state transitions and boundary conditions",
            f"Evaluate real-world applications and trade-offs"
        ],
        "prerequisites": ["Basic analytical problem solving"],
        "slides": slides,
        "keyConcepts": key_concepts,
        "codeExamples": code_examples,
        "practicalTask": practical_task
    }


# ---------------------------------------------------------------------------
# Quiz Question Generator
# ---------------------------------------------------------------------------

def generate_aligned_quiz_questions(
    topic: str,
    lesson_content: Dict[str, Any],
    difficulty: str = "Intermediate"
) -> List[Dict[str, Any]]:
    """Generates quiz questions strictly grounded in the lesson content."""
    is_ml = any(k in topic.lower() for k in ["machine learning", "ml", "learning algorithm", "supervised", "unsupervised"])

    if is_ml:
        return [
            # 5 MCQs
            {
                "question_type": "mcq",
                "question_text": "How does Machine Learning fundamentally differ from traditional software engineering?",
                "options": [
                    "Instead of humans writing manual if-else rules, algorithms discover patterns and rules from historical data",
                    "Machine learning compiles code into assembly language faster than traditional compilers",
                    "Machine learning eliminates the need for computer hardware and CPU registers",
                    "Traditional programming operates exclusively on unstructured text while ML only uses integers"
                ],
                "correct_answer": "0",
                "explanation": "In traditional programming, humans write explicit rules. In Machine Learning, computers discover rules automatically by analyzing data paired with outcomes.",
                "marks": 1,
                "difficulty": "basic",
                "related_concept": "Machine Learning vs Traditional Programming"
            },
            {
                "question_type": "mcq",
                "question_text": "In the email spam classification case study, why would a simple rule-based filter that blocks the word 'FREE' fail?",
                "options": [
                    "It would generate false positives by blocking legitimate emails, such as university notices offering 'free tutoring'",
                    "Computers cannot search for uppercase letters in email text strings",
                    "The word 'free' is illegal to use in email transmission headers",
                    "Spam emails never use the word 'free' in their message content"
                ],
                "correct_answer": "0",
                "explanation": "Single-keyword rules are brittle and cause false positives. Machine learning instead combines multiple weighted features to determine probability.",
                "marks": 1,
                "difficulty": "intermediate",
                "related_concept": "Feature Extraction & Spam Classification"
            },
            {
                "question_type": "mcq",
                "question_text": "Which of the following correctly orders the four stages of the standard Machine Learning lifecycle?",
                "options": [
                    "Data Collection -> Model Training -> Model Evaluation -> Live Inference",
                    "Live Inference -> Model Training -> Data Collection -> Model Evaluation",
                    "Model Evaluation -> Live Inference -> Model Training -> Data Collection",
                    "Model Training -> Data Collection -> Live Inference -> Model Evaluation"
                ],
                "correct_answer": "0",
                "explanation": "The ML lifecycle starts with collecting/cleaning data, training the model, evaluating performance on test data, and finally deploying for live inference.",
                "marks": 1,
                "difficulty": "intermediate",
                "related_concept": "Machine Learning Workflow Stages"
            },
            {
                "question_type": "mcq",
                "question_text": "Which learning paradigm uses UNLABELED data to discover natural groupings without predefined target answers?",
                "options": [
                    "Unsupervised Learning",
                    "Supervised Learning",
                    "Reinforcement Learning",
                    "Rule-Based Symbolic Logic"
                ],
                "correct_answer": "0",
                "explanation": "Unsupervised learning discovers hidden patterns and clusters in unlabeled data without predefined ground-truth targets.",
                "marks": 1,
                "difficulty": "intermediate",
                "related_concept": "Learning Paradigms: Supervised vs Unsupervised vs Reinforcement"
            },
            {
                "question_type": "mcq",
                "question_text": "What is the primary purpose of splitting historical data into distinct Training and Testing subsets?",
                "options": [
                    "To evaluate model generalization on unseen data and detect overfitting",
                    "To double the storage capacity needed for database indexes",
                    "To convert asynchronous network calls into thread-safe blocks",
                    "To permanently delete outdated records from cache"
                ],
                "correct_answer": "0",
                "explanation": "Training on one subset and testing on held-out samples measures true generalization and prevents deceptive overfitting scores.",
                "marks": 1,
                "difficulty": "basic",
                "related_concept": "Train/Test Split & Generalization"
            },
            # 3 True/False Questions
            {
                "question_type": "true_false",
                "question_text": "Evaluating a model on the same data it was trained on gives an objective, reliable measure of its real-world performance.",
                "options": ["True", "False"],
                "correct_answer": "1",
                "explanation": "False! Evaluating on training data tests memorization (overfitting), not genuine generalization to new, unseen samples.",
                "marks": 1,
                "difficulty": "basic",
                "related_concept": "Generalization & Overfitting"
            },
            {
                "question_type": "true_false",
                "question_text": "In supervised learning, each training sample must include input feature attributes paired with a known ground-truth target label.",
                "options": ["True", "False"],
                "correct_answer": "0",
                "explanation": "True! Supervised learning requires ground-truth labels for the algorithm to compute error gradients and learn weights.",
                "marks": 1,
                "difficulty": "basic",
                "related_concept": "Supervised Learning Fundamentals"
            },
            {
                "question_type": "true_false",
                "question_text": "When a model achieves nearly 100% training accuracy but performs poorly on unseen test data, it is suffering from overfitting.",
                "options": ["True", "False"],
                "correct_answer": "0",
                "explanation": "True! Overfitting occurs when a model memorizes idiosyncrasies and noise in the training set rather than learning true underlying patterns.",
                "marks": 1,
                "difficulty": "intermediate",
                "related_concept": "Generalization & Overfitting"
            },
            # 2 Fill in the blanks
            {
                "question_type": "fill_blank",
                "question_text": "In supervised learning, the historical examples provided with target answers are known as _____ data.",
                "options": [],
                "correct_answer": "labeled",
                "explanation": "Labeled data provides the ground-truth targets necessary for supervised learning algorithms.",
                "marks": 1,
                "difficulty": "basic",
                "related_concept": "Supervised Learning Fundamentals"
            },
            {
                "question_type": "fill_blank",
                "question_text": "The boundary or separating surface that divides different class predictions in an ML classification model is called the decision _____.",
                "options": [],
                "correct_answer": "boundary",
                "explanation": "The decision boundary partitions feature space into distinct predicted outcome classes.",
                "marks": 1,
                "difficulty": "intermediate",
                "related_concept": "Decision Boundaries & Classification"
            },
            # 1 Coding question
            {
                "question_type": "coding",
                "question_text": "Write a Python function `predict_spam(probability, threshold=0.5)` that returns 'Spam' if `probability >= threshold` and 'Ham' otherwise.",
                "options": [],
                "correct_answer": "def predict_spam(probability, threshold=0.5):\n    return 'Spam' if probability >= threshold else 'Ham'",
                "explanation": "Compares predicted probability against the decision boundary threshold.",
                "marks": 3,
                "difficulty": "application",
                "related_concept": "Decision Boundaries & Classification",
                "coding_details": {
                    "problem_statement": "Given a predicted spam probability float between 0.0 and 1.0, and an optional threshold (default 0.5), return 'Spam' if probability >= threshold else 'Ham'.",
                    "requirements": ["Check probability >= threshold", "Return exact string 'Spam' or 'Ham'"],
                    "input_description": "probability (float), optional threshold (float)",
                    "output_description": "String: 'Spam' or 'Ham'",
                    "constraints": "0.0 <= probability <= 1.0",
                    "sample_input": "0.85, 0.5",
                    "sample_output": "'Spam'",
                    "test_cases": [
                        {"input": "0.85, 0.5", "expected_output": "'Spam'"},
                        {"input": "0.2, 0.5", "expected_output": "'Ham'"},
                        {"input": "0.5, 0.5", "expected_output": "'Spam'"}
                    ],
                    "starter_code": "def predict_spam(probability, threshold=0.5):\n    # Write your solution here\n    pass"
                }
            }
        ]

    formatted = topic.strip().capitalize()
    key_concepts = lesson_content.get("keyConcepts", [])
    q1_concept = key_concepts[0]["term"] if key_concepts else f"{formatted} Foundations"
    q1_def = key_concepts[0]["definition"] if key_concepts else "Core theoretical foundation"

    return [
        {
            "question_type": "mcq",
            "question_text": f"Based on the lesson on {formatted}, what is the definition of {q1_concept}?",
            "options": [
                q1_def,
                "A hardware interrupt designed to halt the system memory bus",
                "An asynchronous promise wrapper for unindexed heap allocation",
                "A compiler directive that disables garbage collection permanently"
            ],
            "correct_answer": "0",
            "explanation": f"According to the lecture, {q1_concept} is defined as: {q1_def}",
            "marks": 1,
            "difficulty": "basic",
            "related_concept": q1_concept
        },
        {
            "question_type": "mcq",
            "question_text": f"Why is understanding core state invariants essential when studying {formatted}?",
            "options": [
                "To guarantee deterministic, reliable understanding under boundary conditions",
                "To eliminate the need for computer operating systems",
                "To automatically bypass physical conservation laws",
                "To convert synchronous logic into distributed networks"
            ],
            "correct_answer": "0",
            "explanation": "Maintaining invariants ensures predictable behavior and prevents systemic failures.",
            "marks": 1,
            "difficulty": "intermediate",
            "related_concept": "Operational Invariants"
        },
        {
            "question_type": "true_false",
            "question_text": f"In practical systems, {formatted} mechanisms must handle boundary conditions to maintain stability.",
            "options": ["True", "False"],
            "correct_answer": "0",
            "explanation": "True! Robust systems must always account for boundary conditions and edge cases.",
            "marks": 1,
            "difficulty": "basic",
            "related_concept": "System Reliability"
        },
        {
            "question_type": "fill_blank",
            "question_text": f"A condition that remains consistently true throughout all operational transitions in {formatted} is called an _____.",
            "options": [],
            "correct_answer": "invariant",
            "explanation": "An invariant is a condition that never changes across state transitions.",
            "marks": 1,
            "difficulty": "intermediate",
            "related_concept": "Invariants"
        },
        {
            "question_type": "mcq",
            "question_text": f"Which strategy is recommended when managing state transformations in {formatted}?",
            "options": [
                "Isolate state transformations and use predictable contracts to prevent side-effects",
                "Directly mutate global variables without synchronization",
                "Disable all runtime boundary assertions",
                "Bypass parameter verification completely"
            ],
            "correct_answer": "0",
            "explanation": "Isolating state transformations prevents race conditions and unpredictable side effects.",
            "marks": 1,
            "difficulty": "intermediate",
            "related_concept": "State Management"
        }
    ]


# ---------------------------------------------------------------------------
# Educational Lesson Pipeline Class
# ---------------------------------------------------------------------------

class EducationalLessonPipeline:
    """Enterprise multi-stage lesson generation pipeline ensuring pedagogical depth,
    valid multi-language code syntax, synchronized timing, and curriculum consistency.
    """

    @classmethod
    def classify_topic_fallback(cls, topic: str, difficulty: str = "Beginner") -> TopicPlan:
        return classify_topic_fallback(topic, difficulty)

    @classmethod
    def post_process_and_guard(cls, lesson: Dict[str, Any], plan: TopicPlan) -> Dict[str, Any]:
        return post_process_and_guard(lesson, plan)

    @classmethod
    def generate_full_curriculum(
        cls,
        topic: str,
        difficulty: str = "Beginner",
        plan: Optional[TopicPlan] = None
    ) -> Dict[str, Any]:
        """Main pipeline entrypoint to synthesize, validate, and guard the educational lesson."""
        if plan is None:
            plan = classify_topic_fallback(topic, difficulty)

        topic_lower = topic.strip().lower()

        # Check if topic is Machine Learning
        if any(k in topic_lower for k in [
            "machine learning", "ml", "basics of machine learning", "learning algorithm", "supervised learning"
        ]):
            raw_lesson = build_machine_learning_curriculum(difficulty)
        else:
            raw_lesson = build_generic_academic_curriculum(topic, plan, difficulty)

        # Apply hard guard and validation
        return post_process_and_guard(raw_lesson, plan)
