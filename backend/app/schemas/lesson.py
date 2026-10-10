from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field, ConfigDict


class SceneVisualData(BaseModel):
    diagram_id: str
    visual_type: str
    interactive_elements: Optional[List[Dict[str, Any]]] = None
    labels: Optional[List[str]] = None
    annotations: Optional[List[str]] = None
    metadata: Optional[Dict[str, Any]] = None


class LessonScene(BaseModel):
    id: int
    title: str
    subtitle: Optional[str] = None
    learning_objective: str
    diagram: str
    visual_type: str
    visual_data: Optional[Dict[str, Any]] = None
    narration: str
    code: Optional[str] = None
    visualNotes: List[str] = Field(default_factory=list)
    estimated_duration_sec: int = 20
    transition: Optional[str] = None
    key_takeaway: Optional[str] = None


class KeyConcept(BaseModel):
    term: str
    definition: str


class CodeExample(BaseModel):
    title: str
    lang: str = "python"
    code: str


class PracticalTask(BaseModel):
    title: str
    instructions: str
    starterCode: str
    expectedOutput: str
    solution: str


class LessonContent(BaseModel):
    title: str
    category: str
    difficulty: str
    duration: str
    summary: str
    learning_objectives: List[str] = Field(default_factory=list)
    prerequisites: List[str] = Field(default_factory=list)
    slides: List[Dict[str, Any]]
    keyConcepts: List[Dict[str, str]]
    codeExamples: List[Dict[str, Any]]
    practicalTask: Dict[str, Any]
    knowledgeChecks: Optional[List[Dict[str, Any]]] = None


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
