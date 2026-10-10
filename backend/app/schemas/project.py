from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field, ConfigDict


class ProjectGenerateRequest(BaseModel):
    lesson_id: Optional[int] = None
    topic: str = Field(..., min_length=2, max_length=255)
    difficulty: Optional[str] = "Intermediate"


class PracticalProjectResponse(BaseModel):
    id: int
    topic: str
    title: str
    scenario: str
    problem_statement: str
    objective: Optional[str] = None
    requirements: List[str]
    expected_functionality: Optional[str] = None
    input_description: Optional[str] = None
    expected_output: Optional[str] = None
    constraints: Optional[str] = None
    evaluation_criteria: List[str]
    skills_tested: List[str]
    hints: List[str]
    starter_code: Optional[str] = None
    is_coding_project: bool = True

    model_config = ConfigDict(from_attributes=True)


class ProjectSubmitRequest(BaseModel):
    submitted_solution: str = Field(..., min_length=5, description="Code or solution text submitted by student")


class ProjectSubmitResponse(BaseModel):
    submission_id: int
    project_id: int
    score: float
    percentage: float
    feedback: str
    completed_requirements: List[str]
    missing_requirements: List[str]
    improvement_suggestions: List[str]
    evaluation_details: Dict[str, Any]
