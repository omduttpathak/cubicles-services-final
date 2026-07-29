from datetime import datetime

from pydantic import (
    BaseModel,
    ConfigDict,
    Field,
)


class TechnologyBase(BaseModel):
    name: str = Field(
        min_length=2,
        max_length=150,
    )

    slug: str = Field(
        min_length=2,
        max_length=150,
        pattern=r"^[a-z0-9]+(?:-[a-z0-9]+)*$",
    )

    category: str = Field(
        min_length=2,
        max_length=100,
    )

    icon: str = Field(
        min_length=1,
        max_length=100,
    )

    logo_url: str | None = Field(
        default=None,
        max_length=500,
    )

    description: str = Field(
        min_length=10,
    )

    display_order: int = Field(
        default=0,
        ge=0,
    )

    is_featured: bool = False
    is_active: bool = True

    seo_title: str = Field(
        min_length=3,
        max_length=255,
    )

    seo_description: str = Field(
        min_length=10,
        max_length=500,
    )


class TechnologyCreate(TechnologyBase):
    pass


class TechnologyUpdate(TechnologyBase):
    pass


class TechnologyListResponse(BaseModel):
    id: int
    name: str
    slug: str
    category: str
    icon: str
    logo_url: str | None
    description: str
    display_order: int
    is_featured: bool

    model_config = ConfigDict(
        from_attributes=True,
    )


class TechnologyDetailsResponse(
    TechnologyListResponse,
):
    seo_title: str
    seo_description: str


class AdminTechnologyResponse(
    TechnologyDetailsResponse,
):
    is_active: bool
    created_at: datetime
    updated_at: datetime
