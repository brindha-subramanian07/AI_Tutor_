from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


class TestCase(BaseModel):
    input: str = ""
    expected_output: str = ""
    description: Optional[str] = None


class CodeExecutionRequest(BaseModel):
    code: str = Field(..., min_length=1, description="Student code to execute safely")
    language: str = Field(default="python", description="Programming language (e.g. python, javascript)")
    test_cases: Optional[List[TestCase]] = Field(default_factory=list, description="Test cases to validate")


class TestCaseResult(BaseModel):
    test_number: int
    passed: bool
    input: str
    expected_output: str
    actual_output: str
    error: Optional[str] = None


class CodeExecutionResponse(BaseModel):
    passed: bool
    passed_tests: int
    failed_tests: int
    total_tests: int
    score: float
    stdout: str
    compilation_errors: Optional[str] = None
    runtime_errors: Optional[str] = None
    execution_time: float  # in seconds
    results: List[TestCaseResult] = Field(default_factory=list)
