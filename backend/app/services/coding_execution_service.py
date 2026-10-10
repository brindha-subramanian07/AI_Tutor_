import ast
import os
import shutil
import subprocess
import sys
import tempfile
import time
from typing import Any, Dict, List, Optional
from app.core.config import settings


class CodeExecutionError(Exception):
    pass


class DangerousCodeError(Exception):
    pass


FORBIDDEN_MODULES = {
    "os",
    "subprocess",
    "shutil",
    "socket",
    "http",
    "urllib",
    "requests",
    "httpx",
    "multiprocessing",
    "threading",
    "ctypes",
    "signal",
    "pty",
    "fcntl",
    "resource",
}

FORBIDDEN_CALLS = {
    "eval",
    "exec",
    "compile",
    "open",
    "__import__",
    "globals",
    "locals",
}


def sanitize_and_validate_python_ast(code: str) -> None:
    """Performs static Abstract Syntax Tree (AST) analysis on Python code
    to disallow dangerous operations (system calls, network, filesystem) before execution.
    """
    try:
        tree = ast.parse(code)
    except SyntaxError as e:
        raise DangerousCodeError(f"Syntax error in code: {e}")

    for node in ast.walk(tree):
        # Disallow forbidden import statements
        if isinstance(node, ast.Import):
            for alias in node.names:
                root_module = alias.name.split(".")[0]
                if root_module in FORBIDDEN_MODULES:
                    raise DangerousCodeError(f"Forbidden module import: '{alias.name}' is not allowed in sandbox.")
        elif isinstance(node, ast.ImportFrom):
            if node.module:
                root_module = node.module.split(".")[0]
                if root_module in FORBIDDEN_MODULES:
                    raise DangerousCodeError(f"Forbidden import from module: '{node.module}' is not allowed in sandbox.")

        # Disallow dangerous built-in calls like open, eval, exec
        elif isinstance(node, ast.Call):
            if isinstance(node.func, ast.Name) and node.func.id in FORBIDDEN_CALLS:
                raise DangerousCodeError(f"Forbidden function call: '{node.func.id}()' is not permitted.")


