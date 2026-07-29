from pydantic import (
    BaseModel,
    ConfigDict,
    Field,
)


class HomepageFaqBase(BaseModel):
    question: str = Field(
        min_length=5,
    )

    answer: str = Field(
        min_length=10,
    )

    display_order: int = Field(
        default=0,
        ge=0,
    )

    is_active: bool = True


class HomepageFaqCreate(
    HomepageFaqBase,
):
    pass


class HomepageFaqUpdate(
    HomepageFaqBase,
):
    pass


class HomepageFaqResponse(
    HomepageFaqBase,
):
    id: int

    model_config = ConfigDict(
        from_attributes=True,
    )
