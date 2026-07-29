from typing import Literal

from pydantic import (
    BaseModel,
    ConfigDict,
    Field,
    field_validator,
)

HomepageSection = Literal[
    "hero",
    "services",
    "technologies",
    "benefits",
    "industries",
    "case_studies",
    "testimonials",
    "stats",
    "faq",
    "cta",
]

DEFAULT_SECTION_ORDER: list[HomepageSection] = [
    "hero",
    "services",
    "technologies",
    "benefits",
    "industries",
    "case_studies",
    "testimonials",
    "stats",
    "faq",
    "cta",
]


class HomepageBase(BaseModel):
    hero_badge: str = Field(
        min_length=3,
        max_length=255,
    )

    hero_title: str = Field(
        min_length=10,
    )

    hero_description: str = Field(
        min_length=20,
    )

    primary_button_text: str = Field(
        min_length=2,
        max_length=100,
    )

    primary_button_url: str = Field(
        min_length=1,
        max_length=255,
    )

    secondary_button_text: str = Field(
        min_length=2,
        max_length=100,
    )

    secondary_button_url: str = Field(
        min_length=1,
        max_length=255,
    )

    cta_title: str = Field(
        min_length=10,
    )

    cta_description: str = Field(
        min_length=20,
    )

    cta_button_text: str = Field(
        min_length=2,
        max_length=100,
    )

    cta_button_url: str = Field(
        min_length=1,
        max_length=255,
    )

    seo_title: str = Field(
        min_length=10,
        max_length=255,
    )

    seo_description: str = Field(
        min_length=20,
    )

    is_active: bool = True

    show_hero: bool = True

    services_title: str = Field(
        min_length=3,
        max_length=255,
    )

    services_description: str = Field(
        min_length=10,
        max_length=500,
    )

    show_services: bool = True

    technologies_title: str = Field(
        min_length=3,
        max_length=255,
    )

    technologies_description: str = Field(
        min_length=10,
        max_length=500,
    )

    show_technologies: bool = True

    benefits_title: str = Field(
        min_length=3,
        max_length=255,
    )

    benefits_description: str = Field(
        min_length=10,
        max_length=500,
    )

    show_benefits: bool = True

    industries_title: str = Field(
        min_length=3,
        max_length=255,
    )

    industries_description: str = Field(
        min_length=10,
        max_length=500,
    )

    show_industries: bool = True

    case_studies_title: str = Field(
        min_length=3,
        max_length=255,
    )

    case_studies_description: str = Field(
        min_length=10,
        max_length=500,
    )

    show_case_studies: bool = True

    testimonials_title: str = Field(
        min_length=3,
        max_length=255,
    )

    testimonials_description: str = Field(
        min_length=10,
        max_length=500,
    )

    show_testimonials: bool = True

    stats_title: str = Field(
        min_length=3,
        max_length=255,
    )

    stats_description: str = Field(
        min_length=10,
        max_length=500,
    )

    show_stats: bool = True

    faq_title: str = Field(
        min_length=3,
        max_length=255,
    )

    faq_description: str = Field(
        min_length=10,
        max_length=500,
    )

    show_faq: bool = True
    show_cta: bool = True

    section_order: list[HomepageSection] = Field(
        default_factory=lambda: DEFAULT_SECTION_ORDER.copy(),
        min_length=10,
        max_length=10,
    )

    @field_validator("section_order")
    @classmethod
    def validate_section_order(
        cls,
        value: list[HomepageSection],
    ) -> list[HomepageSection]:
        if len(set(value)) != len(value):
            raise ValueError(
                "Homepage section order cannot contain duplicate sections.",
            )

        if set(value) != set(DEFAULT_SECTION_ORDER):
            raise ValueError(
                "Homepage section order must contain every supported section exactly once.",
            )

        return value


class HomepageUpdate(HomepageBase):
    pass


class HomepageResponse(HomepageBase):
    id: int

    model_config = ConfigDict(
        from_attributes=True,
    )
