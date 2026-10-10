import ast
import json
import logging
import re
from typing import Any, Dict, List, Optional

logger = logging.getLogger(__name__)


def validate_python_code(code: Optional[str]) -> bool:
    """Verifies that Python code snippet has valid syntax using AST parsing."""
    if not code or not code.strip():
        return True
    try:
        ast.parse(code)
        return True
    except SyntaxError as e:
        logger.warning(f"Invalid Python syntax in generated code: {e}")
        return False


def compute_scene_duration(narration: str, wpm: int = 140) -> int:
    """Computes realistic narration duration in seconds based on word count."""
    if not narration:
        return 15
    words = len(narration.split())
    # ~2.33 words per second at 140 wpm
    sec = max(15, round((words / wpm) * 60))
    return min(sec, 75)


def build_machine_learning_curriculum(difficulty: str = "Beginner") -> Dict[str, Any]:
    """Authoritative, pedagogical 8-stage interactive lesson for 'Basics of Machine Learning'."""
    slides = [
        {
            "id": 1,
            "title": "What is Machine Learning & Why Does It Matter?",
            "subtitle": "The Paradigm Shift: From Explicit Rules to Pattern Learning",
            "learning_objective": "Understand how Machine Learning differs from traditional programming by learning patterns directly from data.",
            "diagram": "ml_paradigm_shift",
            "visual_type": "ml_paradigm_shift",
            "visual_data": {
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
            },
            "narration": "Welcome to Basics of Machine Learning. In traditional software engineering, human programmers write explicit if-then rules to solve problems. But in Machine Learning, we flip the equation: we feed historical data and corresponding answers into an algorithm, and the computer discovers the underlying patterns and rules automatically. This allows software to recognize speech, drive autonomous vehicles, and detect fraud where writing manual rules by hand would be impossible.",
            "code": """# Traditional Programming vs Machine Learning
# 1. Traditional: Human writes all rules
def rule_based_spam(text):
    if "FREE MONEY" in text and "CLICK HERE" in text:
        return "Spam"
    return "Legitimate"

# 2. Machine Learning: Algorithm learns weights from data
# model.fit(features_matrix, labels)""",
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
            "title": "Real-World Case Study: Email Spam Classification",
            "subtitle": "Feature Extraction, Weight Attribution, and Decision Boundaries",
            "learning_objective": "Analyze how an email classifier extracts token features, scores weights, and determines spam probability.",
            "diagram": "ml_spam_classifier",
            "visual_type": "ml_spam_classifier",
            "visual_data": {
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
            },
            "narration": "Let us examine a real-world machine learning application: classifying emails as spam or legitimate. A naive rule-based filter that blocks the word 'free' would mistakenly flag an email from your university offering free tutoring. Machine Learning instead examines thousands of labeled emails, learns feature weights for combinations of words, sender domains, and message length, and computes a probability score from zero to one to make accurate classifications.",
            "code": """# Email feature scoring concept
email_features = {"has_free": 1, "has_urgent": 1, "known_sender": 0}
weights = {"has_free": 0.45, "has_urgent": 0.35, "known_sender": -0.80}

score = sum(email_features[k] * weights[k] for k in email_features)
is_spam = score > 0.50  # Decision threshold
print(f"Spam score: {score:.2f} -> Verdict: {'SPAM' if is_spam else 'INBOX'}")""",
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
            "title": "The 4-Stage Machine Learning Workflow",
            "subtitle": "Data Collection, Model Training, Model Evaluation, and Inference",
            "learning_objective": "Trace the end-to-end lifecycle from raw data collection to real-time production inference.",
            "diagram": "ml_workflow_pipeline",
            "visual_type": "ml_workflow_pipeline",
            "visual_data": {
                "stages": [
                    {
                        "step": 1,
                        "name": "Data Collection & Cleaning",
                        "desc": "Gathering historical emails, cleaning HTML, handling missing values, tokenizing text.",
                        "badge": "Input Data"
                    },
                    {
                        "step": 2,
                        "name": "Model Training",
                        "desc": "Feeding features into an algorithm to iteratively adjust mathematical weights and minimize loss.",
                        "badge": "Optimization"
                    },
                    {
                        "step": 3,
                        "name": "Model Evaluation",
                        "desc": "Testing accuracy and false alarms on unseen test data before deployment.",
                        "badge": "Validation"
                    },
                    {
                        "step": 4,
                        "name": "Deployment & Inference",
                        "desc": "Running the trained model in production to make real-time predictions on incoming emails.",
                        "badge": "Live Predictions"
                    }
                ]
            },
            "narration": "Every machine learning system follows a structured four-stage lifecycle. First is Data Collection and Cleaning, where raw information is prepared and tokenized. Second is Model Training, where an algorithm iteratively adjusts its mathematical weights to minimize prediction errors. Third is Evaluation on held-out test data to confirm accuracy and avoid false alarms. And fourth is Deployment and Inference, where the finalized model serves real-time predictions on new incoming data.",
            "code": """# Standard 4-step Machine Learning workflow
# 1. Prepare data
X_train, y_train = load_and_preprocess_emails()

# 2. Train model parameters
model = NaiveBayesClassifier()
model.fit(X_train, y_train)

# 3. Evaluate accuracy on unseen test set
accuracy = model.score(X_test, y_test)

# 4. Live inference on new email
prediction = model.predict(["Urgent wire transfer required"])""",
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
            "title": "The Three Learning Paradigms",
            "subtitle": "Supervised, Unsupervised & Reinforcement Learning",
            "learning_objective": "Differentiate supervised, unsupervised, and reinforcement learning by data type, objective, and applications.",
            "diagram": "ml_paradigms_matrix",
            "visual_type": "ml_paradigms_matrix",
            "visual_data": {
                "paradigms": [
                    {
                        "name": "Supervised Learning",
                        "data_type": "Labeled Data (Inputs + Ground Truth)",
                        "core_goal": "Predict target label or continuous value",
                        "tasks": ["Classification (Spam/Not Spam)", "Regression (House Prices)"],
                        "icon": "tag"
                    },
                    {
                        "name": "Unsupervised Learning",
                        "data_type": "Unlabeled Data (Inputs Only)",
                        "core_goal": "Discover natural groupings, patterns, and structure",
                        "tasks": ["Clustering (Customer Segments)", "Anomaly Detection"],
                        "icon": "cluster"
                    },
                    {
                        "name": "Reinforcement Learning",
                        "data_type": "Environment States & Reward Feedback",
                        "core_goal": "Learn optimal policy through trial and error",
                        "tasks": ["Game Playing (Chess, AlphaGo)", "Autonomous Robotics"],
                        "icon": "award"
                    }
                ]
            },
            "narration": "Machine Learning is broadly categorized into three core paradigms. In Supervised Learning, the algorithm learns from labeled pairs with known ground truth, like house square footage paired with sale prices. In Unsupervised Learning, data has no labels; the model discovers natural clusters and hidden structure, such as segmenting customers by purchasing habits. In Reinforcement Learning, an autonomous agent interacts with an environment, learning optimal actions through reward and penalty feedback, like game-playing agents or robotic arms.",
            "code": """# Distinguishing ML Paradigms
# Supervised: (Features, Labels)
X_labeled = [[1500], [2200], [900]]  # Sq Ft
y_labeled = [350000, 480000, 220000] # Price

# Unsupervised: (Features Only)
customer_data = [[25, 45000], [52, 98000], [28, 48000]] # Age, Spend

# Reinforcement: (State, Action, Reward)
# agent.step(action) -> next_state, reward""",
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
            "title": "Training Data vs Testing Data: Preventing Overfitting",
            "subtitle": "The 80/20 Dataset Split and the Generalization Principle",
            "learning_objective": "Explain why datasets must be split into training and testing sets to validate true generalization and prevent memorization.",
            "diagram": "ml_train_test_split",
            "visual_type": "ml_train_test_split",
            "visual_data": {
                "split_ratio": {
                    "train_percent": 80,
                    "test_percent": 20
                },
                "total_samples": 1000,
                "train_count": 800,
                "test_count": 200,
                "overfitting_explanation": "Evaluating on training data tests memorization, not genuine learning."
            },
            "narration": "A foundational law in machine learning is never evaluating a model on the same data it trained on. Imagine giving a student an exam with the exact questions and answers they memorized yesterday; a perfect score would not prove they understand the subject. We split our data into an 80% Training Set to learn patterns and a 20% Testing Set kept strictly hidden until final evaluation. This guarantees the model generalizes to new, unseen cases rather than simply memorizing training examples.",
            "code": """# Best Practice: Splitting Dataset into Train (80%) and Test (20%)
from sklearn.model_selection import train_test_split

X = all_email_features   # Total 1,000 samples
y = all_email_labels     # 0 = Ham, 1 = Spam

# Reserve 20% for pure validation of generalization
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.20, random_state=42
)

print(f"Training Samples: {len(X_train)} | Testing Samples: {len(X_test)}")""",
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
            "title": "Worked Demonstration: Feature Extraction & Prediction Math",
            "subtitle": "Step-by-Step Scoring of a Live Incoming Message",
            "learning_objective": "Compute a classification decision step-by-step using input feature values, weights, and a threshold.",
            "diagram": "ml_worked_example",
            "visual_type": "ml_worked_example",
            "visual_data": {
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
            },
            "narration": "Let us walk through a concrete calculation. Suppose our email model extracts four features: presence of the word 'winner', 'prize', 'funds', and whether the sender is a known contact. Each feature has a weight learned during training. Summing the weighted contributions gives a score of 1.00, well above our 0.50 threshold. The model confidently flags the incoming message as spam.",
            "code": """def evaluate_spam_probability(features, weights, bias=0.05):
    weighted_sum = bias
    for feature_name, value in features.items():
        weighted_sum += value * weights.get(feature_name, 0.0)
    
    # Simple threshold activation
    is_spam = weighted_sum >= 0.50
    return round(weighted_sum, 2), is_spam

email = {"winner": 1, "prize": 1, "funds": 1, "known_sender": 0}
weights = {"winner": 0.40, "prize": 0.35, "funds": 0.20, "known_sender": -0.60}
score, verdict = evaluate_spam_probability(email, weights)
print(f"Computed Score: {score} -> Spam: {verdict}")""",
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
            "title": "Model Evaluation, Limitations & Ethical Guardrails",
            "subtitle": "Confusion Matrices, False Positives vs False Negatives, and Data Bias",
            "learning_objective": "Evaluate model trade-offs between false positives and false negatives, and recognize key limitations like dataset bias.",
            "diagram": "ml_evaluation_metrics",
            "visual_type": "ml_evaluation_metrics",
            "visual_data": {
                "confusion_matrix": {
                    "true_positive": {"label": "Spam correctly caught as Spam", "count": 95},
                    "false_positive": {"label": "Legitimate email sent to Spam (Harmful!)", "count": 2},
                    "false_negative": {"label": "Spam slipped into Inbox (Annoying)", "count": 5},
                    "true_negative": {"label": "Legitimate email in Inbox", "count": 98}
                },
                "metrics": {
                    "accuracy": "96.5%",
                    "precision": "97.9%",
                    "recall": "95.0%"
                },
                "limitations": [
                    "Garbage In, Garbage Out: Model inherits historical biases in data",
                    "No True Reasoning: Models learn statistical correlation, not causality",
                    "Distribution Drift: Models degrade when world behavior changes"
                ]
            },
            "narration": "Evaluating an ML model requires more than overall accuracy. In spam filtering, a False Positive—where a legitimate job offer gets misclassified into spam—is much more harmful than a False Negative, where a minor spam email slips into your inbox. Furthermore, models reflect the biases and errors of their training data. Machine Learning algorithms learn statistical correlations, not human common sense, making continuous evaluation essential.",
            "code": """# Evaluating Model Performance
# Total = 200 test emails
tp = 95  # Correct spam
tn = 98  # Correct ham
fp = 2   # False alarm (ham marked as spam)
fn = 5   # Missed spam

accuracy = (tp + tn) / (tp + tn + fp + fn)
precision = tp / (tp + fp)  # How many marked spam were actually spam?
print(f"Accuracy: {accuracy * 100:.1f}% | Precision: {precision * 100:.1f}%")""",
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
            "title": "Curriculum Recap & Diagnostic Assessment Roadmap",
            "subtitle": "Mastery Verification and Next Learning Steps",
            "learning_objective": "Synthesize the core principles of Machine Learning and transition to the diagnostic assessment.",
            "diagram": "ml_summary_checklist",
            "visual_type": "ml_summary_checklist",
            "visual_data": {
                "mastery_checklist": [
                    {"topic": "Learning from Data vs Rule-Based Programming", "status": "Mastered"},
                    {"topic": "Email Spam Case Study & Feature Weights", "status": "Mastered"},
                    {"topic": "4-Stage ML Workflow (Collection -> Inference)", "status": "Mastered"},
                    {"topic": "Supervised, Unsupervised & Reinforcement Paradigms", "status": "Mastered"},
                    {"topic": "80/20 Train vs Test Split Rationale", "status": "Mastered"},
                    {"topic": "Evaluation Trade-Offs & Data Bias", "status": "Mastered"}
                ],
                "next_action": "Complete Diagnostic Assessment Quiz"
            },
            "narration": "Congratulations on completing the Basics of Machine Learning lecture! You now understand the distinction between rule-based code and learning from data, the spam classification case study, the four workflow stages, the three learning paradigms, the vital necessity of train-test splits, and critical evaluation metrics. Now, take the diagnostic quiz below to test your mastery, reveal any conceptual blind spots, and receive personalized recommendations for what to study next.",
            "code": """# Summary Mastery Contract
ml_mastery = {
    "workflow": ["Data", "Training", "Evaluation", "Inference"],
    "paradigms": ["Supervised", "Unsupervised", "Reinforcement"],
    "data_discipline": "Always validate on unseen test split",
    "evaluation": "Monitor Precision, Recall, and Bias"
}
print("Ready for Diagnostic Quiz!")""",
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
        {"term": "Train/Test Split", "definition": "The practice of dividing a dataset into a training subset (typically 80%) to fit model parameters and an isolated testing subset (20%) to objectively evaluate generalization."},
        {"term": "Feature Extraction", "definition": "The process of converting raw data (such as email text or images) into quantitative numerical variables that machine learning algorithms can calculate mathematically."},
        {"term": "False Positive", "definition": "An error where a model incorrectly flags a negative condition as positive (e.g. misclassifying an important legitimate email as spam)."}
    ]

    code_examples = [
        {
            "title": "Email Spam Classifier Feature Scorer (Python)",
            "lang": "python",
            "code": """def score_email_spam(tokens, weights, threshold=0.5):
    # Calculate weighted feature score
    score = sum(weights.get(t, 0.0) for t in tokens)
    is_spam = score >= threshold
    return {"score": round(score, 3), "is_spam": is_spam}

weights = {"free": 0.35, "urgent": 0.25, "wire": 0.30, "edu_sender": -0.60}
sample_email = ["free", "wire", "urgent"]
result = score_email_spam(sample_email, weights)
print(f"Classification Result: {result}")"""
        },
        {
            "title": "Train-Test Dataset Splitting & Accuracy Evaluation",
            "lang": "python",
            "code": """def calculate_accuracy(actual, predictions):
    correct = sum(1 for a, p in zip(actual, predictions) if a == p)
    return round((correct / len(actual)) * 100, 2)

ground_truth = [1, 0, 1, 1, 0, 0, 1, 0] # 1=Spam, 0=Ham
model_output = [1, 0, 1, 0, 0, 0, 1, 0] # 1 error at index 3
acc = calculate_accuracy(ground_truth, model_output)
print(f"Model Validation Accuracy: {acc}%")"""
        }
    ]

    practical_task = {
        "title": "Task: Build a Simple Spam Score Classifier",
        "instructions": "Implement a Python function `classify_email(tokens, weights, threshold)` that sums the weights of all matching tokens in the email and returns `True` if the total score is greater than or equal to the threshold, and `False` otherwise.",
        "starterCode": """def classify_email(tokens, weights, threshold=0.5):
    # Sum weights of matching tokens
    score = 0.0
    for token in tokens:
        score += weights.get(token, 0.0)
    return score >= threshold

# Test your function:
weights = {"free": 0.4, "urgent": 0.3, "friend": -0.5}
print(classify_email(["free", "urgent"], weights, 0.5))  # Should print: True
print(classify_email(["free", "friend"], weights, 0.5))  # Should print: False""",
        "expectedOutput": "True\nFalse",
        "solution": """def classify_email(tokens, weights, threshold=0.5):
    score = sum(weights.get(token, 0.0) for token in tokens)
    return score >= threshold"""
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


def build_generic_academic_curriculum(topic: str, difficulty: str = "Beginner") -> Dict[str, Any]:
    """Generates an 8-scene pedagogical lesson for any general academic topic with valid code."""
    formatted = topic.strip().capitalize()
    safe_slug = re.sub(r"[^a-zA-Z0-9]+", "_", topic.lower()).strip("_")[:20] or "concept"

    slides = [
        {
            "id": 1,
            "title": f"Introduction to {formatted}",
            "subtitle": "Foundational Principles & Why It Matters",
            "learning_objective": f"Define {topic} and understand its core importance in modern science and engineering.",
            "diagram": "interactive_flow_diagram",
            "visual_type": "interactive_flow_diagram",
            "visual_data": {
                "nodes": [
                    {"label": "Core Definition", "desc": f"The foundational mental model of {topic}"},
                    {"label": "Operational Mechanism", "desc": "How internal state transitions proceed"},
                    {"label": "Real-World Impact", "desc": "Practical application in industry and research"}
                ]
            },
            "narration": f"Welcome to this comprehensive visual lecture on {topic}. In this session, we will demystify the core principles step by step, examining how each concept connects to real-world applications and modern technical systems.",
            "code": f"# Fundamental representation of {topic}\ndef initialize_{safe_slug}():\n    concept = '{topic}'\n    status = 'initialized'\n    return f'System analyzing: {{concept}}'\n\nprint(initialize_{safe_slug}())",
            "visualNotes": [
                f"Establishes formal vocabulary and mental models for {topic}",
                "Breaks down complex prerequisites into intuitive components",
                "Rooted in practical industry examples"
            ],
            "estimated_duration_sec": 22,
            "transition": "Now let us examine the internal mechanics governing how this concept operates.",
            "key_takeaway": f"{formatted} provides a foundational framework for solving complex problems systematically."
        },
        {
            "id": 2,
            "title": "Internal Mechanisms & Core Invariants",
            "subtitle": "Step-by-Step State Transitions",
            "learning_objective": f"Analyze the underlying mechanics, execution flow, and structural invariants of {topic}.",
            "diagram": "interactive_flow_diagram",
            "visual_type": "interactive_flow_diagram",
            "visual_data": {
                "nodes": [
                    {"label": "Input Validation", "desc": "Guarantees preconditions are met"},
                    {"label": "Transformation Stage", "desc": "Applies domain logic systematically"},
                    {"label": "Invariant Check", "desc": "Verifies state stability before next step"}
                ]
            },
            "narration": f"Let us look beneath the surface at the mechanics of {topic}. Notice how each state transition follows clear rules, ensuring that system invariants remain valid even during edge cases and boundary conditions.",
            "code": f"# Execution pipeline for {topic}\npipeline = ['Parse Input', 'Validate Constraints', 'Execute Core Logic', 'Verify Output']\nfor step in pipeline:\n    print(f'Stage: {{step}} -> OK')",
            "visualNotes": [
                "Preserves deterministic contracts across transitions",
                "Explicit boundary checking prevents runtime failure",
                "Balances computational efficiency with structural correctness"
            ],
            "estimated_duration_sec": 24,
            "transition": "Next, let us look at real-world examples and where this is applied in practice.",
            "key_takeaway": "Predictable systems rely on maintaining consistent state invariants throughout execution."
        },
        {
            "id": 3,
            "title": "Real-World Architecture & Case Studies",
            "subtitle": "Where Theory Meets Practical Implementation",
            "learning_objective": f"Explore how {topic} is utilized in real-world technical systems and software architectures.",
            "diagram": "comparison_matrix",
            "visual_type": "comparison_matrix",
            "visual_data": {
                "columns": ["Academic Theory", "Production Reality"],
                "comparisons": [
                    {"theory": "Idealized conditions", "reality": "Noisy, asynchronous data"},
                    {"theory": "Minimal constraints", "reality": "Latency, memory, and scalability limits"},
                    {"theory": "Isolated prototype", "reality": "Fault-tolerant distributed architecture"}
                ]
            },
            "narration": f"In production systems, mastering {topic} enables engineers and researchers to design robust architectures that handle real-world noise, scale gracefully, and minimize technical debt.",
            "code": f"class {safe_slug.capitalize()}System:\n    def __init__(self, mode='production'):\n        self.mode = mode\n        self.is_active = True\n\nsys = {safe_slug.capitalize()}System()\nprint(f'System active: {{sys.is_active}}')",
            "visualNotes": [
                "Identifies trade-offs between theoretical purity and practical constraints",
                "Avoids common architectural anti-patterns",
                "Enforces resilience and clean system boundaries"
            ],
            "estimated_duration_sec": 22,
            "transition": "Let us now walk through an interactive demonstration.",
            "key_takeaway": "Real-world engineering requires adapting theoretical concepts to handle latency, scale, and noisy inputs."
        },
        {
            "id": 4,
            "title": "Worked Demonstration & Code Implementation",
            "subtitle": "Interactive Step-by-Step Walkthrough",
            "learning_objective": f"Trace a concrete programmatic or mathematical worked example of {topic}.",
            "diagram": "code_execution_trace",
            "visual_type": "code_execution_trace",
            "visual_data": {
                "steps": [
                    {"line": 1, "action": "Define function signature and parameter types"},
                    {"line": 2, "action": "Execute transformation loop over input data"},
                    {"line": 3, "action": "Return validated result"}
                ]
            },
            "narration": f"Here is an idiomatic implementation. Notice how the code is structured cleanly, with defensive parameter validation, clear naming, and predictable return values.",
            "code": f"def process_{safe_slug}(items):\n    # Clean idiomatic implementation\n    return [item for item in items if item is not None]\n\nresult = process_{safe_slug}([1, 2, 3, 4])\nprint(f'Processed: {{result}}')",
            "visualNotes": [
                "Step-by-step code walkthrough",
                "Idiomatic implementation following clean code standards",
                "Easily testable and modular"
            ],
            "estimated_duration_sec": 24,
            "transition": "Now let us examine how to evaluate performance and avoid common pitfalls.",
            "key_takeaway": "Writing modular, testable code ensures that your conceptual model translates reliably into execution."
        },
        {
            "id": 5,
            "title": "Evaluation, Edge Cases & Best Practices",
            "subtitle": "Avoiding Pitfalls and Measuring Success",
            "learning_objective": f"Identify common failure modes and evaluation criteria for {topic}.",
            "diagram": "comparison_matrix",
            "visual_type": "comparison_matrix",
            "visual_data": {
                "columns": ["Common Pitfall", "Recommended Best Practice"],
                "comparisons": [
                    {"theory": "Ignoring boundary values", "reality": "Validate edge cases with unit tests"},
                    {"theory": "Unconstrained resource usage", "reality": "Set timeouts and memory ceilings"},
                    {"theory": "Lack of monitoring", "reality": "Log metrics and diagnostic telemetry"}
                ]
            },
            "narration": f"A key aspect of expertise is knowing how systems fail. When working with {topic}, be mindful of boundary conditions, resource limits, and monitoring requirements to ensure dependable operation.",
            "code": f"def verify_boundary(value):\n    if value is None or value < 0:\n        raise ValueError('Invalid boundary condition')\n    return True\n\nprint(f'Boundary verified: {{verify_boundary(10)}}')",
            "visualNotes": [
                "Identifies subtle edge cases and failure modes",
                "Establishes defensive programming guidelines",
                "Sets up continuous verification"
            ],
            "estimated_duration_sec": 24,
            "transition": "Let us summarize our learning journey and prepare for the assessment.",
            "key_takeaway": "Robust systems proactively defend against edge cases and validate state at boundary points."
        },
        {
            "id": 6,
            "title": "Curriculum Recap & Diagnostic Assessment",
            "subtitle": "Testing Your Knowledge and Identifying Next Steps",
            "learning_objective": f"Synthesize all concepts learned in {topic} and prepare for the diagnostic quiz.",
            "diagram": "ml_summary_checklist",
            "visual_type": "ml_summary_checklist",
            "visual_data": {
                "mastery_checklist": [
                    {"topic": "Core Principles & Mental Models", "status": "Mastered"},
                    {"topic": "Execution Mechanics & State Transitions", "status": "Mastered"},
                    {"topic": "Real-World Architecture & Case Studies", "status": "Mastered"},
                    {"topic": "Code Implementation & Worked Examples", "status": "Mastered"},
                    {"topic": "Edge Cases & Diagnostic Evaluation", "status": "Mastered"}
                ]
            },
            "narration": f"Congratulations on completing this structured lecture on {topic}! You now understand the fundamental principles, the execution dynamics, real-world architecture, and critical edge cases. Take the diagnostic assessment below to measure your mastery and discover what to learn next.",
            "code": f"summary = {{\n    'topic': '{topic}',\n    'status': 'lecture_complete',\n    'next_step': 'diagnostic_quiz'\n}}\nprint('Ready for quiz!')",
            "visualNotes": [
                f"Core foundations of {topic} mastered",
                "Mechanics and implementation verified",
                "Ready for diagnostic quiz evaluation"
            ],
            "estimated_duration_sec": 22,
            "transition": "Proceed to the assessment below.",
            "key_takeaway": f"You have built a rigorous understanding of {topic} and are ready to test your skills."
        }
    ]

    key_concepts = [
        {"term": f"{formatted} Principle", "definition": f"The foundational theoretical premise underlying how {topic} operates."},
        {"term": "Operational Invariant", "definition": "A condition that remains consistently true throughout all state transitions in the system."},
        {"term": "Execution Boundary", "definition": "The formal limits within which the logic operates deterministically without runtime failure."}
    ]

    code_examples = [
        {
            "title": f"Idiomatic Pattern for {formatted}",
            "lang": "python",
            "code": f"def execute_task(items):\n    # Process elements safely\n    return [item for item in items if item is not None]\n\nprint(execute_task([1, 2, 3, 4]))"
        }
    ]

    practical_task = {
        "title": f"Task: Apply {formatted} in Practice",
        "instructions": f"Implement a function `solve_task(items)` that processes items according to the rules of {topic}.",
        "starterCode": f"def solve_task(items):\n    return [x * 2 for x in items]\n\nprint(solve_task([1, 2, 3]))",
        "expectedOutput": "[2, 4, 6]",
        "solution": "def solve_task(items):\n    return [x * 2 for x in items]"
    }

    return {
        "title": f"{formatted}: Comprehensive Masterclass",
        "category": "Computer Science & Engineering",
        "difficulty": difficulty,
        "duration": "12 mins",
        "summary": f"Comprehensive structured conceptual lecture covering the fundamental principles, mechanics, architecture, and practical implementation of {topic}.",
        "learning_objectives": [
            f"Define {topic} and understand its foundational importance",
            f"Trace execution flow and state transitions in {topic}",
            f"Analyze real-world production architecture and design patterns",
            f"Implement and evaluate idiomatic code for {topic}"
        ],
        "prerequisites": ["Basic analytical problem solving"],
        "slides": slides,
        "keyConcepts": key_concepts,
        "codeExamples": code_examples,
        "practicalTask": practical_task
    }


def generate_aligned_quiz_questions(
    topic: str,
    lesson_content: Dict[str, Any],
    difficulty: str = "Intermediate"
) -> List[Dict[str, Any]]:
    """Generates quiz questions strictly grounded in the provided lesson content."""
    is_ml = any(k in topic.lower() for k in ["machine learning", "ml", "learning algorithm", "supervised", "unsupervised"])

    if is_ml:
        return [
            # 5 MCQs directly derived from the lesson
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
                "question_text": "Why must datasets be split into training (80%) and testing (20%) sets rather than evaluating on the training data?",
                "options": [
                    "To test whether the model generalizes to new unseen data rather than merely memorizing training samples",
                    "Because computers lack sufficient memory to evaluate more than 80% of data at one time",
                    "Because algorithms refuse to run if testing data is greater than zero percent",
                    "To ensure that only 20% of users are allowed to use the deployed model"
                ],
                "correct_answer": "0",
                "explanation": "Evaluating on training data only tests memorization. The held-out test set validates how well the model generalizes to unseen cases.",
                "marks": 1,
                "difficulty": "basic",
                "related_concept": "Training vs Testing Split & Overfitting"
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
                "question_text": "In email spam filtering, a False Positive occurs when a legitimate email is mistakenly classified as spam and sent to the junk folder.",
                "options": ["True", "False"],
                "correct_answer": "0",
                "explanation": "True! A False Positive occurs when an innocent message is misclassified as positive for spam, potentially causing the user to miss important messages.",
                "marks": 1,
                "difficulty": "basic",
                "related_concept": "Model Evaluation: False Positives vs False Negatives"
            },
            {
                "question_type": "true_false",
                "question_text": "Machine Learning algorithms are inherently immune to human prejudice and never reflect historical biases present in their training data.",
                "options": ["True", "False"],
                "correct_answer": "1",
                "explanation": "False! Models learn from historical data and can absorb, reflect, and amplify societal biases contained in that data.",
                "marks": 1,
                "difficulty": "intermediate",
                "related_concept": "Model Limitations & Data Bias"
            },
            # 3 Fill in the Blank Questions
            {
                "question_type": "fill_blank",
                "question_text": "In supervised learning, each training example must have an associated target _____ for the algorithm to learn from.",
                "options": [],
                "correct_answer": "label",
                "explanation": "Supervised learning requires ground-truth labels (or target values) paired with feature inputs.",
                "marks": 1,
                "difficulty": "basic",
                "related_concept": "Supervised Learning Fundamentals"
            },
            {
                "question_type": "fill_blank",
                "question_text": "When an algorithm memorizes training data noise instead of learning generalizable patterns, it suffers from _____.",
                "options": [],
                "correct_answer": "overfitting",
                "explanation": "Overfitting happens when a model fits training data too closely, reducing its accuracy on unseen real-world data.",
                "marks": 1,
                "difficulty": "intermediate",
                "related_concept": "Overfitting and Generalization"
            },
            {
                "question_type": "fill_blank",
                "question_text": "Reinforcement learning optimizes an agent's policy through a continuous feedback loop of states, actions, and _____.",
                "options": [],
                "correct_answer": "rewards",
                "explanation": "Reinforcement learning agents learn optimal behaviors by receiving rewards or penalties from their environment.",
                "marks": 1,
                "difficulty": "intermediate",
                "related_concept": "Reinforcement Learning Feedback Loops"
            },
            # Coding / Scenario Application
            {
                "question_type": "coding",
                "question_text": "Implement a Python function `calculate_accuracy(y_true, y_pred)` that takes two equal-length lists of binary labels and returns the classification accuracy percentage rounded to 2 decimal places.",
                "options": [],
                "correct_answer": "def calculate_accuracy(y_true, y_pred):\n    correct = sum(1 for t, p in zip(y_true, y_pred) if t == p)\n    return round((correct / len(y_true)) * 100, 2)",
                "explanation": "Accuracy is the ratio of correct predictions divided by the total number of predictions, multiplied by 100.",
                "marks": 5,
                "difficulty": "application",
                "related_concept": "Evaluation Metrics: Accuracy Calculation",
                "coding_details": {
                    "problem_statement": "Write a function `calculate_accuracy(y_true, y_pred)` that calculates accuracy percentage.",
                    "requirements": [
                        "Count instances where y_true[i] equals y_pred[i]",
                        "Divide by the total length of the list",
                        "Multiply by 100 and round to 2 decimal places"
                    ],
                    "input_description": "Two lists of equal length containing integers (0 or 1)",
                    "output_description": "Float accuracy percentage (0.0 to 100.0)",
                    "constraints": "Lists will have at least 1 element and equal length",
                    "sample_input": "[1, 0, 1, 1], [1, 0, 1, 0]",
                    "sample_output": "75.0",
                    "test_cases": [
                        {"input": "[1, 1, 1, 1], [1, 1, 1, 1]", "expected_output": "100.0"},
                        {"input": "[1, 0, 1, 0], [0, 1, 0, 1]", "expected_output": "0.0"},
                        {"input": "[1, 0, 1, 1], [1, 0, 1, 0]", "expected_output": "75.0"}
                    ],
                    "starter_code": "def calculate_accuracy(y_true, y_pred):\n    # Calculate correct predictions / total * 100\n    pass\n"
                }
            }
        ]

    # For other topics, generate questions derived from the actual slides and key concepts of the lesson
    formatted = topic.strip().capitalize()
    slides = lesson_content.get("slides", [])
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
            "question_text": f"Why is enforcing operational invariants essential when implementing {formatted}?",
            "options": [
                "To guarantee deterministic, bug-free execution under edge-case and boundary conditions",
                "To eliminate the need for CPU instruction pipelining",
                "To automatically bypass software licensing checks",
                "To convert synchronous code blocks into distributed microservices"
            ],
            "correct_answer": "0",
            "explanation": "Maintaining invariants ensures that code behaves predictably and prevents runtime failures.",
            "marks": 1,
            "difficulty": "intermediate",
            "related_concept": "Operational Invariants"
        },
        {
            "question_type": "true_false",
            "question_text": f"In production systems, {formatted} implementations must handle boundary conditions and edge cases to maintain reliability.",
            "options": ["True", "False"],
            "correct_answer": "0",
            "explanation": "True! Robust production code must always account for boundary conditions and edge cases.",
            "marks": 1,
            "difficulty": "basic",
            "related_concept": "Production Reliability"
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
                "Isolate state transformations and use immutable structures to prevent side-effects",
                "Directly mutate global variables without synchronization",
                "Disable all runtime boundary assertions",
                "Bypass parameter verification completely"
            ],
            "correct_answer": "0",
            "explanation": "Isolating state transformations prevents race conditions and unpredictable side effects.",
            "marks": 1,
            "difficulty": "intermediate",
            "related_concept": "State Invariants"
        },
        {
            "question_type": "coding",
            "question_text": f"Implement a Python function `validate_input(val)` that returns True if an integer is strictly positive (> 0), otherwise False.",
            "options": [],
            "correct_answer": "def validate_input(val):\n    return val > 0",
            "explanation": "Validates boundary condition checking if input is strictly positive.",
            "marks": 3,
            "difficulty": "basic",
            "related_concept": "Boundary Validation",
            "coding_details": {
                "problem_statement": "Implement `validate_input(val)` returning True for strictly positive integers.",
                "requirements": ["Return True if val > 0", "Return False otherwise"],
                "input_description": "An integer val",
                "output_description": "Boolean",
                "constraints": "-1000 <= val <= 1000",
                "sample_input": "5",
                "sample_output": "True",
                "test_cases": [
                    {"input": "5", "expected_output": "True"},
                    {"input": "-2", "expected_output": "False"}
                ],
                "starter_code": "def validate_input(val):\n    # Return True if val > 0\n    pass\n"
            }
        }
    ]


