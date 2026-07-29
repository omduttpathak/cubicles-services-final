from pydantic import (
    BaseModel,
    ConfigDict,
    Field,
)


class ContactPageBase(BaseModel):
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

    form_title: str = Field(
        min_length=3,
        max_length=255,
    )

    form_description: str = Field(
        min_length=10,
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

    company_label: str = Field(
        min_length=2,
        max_length=100,
    )

    phone_label: str = Field(
        min_length=2,
        max_length=100,
    )

    service_label: str = Field(
        min_length=2,
        max_length=100,
    )

    message_label: str = Field(
        min_length=2,
        max_length=100,
    )

    service_placeholder: str = Field(
        min_length=2,
        max_length=150,
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

    show_breadcrumb: bool = True
    show_form: bool = True
    is_active: bool = True


class ContactPageUpdate(ContactPageBase):
    pass


class ContactPageResponse(ContactPageBase):
    id: int

    model_config = ConfigDict(
        from_attributes=True,
    )