class CodingExecutionService:
    """Safe, isolated code execution engine for Python test runner.
    Ensures:
    1. Static AST sanitization
    2. Subprocess execution in an isolated temporary directory
    3. Host environment variable stripping (no backend secrets exposed)
    4. Execution timeout handling
    5. Clean teardown and disk purging
    """

    @classmethod
    def execute_python_code(
        cls,
        code: str,
        test_cases: Optional[List[Dict[str, Any]]] = None,
        timeout_seconds: Optional[int] = None,
    ) -> Dict[str, Any]:
        timeout = timeout_seconds or settings.CODE_EXECUTION_TIMEOUT
        test_cases = test_cases or []

        start_time = time.time()

        # Step 1: Static AST validation
        try:
            sanitize_and_validate_python_ast(code)
        except DangerousCodeError as d_err:
            return {
                "passed": False,
                "passed_tests": 0,
                "failed_tests": max(len(test_cases), 1),
                "total_tests": len(test_cases),
                "score": 0.0,
                "stdout": "",
                "compilation_errors": str(d_err),
                "runtime_errors": None,
                "execution_time": round(time.time() - start_time, 4),
                "results": [],
            }

        # Step 2: Create isolated temp directory
        temp_dir = tempfile.mkdtemp(prefix="aitutor_sandbox_")
        try:
            # Prepare clean environment with NO backend secrets
            isolated_env = {
                "PATH": os.environ.get("PATH", ""),
                "PYTHONPATH": "",
                "SYSTEMROOT": os.environ.get("SYSTEMROOT", "C:\\Windows"),
                "PYTHONIOENCODING": "utf-8",
                "PYTHONDONTWRITEBYTECODE": "1",
            }

            # If no test cases are specified, execute the standalone script
            if not test_cases:
                script_path = os.path.join(temp_dir, "solution.py")
                with open(script_path, "w", encoding="utf-8") as f:
                    f.write(code)

                try:
                    proc = subprocess.run(
                        [sys.executable, "-I", "-S", script_path],  # -I: isolated mode, -S: don't import site
                        cwd=temp_dir,
                        env=isolated_env,
                        capture_output=True,
                        text=True,
                        timeout=timeout,
                    )
                    exec_time = round(time.time() - start_time, 4)

                    if proc.returncode != 0:
                        return {
                            "passed": False,
                            "passed_tests": 0,
                            "failed_tests": 1,
                            "total_tests": 1,
                            "score": 0.0,
                            "stdout": proc.stdout,
                            "compilation_errors": None,
                            "runtime_errors": proc.stderr.strip() or f"Process exited with status {proc.returncode}",
                            "execution_time": exec_time,
                            "results": [],
                        }

                    return {
                        "passed": True,
                        "passed_tests": 1,
                        "failed_tests": 0,
                        "total_tests": 1,
                        "score": 100.0,
                        "stdout": proc.stdout,
                        "compilation_errors": None,
                        "runtime_errors": None,
                        "execution_time": exec_time,
                        "results": [],
                    }
                except subprocess.TimeoutExpired:
                    return {
                        "passed": False,
                        "passed_tests": 0,
                        "failed_tests": 1,
                        "total_tests": 1,
                        "score": 0.0,
                        "stdout": "",
                        "compilation_errors": None,
                        "runtime_errors": f"Execution timed out after {timeout} seconds. Infinite loop detected.",
                        "execution_time": float(timeout),
                        "results": [],
                    }

            # Step 3: Run against multiple test cases
            test_results = []
            passed_count = 0
            all_stdout = []

            for idx, tc in enumerate(test_cases, 1):
                tc_input = str(tc.get("input", ""))
                expected_output = str(tc.get("expected_output", "")).strip()

                script_path = os.path.join(temp_dir, f"test_runner_{idx}.py")
                with open(script_path, "w", encoding="utf-8") as f:
                    f.write(code)

                try:
                    proc = subprocess.run(
                        [sys.executable, "-I", "-S", script_path],
                        cwd=temp_dir,
                        env=isolated_env,
                        input=tc_input,
                        capture_output=True,
                        text=True,
                        timeout=timeout,
                    )
                    actual_stdout = proc.stdout.strip()
                    all_stdout.append(f"Test {idx} output: {actual_stdout}")

                    if proc.returncode != 0:
                        test_results.append({
                            "test_number": idx,
                            "passed": False,
                            "input": tc_input,
                            "expected_output": expected_output,
                            "actual_output": proc.stdout,
                            "error": proc.stderr.strip() or f"Exited with code {proc.returncode}",
                        })
                    else:
                        is_match = (actual_stdout == expected_output) or (expected_output in actual_stdout)
                        if is_match:
                            passed_count += 1
                        test_results.append({
                            "test_number": idx,
                            "passed": is_match,
                            "input": tc_input,
                            "expected_output": expected_output,
                            "actual_output": actual_stdout,
                            "error": None if is_match else "Output mismatch",
                        })

                except subprocess.TimeoutExpired:
                    test_results.append({
                        "test_number": idx,
                        "passed": False,
                        "input": tc_input,
                        "expected_output": expected_output,
                        "actual_output": "",
                        "error": f"Execution timed out ({timeout}s).",
                    })

            total_tests = len(test_cases)
            failed_count = total_tests - passed_count
            score = round((passed_count / total_tests) * 100, 2) if total_tests > 0 else 0.0

            return {
                "passed": passed_count == total_tests,
                "passed_tests": passed_count,
                "failed_tests": failed_count,
                "total_tests": total_tests,
                "score": score,
                "stdout": "\n".join(all_stdout),
                "compilation_errors": None,
                "runtime_errors": None if passed_count == total_tests else "Some tests failed or mismatched output.",
                "execution_time": round(time.time() - start_time, 4),
                "results": test_results,
            }

        finally:
            # Ephemeral cleanup: Remove the sandbox directory completely
            try:
                shutil.rmtree(temp_dir, ignore_errors=True)
            except Exception:
                pass
