from fastapi import APIRouter, HTTPException, status
from app.schemas.code import CodeExecutionRequest, CodeExecutionResponse
from app.services.coding_execution_service import CodingExecutionService

router = APIRouter(prefix="/code", tags=["Safe Code Execution"])


@router.post("/execute", response_model=CodeExecutionResponse)
def execute_code_in_sandbox(payload: CodeExecutionRequest):
    """Executes student code within an isolated, sandboxed execution environment.
    Guarantees:
    - No host filesystem access
    - Stripped environment secrets
    - AST dangerous construct filtering
    - Ephemeral cleanup
    """
    test_cases_dicts = [tc.model_dump() for tc in payload.test_cases] if payload.test_cases else []
    result = CodingExecutionService.execute_python_code(
        code=payload.code,
        test_cases=test_cases_dicts,
    )
    return result
