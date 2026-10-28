from typing import Any, Dict, List, Literal, Optional, Union
from pydantic import BaseModel, Field, ConfigDict

SceneType = Literal["concept", "diagram", "code", "example", "quiz", "summary"]

# Fixed Visual Component Registry
GENERIC_COMPONENTS: List[str] = [
    "Timeline",
    "ComparisonTable",
    "FlowDiagram",
    "BarChart",
    "FormulaView",
    "QuizCard",
    "SafeFallbackVisual",
]

ML_COMPONENTS: List[str] = [
    "ml_spam_classifier",
    "ml_train_test_split",
    "ml_evaluation_metrics",
    "ml_paradigm_shift",
    "ml_workflow_pipeline",
    "ml_paradigms_matrix",
    "ml_worked_example",
    "ml_summary_checklist",
]

ALL_ALLOWED_COMPONENTS: List[str] = GENERIC_COMPONENTS + ML_COMPONENTS


class SceneCode(BaseModel):
    language: str = Field(description="Programming or query language (e.g. 'python', 'javascript', 'sql')")
    snippet: str = Field(description="Executable or illustrative code snippet")
    explanation: Optional[str] = Field(default=None, description="Pedagogical explanation of what this code illustrates")


class SceneVisual(BaseModel):
    component: str = Field(description="Visual component name from the allowed registry")
    data: Dict[str, Any] = Field(default_factory=dict, description="Structured visual data payload")


# Lean models for Gemini response_schema (avoids additionalProperties OpenAPI errors in Gemini Developer API)
class LeanVisual(BaseModel):
    component: str = Field(description="Visual component name chosen from allowed component list")
    data_json: str = Field(description="Valid JSON-serialized string representing visual data dictionary")


class LeanScene(BaseModel):
    id: int
    scene_type: SceneType
    title: str
    subtitle: Optional[str] = None
    narration: str
    visual: LeanVisual
    code: Optional[SceneCode] = None
    visualNotes: List[str] = Field(default_factory=list)
    key_takeaway: Optional[str] = None


class TopicPlan(BaseModel):
    domain: str = Field(description="Domain category (e.g., 'Biology', 'Law', 'Databases', 'Web Development', 'Machine Learning')")
    code_relevant: bool = Field(description="True ONLY if the topic is specifically about software/coding/programming")
    code_language: str = Field(description="The programming language if code_relevant is True (e.g., 'python', 'javascript', 'sql'), or 'none' if False")
    allowed_components: List[str] = Field(description="List of allowed visual.component names for this domain")
    scene_plan: List[SceneType] = Field(description="Ordered list of 5-8 scene types representing the pedagogical progression")
    pedagogical_focus: str = Field(description="Brief educational focus or rationale")

    @property
    def is_programming_topic(self) -> bool:
        return self.code_relevant


class KeyConcept(BaseModel):
    term: str
    definition: str


class CodeExample(BaseModel):
    title: str
    lang: str = "none"
    code: str


class PracticalTask(BaseModel):
    title: str
    instructions: str
    starterCode: Optional[str] = None
    expectedOutput: Optional[str] = None
    solution: Optional[str] = None
    is_coding: bool = False


class LeanLessonGeneration(BaseModel):
    title: str
    category: str
    difficulty: str
    duration: str
    summary: str
    code_relevant: bool
    code_language: str
    learning_objectives: List[str] = Field(default_factory=list)
    prerequisites: List[str] = Field(default_factory=list)
    slides: List[LeanScene]
    keyConcepts: List[KeyConcept] = Field(default_factory=list)
    codeExamples: Optional[List[CodeExample]] = None
    practicalTask: Optional[Dict[str, Any]] = None


class SceneVisualData(BaseModel):
    diagram_id: str
    visual_type: str
    interactive_elements: Optional[List[Dict[str, Any]]] = None
    labels: Optional[List[str]] = None
    annotations: Optional[List[str]] = None
    metadata: Optional[Dict[str, Any]] = None


class LessonScene(BaseModel):
    id: int
    scene_type: SceneType = "concept"
    title: str
    subtitle: Optional[str] = None
    learning_objective: Optional[str] = None
    narration: str
    visual: SceneVisual
    code: Optional[Union[SceneCode, str, Dict[str, Any]]] = None
    visualNotes: List[str] = Field(default_factory=list)
    estimated_duration_sec: int = 20
    transition: Optional[str] = None
    key_takeaway: Optional[str] = None

    # Backward-compatible fields
    diagram: Optional[str] = None
    visual_type: Optional[str] = None
    visual_data: Optional[Dict[str, Any]] = None

    model_config = ConfigDict(extra="allow")


class LessonContent(BaseModel):
    title: str
    category: str
    difficulty: str
    duration: str
    summary: str
    code_relevant: bool = False
    code_language: str = "none"
    learning_objectives: List[str] = Field(default_factory=list)
    prerequisites: List[str] = Field(default_factory=list)
    slides: List[Dict[str, Any]]
    keyConcepts: List[Dict[str, str]]
    codeExamples: Optional[List[Dict[str, Any]]] = None
    practicalTask: Optional[Dict[str, Any]] = None
    knowledgeChecks: Optional[List[Dict[str, Any]]] = None

    @property
    def is_coding_topic(self) -> bool:
        return self.code_relevant


class LessonCreateRequest(BaseModel):
    topic: str = Field(..., min_length=2, max_length=255, description="Academic or programming topic name")
    category: Optional[str] = "AI Synthesized Course"
    difficulty: Optional[str] = "Beginner"
    force_regenerate: Optional[bool] = False


class LessonResponse(BaseModel):
    id: int
    lesson_slug: str
    topic: str
    title: str
    category: str
    difficulty: str
    duration: str
    summary: Optional[str] = None
    content: Dict[str, Any]

    model_config = ConfigDict(from_attributes=True)
