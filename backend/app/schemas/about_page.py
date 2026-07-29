from pydantic import (
    BaseModel,
    ConfigDict,
    Field,
)


class AboutPageBase(BaseModel):
    hero_badge: str = Field(
        min_length=2,
        max_length=255,
    )

    hero_title: str = Field(
        min_length=5,
        max_length=500,
    )

    hero_description: str = Field(
        min_length=10,
    )

    overview_eyebrow: str = Field(
        min_length=2,
        max_length=255,
    )

    overview_title: str = Field(
        min_length=5,
        max_length=500,
    )

    overview_description_one: str = Field(
        min_length=10,
    )

    overview_description_two: str = Field(
        min_length=10,
    )

    values_eyebrow: str = Field(
        min_length=2,
        max_length=255,
    )

    values_title: str = Field(
        min_length=5,
        max_length=500,
    )

    values_description: str = Field(
        min_length=10,
        max_length=500,
    )

    seo_title: str = Field(
        min_length=5,
        max_length=255,
    )

    seo_description: str = Field(
        min_length=10,
        max_length=500,
    )

    show_hero: bool = True
    show_overview: bool = True
    show_values: bool = True
    is_active: bool = True


class AboutPageUpdate(AboutPageBase):
    pass


class AboutPageResponse(AboutPageBase):
    id: int

    model_config = ConfigDict(
        from_attributes=True,
    )
