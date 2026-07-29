from pydantic import (
    BaseModel,
    ConfigDict,
    Field,
)


class CareerPageBase(BaseModel):
    hero_eyebrow: str = Field(
        min_length=2,
        max_length=255,
    )

    hero_title: str = Field(
        min_length=5,
        max_length=500,
    )

    hero_description: str = Field(
        min_length=10,
        max_length=1000,
    )

    openings_eyebrow: str = Field(
        min_length=2,
        max_length=255,
    )

    openings_title: str = Field(
        min_length=5,
        max_length=500,
    )

    openings_description: str = Field(
        min_length=10,
        max_length=1000,
    )

    empty_title: str = Field(
        min_length=3,
        max_length=255,
    )

    empty_description: str = Field(
        min_length=5,
        max_length=500,
    )

    apply_button_text: str = Field(
        min_length=2,
        max_length=100,
    )

    application_eyebrow: str = Field(
        min_length=2,
        max_length=255,
    )

    application_title_prefix: str = Field(
        min_length=2,
        max_length=255,
    )

    application_description: str = Field(
        min_length=5,
        max_length=500,
    )

    full_name_label: str = Field(
        min_length=2,
        max_length=100,
    )

    email_label: str = Field(
        min_length=2,
        max_length=100,
    )

    phone_label: str = Field(
        min_length=2,
        max_length=100,
    )

    position_label: str = Field(
        min_length=2,
        max_length=100,
    )

    experience_label: str = Field(
        min_length=2,
        max_length=100,
    )

    company_label: str = Field(
        min_length=2,
        max_length=100,
    )

    location_label: str = Field(
        min_length=2,
        max_length=100,
    )

    linkedin_label: str = Field(
        min_length=2,
        max_length=100,
    )

    resume_label: str = Field(
        min_length=2,
        max_length=100,
    )

    cover_letter_label: str = Field(
        min_length=2,
        max_length=100,
    )

    resume_upload_title: str = Field(
        min_length=2,
        max_length=150,
    )

    resume_upload_description: str = Field(
        min_length=3,
        max_length=255,
    )

    cancel_button_text: str = Field(
        min_length=2,
        max_length=100,
    )

    submit_button_text: str = Field(
        min_length=2,
        max_length=100,
    )

    submitting_button_text: str = Field(
        min_length=2,
        max_length=100,
    )

    success_message: str = Field(
        min_length=3,
        max_length=255,
    )

    error_message: str = Field(
        min_length=3,
        max_length=255,
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
    show_openings: bool = True
    is_active: bool = True


class CareerPageUpdate(CareerPageBase):
    pass


class CareerPageResponse(CareerPageBase):
    id: int

    model_config = ConfigDict(
        from_attributes=True,
    )
