from datetime import datetime

from pydantic import (
    BaseModel,
    ConfigDict,
    Field,
)


class JobOpeningBase(BaseModel):
    title: str = Field(
        min_length=2,
        max_length=150,
    )

    slug: str = Field(
        min_length=2,
        max_length=180,
        pattern=r"^[a-z0-9]+(?:-[a-z0-9]+)*$",
    )

    location: str = Field(
        min_length=2,
        max_length=150,
    )

    employment_type: str = Field(
        min_length=2,
        max_length=100,
    )

    experience: str = Field(
        min_length=1,
        max_length=100,
    )

    short_description: str = Field(
        min_length=10,
        max_length=1000,
    )

    description: str | None = None

    responsibilities: list[str] = Field(
        default_factory=list,
    )

    requirements: list[str] = Field(
        default_factory=list,
    )

    skills: list[str] = Field(
        default_factory=list,
    )

    display_order: int = Field(
        default=0,
        ge=0,
    )

    is_active: bool = True


class JobOpeningCreate(JobOpeningBase):
    pass


class JobOpeningUpdate(JobOpeningBase):
    pass


class PublicJobOpeningResponse(BaseModel):
    id: int
    title: str
    slug: str
    location: str
    employment_type: str
    experience: str
    short_description: str
    description: str | None
    responsibilities: list[str]
    requirements: list[str]
    skills: list[str]

    model_config = ConfigDict(
        from_attributes=True,
    )


class AdminJobOpeningResponse(JobOpeningBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(
        from_attributes=True,
    )

class JobOpeningOrderUpdate(BaseModel):
    job_ids: list[int] = Field(
        min_length=1,
    )
