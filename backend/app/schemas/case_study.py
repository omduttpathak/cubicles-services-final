from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class CaseStudyCreate(BaseModel):
    title: str = Field(min_length=3, max_length=255)

    slug: str = Field(
        min_length=3,
        max_length=255,
        pattern=r"^[a-z0-9]+(?:-[a-z0-9]+)*$",
    )

    industry: str = Field(min_length=2, max_length=150)
    service: str = Field(min_length=2, max_length=150)
    summary: str = Field(min_length=10, max_length=500)
    challenge: str = Field(min_length=20)
    solution: str = Field(min_length=20)
    results: list[str] = Field(min_length=1)
    technologies: list[str] = Field(min_length=1)

    image_url: str | None = Field(
        default=None,
        max_length=500,
    )

    seo_title: str = Field(min_length=3, max_length=255)
    seo_description: str = Field(
        min_length=10,
        max_length=500,
    )

    is_published: bool = False
    published_at: datetime | None = None


class CaseStudyUpdate(BaseModel):
    title: str = Field(min_length=3, max_length=255)

    slug: str = Field(
        min_length=3,
        max_length=255,
        pattern=r"^[a-z0-9]+(?:-[a-z0-9]+)*$",
    )

    industry: str = Field(min_length=2, max_length=150)
    service: str = Field(min_length=2, max_length=150)
    summary: str = Field(min_length=10, max_length=500)
    challenge: str = Field(min_length=20)
    solution: str = Field(min_length=20)
    results: list[str] = Field(min_length=1)
    technologies: list[str] = Field(min_length=1)

    image_url: str | None = Field(
        default=None,
        max_length=500,
    )

    seo_title: str = Field(min_length=3, max_length=255)
    seo_description: str = Field(
        min_length=10,
        max_length=500,
    )


class CaseStudyListResponse(BaseModel):
    id: int
    title: str
    slug: str
    industry: str
    service: str
    summary: str
    results: list[str]
    technologies: list[str]
    image_url: str | None
    published_at: datetime

    model_config = ConfigDict(from_attributes=True)


class CaseStudyDetailsResponse(CaseStudyListResponse):
    challenge: str
    solution: str
    seo_title: str
    seo_description: str


class AdminCaseStudyResponse(CaseStudyDetailsResponse):
    is_published: bool
    created_at: datetime
    updated_at: datetime
