from pydantic import BaseModel, ConfigDict, Field


class TechnologyPageBase(BaseModel):
    hero_badge: str = Field(
        min_length=2,
        max_length=255,
    )

    hero_title: str = Field(
        min_length=3,
        max_length=500,
    )

    hero_description: str = Field(
        min_length=20,
        max_length=1000,
    )

    featured_eyebrow: str = Field(
        min_length=2,
        max_length=255,
    )

    featured_title: str = Field(
        min_length=3,
        max_length=500,
    )

    featured_description: str = Field(
        min_length=20,
        max_length=1000,
    )

    categories_eyebrow: str = Field(
        min_length=2,
        max_length=255,
    )

    categories_title: str = Field(
        min_length=3,
        max_length=500,
    )

    categories_description: str = Field(
        min_length=20,
        max_length=1000,
    )

    empty_title: str = Field(
        min_length=3,
        max_length=255,
    )

    empty_description: str = Field(
        min_length=10,
        max_length=500,
    )

    seo_title: str = Field(
        min_length=10,
        max_length=255,
    )

    seo_description: str = Field(
        min_length=20,
        max_length=500,
    )

    show_hero: bool = True
    show_featured: bool = True
    show_categories: bool = True
    is_active: bool = True


class TechnologyPageUpdate(TechnologyPageBase):
    pass


class TechnologyPageResponse(TechnologyPageBase):
    id: int

    model_config = ConfigDict(
        from_attributes=True,
    )