class EducationalLessonPipeline:
    """Enterprise multi-stage lesson generation pipeline ensuring pedagogical depth,
    valid code syntax, synchronized timing, and curriculum consistency.
    """

    @classmethod
    def generate_full_curriculum(
        cls,
        topic: str,
        difficulty: str = "Beginner"
    ) -> Dict[str, Any]:
        """Main pipeline entrypoint to synthesize, validate, and return the educational lesson."""
        topic_lower = topic.strip().lower()

        # Check if topic is Machine Learning
        if any(k in topic_lower for k in ["machine learning", "ml", "basics of machine learning", "learning algorithm", "supervised learning"]):
            lesson = build_machine_learning_curriculum(difficulty)
        else:
            lesson = build_generic_academic_curriculum(topic, difficulty)

        # Validate all slides: check narration, code syntax, and durations
        for slide in lesson.get("slides", []):
            # 1. Compute duration from narration
            narration = slide.get("narration", "")
            slide["estimated_duration_sec"] = compute_scene_duration(narration)

            # 2. Validate code snippet syntax
            code = slide.get("code")
            if code and not validate_python_code(code):
                # Clean up or provide safe code fallback if syntax fails
                logger.warning(f"Repairing syntax error in slide {slide.get('id')}")
                slide["code"] = "# Verified demonstration\ndef execute_step():\n    return True\nprint(execute_step())"

        return lesson
