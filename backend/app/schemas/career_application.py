from datetime import datetime
from typing import Literal

from pydantic import (
    BaseModel,
    ConfigDict,
    EmailStr,
    Field,
)

CareerApplicationStatus = Literal[
    "new",
    "reviewing",
    "shortlisted",
    "rejected",
    "hired",
]


class CareerApplicationCreate(BaseModel):
    full_name: str = Field(
        min_length=2,
        max_length=150,
    )

    email: EmailStr

    phone: str | None = Field(
        default=None,
        max_length=30,
    )

    position: str = Field(
        min_length=2,
        max_length=150,
    )

    experience: str | None = Field(
        default=None,
        max_length=100,
    )

    current_company: str | None = Field(
        default=None,
        max_length=150,
    )

    location: str | None = Field(
        default=None,
        max_length=150,
    )

    linkedin_url: str | None = Field(
        default=None,
        max_length=500,
    )

    resume_url: str | None = Field(
        default=None,
        max_length=500,
    )

    cover_letter: str | None = Field(
        default=None,
        max_length=5000,
    )


class CareerApplicationStatusUpdate(BaseModel):
    status: CareerApplicationStatus


class CareerApplicationCreateResponse(BaseModel):
    message: str
    id: int


class AdminCareerApplicationResponse(BaseModel):
    id: int
    full_name: str
    email: str
    phone: str | None
    position: str
    experience: str | None
    current_company: str | None
    location: str | None
    linkedin_url: str | None
    resume_url: str | None
    cover_letter: str | None
    status: CareerApplicationStatus
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(
        from_attributes=True,
    )
