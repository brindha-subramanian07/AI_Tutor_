import re
from typing import Any, Dict, List, Tuple
from app.models.question import Question
from app.services.coding_execution_service import CodingExecutionService
from app.services.gemini_service import GeminiService


WEAK_COLORS = ['#F43F5E', '#F59E0B', '#8B5CF6', '#EF4444', '#EC4899', '#F97316', '#06B6D4', '#6366F1']
STRONG_COLORS = ['#10B981', '#2563EB', '#059669', '#3B82F6', '#14B8A6']


def normalize_fill_blank(answer: str) -> str:
    """Normalizes string answers by stripping whitespace, punctuation, and lowercase."""
    if not answer:
        return ""
    # Remove outer spaces and multiple spaces
    cleaned = re.sub(r"\s+", " ", str(answer).strip().lower())
    # Strip common enclosing quotes
    cleaned = cleaned.strip("\"'`;")
    return cleaned


class EvaluationService:
    """Comprehensive evaluation engine for MCQs, True/False, Fill in the Blanks, and Coding problems."""

    @classmethod
    def evaluate_answer(cls, question: Question, student_answer: Any) -> Tuple[bool, float, str]:
        """Evaluates a single question and returns (is_correct, marks_obtained, feedback)."""
        q_type = question.question_type.lower()
        full_marks = float(question.marks or 1)

        if student_answer is None or str(student_answer).strip() == "":
            return False, 0.0, "No answer was provided."

        if q_type == "mcq":
            # Student answer may be int index (0, 1, 2) or string ("0", "Option text")
            std_str = str(student_answer).strip()
            corr_str = str(question.correct_answer).strip()

            is_correct = False
            # Check direct match (e.g. index 0 == 0)
            if std_str == corr_str:
                is_correct = True
            elif question.options:
                # Check option text match
                try:
                    corr_idx = int(corr_str)
                    if 0 <= corr_idx < len(question.options):
                        expected_opt_text = question.options[corr_idx]
                        if std_str.lower() == expected_opt_text.lower():
                            is_correct = True
                except ValueError:
                    pass

            marks = full_marks if is_correct else 0.0
            feedback = question.explanation if is_correct else f"Incorrect. Correct answer was Option {chr(65 + int(corr_str)) if corr_str.isdigit() else corr_str}. {question.explanation}"
            return is_correct, marks, feedback

        elif q_type in ["true_false", "truefalse"]:
            std_val = str(student_answer).strip().lower()
            corr_val = str(question.correct_answer).strip().lower()

            # Map to boolean strings
            std_bool = "true" if std_val in ["0", "true", "t", "yes", "1"] else "false"
            corr_bool = "true" if corr_val in ["0", "true", "t", "yes", "1"] else "false"

            is_correct = (std_bool == corr_bool)
            marks = full_marks if is_correct else 0.0
            feedback = question.explanation
            return is_correct, marks, feedback

        elif q_type in ["fill_blank", "fill_in_the_blank", "fillblank"]:
            normalized_std = normalize_fill_blank(str(student_answer))
            normalized_corr = normalize_fill_blank(str(question.correct_answer))

            # Direct match or substring variation match
            is_correct = (normalized_std == normalized_corr)
            if not is_correct and normalized_corr in normalized_std:
                is_correct = True

            marks = full_marks if is_correct else 0.0
            feedback = question.explanation if is_correct else f"Expected '{question.correct_answer}'. {question.explanation}"
            return is_correct, marks, feedback

        elif q_type in ["coding", "code"]:
            # Evaluate using isolated sandbox runner
            code_text = str(student_answer)
            coding_details = question.coding_details or {}
            test_cases = coding_details.get("test_cases", [])

            exec_result = CodingExecutionService.execute_python_code(code_text, test_cases)
            is_correct = exec_result.get("passed", False)
            pct = exec_result.get("score", 0.0) / 100.0
            marks = round(full_marks * pct, 2)

            if is_correct:
                feedback = f"All {exec_result.get('total_tests', 0)} tests passed! Sandbox execution time: {exec_result.get('execution_time')}s."
            else:
                feedback = f"Tests passed: {exec_result.get('passed_tests', 0)}/{exec_result.get('total_tests', 0)}. {exec_result.get('runtime_errors') or exec_result.get('compilation_errors') or 'Some test cases failed.'}"

            return is_correct, marks, feedback

        else:
            # Fallback exact match
            is_correct = (str(student_answer).strip().lower() == str(question.correct_answer).strip().lower())
            marks = full_marks if is_correct else 0.0
            return is_correct, marks, question.explanation

    @classmethod
    def evaluate_quiz_submission(
        cls,
        questions: List[Question],
        submitted_answers: Dict[Any, Any],
        topic_title: str,
    ) -> Dict[str, Any]:
        """Evaluates complete quiz submission, analyzes concepts, builds pie chart slices,
        and generates personalized recommendations.
        """
        total_questions = len(questions)
        correct_count = 0
        incorrect_count = 0
        partial_count = 0
        not_attempted_count = 0
        total_possible_marks = 0.0
        total_obtained_marks = 0.0

        details = []
        concept_stats: Dict[str, Dict[str, Any]] = {}

        for idx, q in enumerate(questions):
            full_marks = float(q.marks or 1)
            total_possible_marks += full_marks

            # Find answer by question.id or string key or index
            ans = submitted_answers.get(q.id)
            if ans is None:
                ans = submitted_answers.get(str(q.id))
            if ans is None and idx in submitted_answers:
                ans = submitted_answers[idx]
            if ans is None and str(idx) in submitted_answers:
                ans = submitted_answers[str(idx)]

            if ans is None:
                not_attempted_count += 1

            is_correct, marks_obtained, feedback = cls.evaluate_answer(q, ans)
            total_obtained_marks += marks_obtained

            if is_correct:
                correct_count += 1
            elif marks_obtained > 0:
                partial_count += 1
            else:
                incorrect_count += 1

            subtopic = q.related_concept or f"{topic_title} Concept {idx + 1}"

            if subtopic not in concept_stats:
                concept_stats[subtopic] = {
                    "name": subtopic,
                    "total": 0,
                    "correct": 0,
                    "incorrect": 0,
                    "partial": 0,
                    "total_marks": 0.0,
                    "obtained_marks": 0.0,
                    "questionDetails": [],
                }

            concept_stats[subtopic]["total"] += 1
            concept_stats[subtopic]["total_marks"] += full_marks
            concept_stats[subtopic]["obtained_marks"] += marks_obtained
            if is_correct:
                concept_stats[subtopic]["correct"] += 1
            elif marks_obtained > 0:
                concept_stats[subtopic]["partial"] += 1
            else:
                concept_stats[subtopic]["incorrect"] += 1

            # Format correctAnswer safely for response
            corr_ans_display = q.correct_answer
            try:
                corr_ans_display = int(q.correct_answer)
            except (ValueError, TypeError):
                pass

            std_ans_display = ans
            try:
                std_ans_display = int(ans)
            except (ValueError, TypeError):
                pass

            detail_item = {
                "questionId": q.id,
                "question": q.question_text,
                "question_type": q.question_type,
                "options": q.options or [],
                "studentAnswer": std_ans_display,
                "correctAnswer": corr_ans_display,
                "isCorrect": is_correct,
                "marksObtained": marks_obtained,
                "explanation": q.explanation,
                "subtopic": subtopic,
            }
            details.append(detail_item)
            concept_stats[subtopic]["questionDetails"].append(detail_item)

        score_percentage = round((total_obtained_marks / total_possible_marks) * 100, 1) if total_possible_marks > 0 else 0.0
        total_missed = incorrect_count + partial_count

        weak_subtopics = []
        strengths_subtopics = []
        weak_concepts = []
        strong_concepts = []
        needs_practice = []
        concept_analysis = []

        weak_color_idx = 0
        strong_color_idx = 0

        for sub_name, stat in concept_stats.items():
            perf = round((stat["obtained_marks"] / stat["total_marks"]) * 100, 1) if stat["total_marks"] > 0 else 0.0
            concept_analysis.append({
                "concept": sub_name,
                "performance": perf,
            })

            if stat["incorrect"] > 0 or stat["partial"] > 0:
                gap_weight = round(((stat["incorrect"] + stat["partial"]) / total_missed) * 100) if total_missed > 0 else 0
                weak_subtopics.append({
                    "id": f"weak-{weak_color_idx}",
                    "name": sub_name,
                    "missedCount": stat["incorrect"] + stat["partial"],
                    "totalQuestions": stat["total"],
                    "gapWeight": gap_weight,
                    "color": WEAK_COLORS[weak_color_idx % len(WEAK_COLORS)],
                    "severity": "Critical Gap" if stat["incorrect"] >= 2 else "Needs Review",
                    "recommendation": f"Revise {sub_name} fundamental rules and review the AI lecture.",
                })
                weak_concepts.append(sub_name)
                weak_color_idx += 1
            else:
                strong_concepts.append(sub_name)

            if stat["correct"] > 0:
                strengths_subtopics.append({
                    "id": f"strong-{strong_color_idx}",
                    "name": sub_name,
                    "correctCount": stat["correct"],
                    "totalQuestions": stat["total"],
                    "accuracy": round((stat["correct"] / stat["total"]) * 100),
                    "color": STRONG_COLORS[strong_color_idx % len(STRONG_COLORS)],
                    "status": "Strong",
                })
                strong_color_idx += 1

            if 40 <= perf < 75:
                needs_practice.append(sub_name)

        # If 100% score (0 weak topics), populate mastery wheel items
        if not weak_subtopics:
            if not strengths_subtopics:
                strengths_subtopics = [
                    {"id": "strong-0", "name": f"{topic_title} Core Mechanics", "correctCount": total_questions, "totalQuestions": total_questions, "accuracy": 100, "color": "#10B981", "status": "Strong"},
                    {"id": "strong-1", "name": "Conceptual Invariants", "correctCount": total_questions, "totalQuestions": total_questions, "accuracy": 100, "color": "#2563EB", "status": "Strong"},
                    {"id": "strong-2", "name": "Rapid Problem Solving", "correctCount": total_questions, "totalQuestions": total_questions, "accuracy": 100, "color": "#059669", "status": "Strong"},
                ]

        # Generate recommendations based on actual weak and strong concepts
        recommendations = GeminiService.generate_recommendations(weak_concepts, strong_concepts, topic_title)

        return {
            "score": score_percentage,
            "percentage": score_percentage,
            "correctCount": correct_count,
            "incorrectCount": incorrect_count,
            "partialCount": partial_count,
            "notAttemptedCount": not_attempted_count,
            "correct_count": correct_count,
            "incorrect_count": incorrect_count,
            "partial_count": partial_count,
            "not_attempted_count": not_attempted_count,
            "totalQuestions": total_questions,
            "total_questions": total_questions,
            "accuracy": score_percentage,
            "details": details,
            "weakSubtopics": weak_subtopics,
            "strengthsSubtopics": strengths_subtopics,
            "weakTopics": weak_concepts,
            "strengths": strong_concepts,
            "needsPractice": needs_practice,
            "conceptAnalysis": concept_analysis,
            "concept_analysis": concept_analysis,
            "nextRecommendations": recommendations,
        }
