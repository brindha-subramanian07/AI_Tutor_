from typing import Optional
from pydantic import BaseModel, EmailStr, Field, ConfigDict


class UserRegister(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=6, max_length=100)
    department: Optional[str] = "Artificial Intelligence & Data Science"
    semester: Optional[str] = "Semester 6"


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class GoogleAuthRequest(BaseModel):
    id_token: Optional[str] = None
    email: EmailStr
    name: str
    avatar: Optional[str] = None


class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    auth_provider: str
    avatar: Optional[str] = None
    department: str
    semester: str
    streak: int
    topics_completed: int
    quizzes_taken: int
    average_score: float

    model_config = ConfigDict(from_attributes=True)


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
