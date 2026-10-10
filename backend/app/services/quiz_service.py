from datetime import datetime, timezone
from typing import Any, Dict, List, Optional
from sqlalchemy.orm import Session
from app.models.quiz import Quiz
from app.models.question import Question
from app.models.attempt import QuizAttempt, QuizAnswer
from app.models.assessment import AssessmentResult
from app.models.lesson import Lesson
from app.models.user import User
from app.models.progress import LearningProgress
from app.services.gemini_service import GeminiService
from app.services.evaluation_service import EvaluationService


class QuizService:
    @classmethod
    def create_or_generate_quiz(
        cls,
        db: Session,
        topic: str,
        user_id: Optional[int] = None,
        lesson_id: Optional[int] = None,
        difficulty: str = "Intermediate",
    ) -> Quiz:
        """Generates a complete assessment with Gemini and persists quiz and questions in the database."""
        lesson_content = None
        if lesson_id:
            lesson = db.query(Lesson).filter(Lesson.id == lesson_id).first()
            if lesson:
                lesson_content = lesson.content

        # Generate question bank using Gemini AI
        raw_questions = GeminiService.generate_quiz_questions(topic, lesson_content, difficulty)

        new_quiz = Quiz(
            lesson_id=lesson_id,
            user_id=user_id,
            topic=topic,
            difficulty=difficulty,
            created_at=datetime.now(timezone.utc),
        )
        db.add(new_quiz)
        db.flush()

        for q_data in raw_questions:
            q_model = Question(
                quiz_id=new_quiz.id,
                question_type=q_data.get("question_type", "mcq"),
                question_text=q_data.get("question_text", ""),
                options=q_data.get("options", []),
                correct_answer=str(q_data.get("correct_answer", "")),
                explanation=q_data.get("explanation", ""),
                marks=int(q_data.get("marks", 1)),
                difficulty=q_data.get("difficulty", "intermediate"),
                related_concept=q_data.get("related_concept", f"{topic} Core"),
                coding_details=q_data.get("coding_details"),
            )
            db.add(q_model)

        db.commit()
        db.refresh(new_quiz)
        return new_quiz

    @classmethod
    def submit_and_evaluate_quiz(
        cls,
        db: Session,
        quiz: Quiz,
        user: User,
        answers: Dict[Any, Any],
    ) -> Dict[str, Any]:
        """Evaluates quiz submission, stores answers, assessment results, and updates learning progress."""
        eval_result = EvaluationService.evaluate_quiz_submission(
            questions=quiz.questions,
            submitted_answers=answers,
            topic_title=quiz.topic,
        )

        now = datetime.now(timezone.utc)

        # Store QuizAttempt
        attempt = QuizAttempt(
            user_id=user.id,
            quiz_id=quiz.id,
            start_time=now,
            submission_time=now,
            score=eval_result["score"],
            total_marks=float(len(quiz.questions)),
            percentage=eval_result["percentage"],
            status="completed",
        )
        db.add(attempt)
        db.flush()

        # Store individual QuizAnswer records
        for d in eval_result["details"]:
            ans_record = QuizAnswer(
                attempt_id=attempt.id,
                question_id=int(d["questionId"]),
                student_answer=str(d["studentAnswer"]),
                is_correct=d["isCorrect"],
                marks_obtained=d["marksObtained"],
                feedback=d["explanation"],
            )
            db.add(ans_record)

        # Store AssessmentResult
        assessment = AssessmentResult(
            attempt_id=attempt.id,
            user_id=user.id,
            overall_score=eval_result["score"],
            percentage=eval_result["percentage"],
            total_questions=eval_result["totalQuestions"],
            correct_count=eval_result["correctCount"],
            incorrect_count=eval_result["incorrectCount"],
            partial_count=eval_result["partialCount"],
            not_attempted_count=eval_result["notAttemptedCount"],
            strong_concepts=eval_result["strengths"],
            weak_concepts=eval_result["weakTopics"],
            needs_practice_concepts=eval_result["needsPractice"],
            weak_subtopics=eval_result["weakSubtopics"],
            strengths_subtopics=eval_result["strengthsSubtopics"],
            concept_analysis=eval_result["conceptAnalysis"],
            next_recommendations=eval_result["nextRecommendations"],
            created_at=now,
        )
        db.add(assessment)

        # Update User statistics
        user.quizzes_taken += 1
        user.streak += 1
        if user.average_score <= 0:
            user.average_score = eval_result["percentage"]
        else:
            user.average_score = round((user.average_score * (user.quizzes_taken - 1) + eval_result["percentage"]) / user.quizzes_taken, 1)

        # Update or create LearningProgress
        prog = db.query(LearningProgress).filter(
            LearningProgress.user_id == user.id,
            LearningProgress.topic == quiz.topic,
        ).first()

        if not prog:
            prog = LearningProgress(
                user_id=user.id,
                topic=quiz.topic,
                mastery_score=eval_result["percentage"],
                attempts_count=1,
                strong_areas=eval_result["strengths"],
                weak_areas=eval_result["weakTopics"],
                last_studied_at=now,
            )
            db.add(prog)
        else:
            prog.mastery_score = max(prog.mastery_score, eval_result["percentage"])
            prog.attempts_count += 1
            prog.strong_areas = eval_result["strengths"]
            prog.weak_areas = eval_result["weakTopics"]
            prog.last_studied_at = now

        db.commit()

        eval_result["attempt_id"] = attempt.id
        eval_result["submittedAt"] = now.strftime("%I:%M %p")
        return eval_result
