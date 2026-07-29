from pydantic import (
    BaseModel,
    ConfigDict,
    Field,
)


class ServicesPageBase(BaseModel):
    hero_badge: str = Field(
        min_length=2,
        max_length=255,
    )

    hero_title: str = Field(
        min_length=3,
        max_length=500,
    )

    hero_highlight: str = Field(
        min_length=2,
        max_length=255,
    )

    hero_description: str = Field(
        min_length=10,
        max_length=1000,
    )

    primary_button_text: str = Field(
        min_length=2,
        max_length=100,
    )

    primary_button_url: str = Field(
        min_length=1,
        max_length=500,
    )

    secondary_button_text: str = Field(
        min_length=2,
        max_length=100,
    )

    secondary_button_url: str = Field(
        min_length=1,
        max_length=500,
    )

    hero_feature_one: str = Field(
        min_length=2,
        max_length=150,
    )

    hero_feature_two: str = Field(
        min_length=2,
        max_length=150,
    )

    hero_feature_three: str = Field(
        min_length=2,
        max_length=150,
    )

    hero_feature_four: str = Field(
        min_length=2,
        max_length=150,
    )

    services_eyebrow: str = Field(
        min_length=2,
        max_length=255,
    )

    services_title: str = Field(
        min_length=3,
        max_length=500,
    )

    services_description: str = Field(
        min_length=10,
        max_length=1000,
    )

    services_empty_title: str = Field(
        min_length=3,
        max_length=255,
    )

    services_empty_description: str = Field(
        min_length=5,
        max_length=500,
    )

    service_button_text: str = Field(
        min_length=2,
        max_length=100,
    )

    benefits_badge: str = Field(
        min_length=2,
        max_length=255,
    )

    benefits_title: str = Field(
        min_length=3,
        max_length=500,
    )

    benefits_description: str = Field(
        min_length=10,
        max_length=1000,
    )

    process_eyebrow: str = Field(
        min_length=2,
        max_length=255,
    )

    process_title: str = Field(
        min_length=3,
        max_length=500,
    )

    process_description: str = Field(
        min_length=10,
        max_length=1000,
    )

    industries_eyebrow: str = Field(
        min_length=2,
        max_length=255,
    )

    industries_title: str = Field(
        min_length=3,
        max_length=500,
    )

    industries_description: str = Field(
        min_length=10,
        max_length=1000,
    )

    cta_title: str = Field(
        min_length=3,
        max_length=500,
    )

    cta_description: str = Field(
        min_length=10,
        max_length=1000,
    )

    cta_primary_button_text: str = Field(
        min_length=2,
        max_length=100,
    )

    cta_primary_button_url: str = Field(
        min_length=1,
        max_length=500,
    )

    cta_secondary_button_text: str = Field(
        min_length=2,
        max_length=100,
    )

    cta_secondary_button_url: str = Field(
        min_length=1,
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
    show_services: bool = True
    show_benefits: bool = True
    show_process: bool = True
    show_stats: bool = True
    show_industries: bool = True
    show_cta: bool = True
    is_active: bool = True


class ServicesPageUpdate(ServicesPageBase):
    pass


class ServicesPageResponse(ServicesPageBase):
    id: int

    model_config = ConfigDict(
        from_attributes=True,
    )
