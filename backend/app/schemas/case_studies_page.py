from pydantic import (
    BaseModel,
    ConfigDict,
    Field,
)


class CaseStudiesPageBase(BaseModel):
    hero_eyebrow: str = Field(
        min_length=2,
        max_length=255,
    )

    hero_title: str = Field(
        min_length=3,
        max_length=500,
    )

    hero_description: str = Field(
        min_length=10,
        max_length=1000,
    )

    search_placeholder: str = Field(
        min_length=2,
        max_length=255,
    )

    all_industries_label: str = Field(
        min_length=2,
        max_length=150,
    )

    clear_filters_text: str = Field(
        min_length=2,
        max_length=150,
    )

    empty_title: str = Field(
        min_length=3,
        max_length=255,
    )

    empty_description: str = Field(
        min_length=5,
        max_length=500,
    )

    filtered_empty_description: str = Field(
        min_length=5,
        max_length=500,
    )

    results_heading: str = Field(
        min_length=2,
        max_length=150,
    )

    view_button_text: str = Field(
        min_length=2,
        max_length=150,
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
    show_filters: bool = True
    show_case_studies: bool = True
    show_results: bool = True
    show_technologies: bool = True
    is_active: bool = True


class CaseStudiesPageUpdate(CaseStudiesPageBase):
    pass


class CaseStudiesPageResponse(CaseStudiesPageBase):
    id: int

    model_config = ConfigDict(
        from_attributes=True,
    )
