from pydantic import (
    BaseModel,
    ConfigDict,
    Field,
)


class HomepageTestimonialBase(BaseModel):
    name: str = Field(
        min_length=2,
        max_length=150,
    )

    designation: str = Field(
        min_length=2,
        max_length=200,
    )

    content: str = Field(
        min_length=10,
    )

    display_order: int = Field(
        default=0,
        ge=0,
    )

    is_active: bool = True


class HomepageTestimonialCreate(
    HomepageTestimonialBase,
):
    pass


class HomepageTestimonialUpdate(
    HomepageTestimonialBase,
):
    pass


class HomepageTestimonialResponse(
    HomepageTestimonialBase,
):
    id: int

    model_config = ConfigDict(
        from_attributes=True,
    )
