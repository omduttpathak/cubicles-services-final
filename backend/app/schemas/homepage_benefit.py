from pydantic import (
    BaseModel,
    ConfigDict,
    Field,
)


class HomepageBenefitBase(BaseModel):
    title: str = Field(
        min_length=2,
        max_length=150,
    )

    description: str = Field(
        min_length=10,
    )

    icon: str = Field(
        min_length=1,
        max_length=80,
    )

    display_order: int = Field(
        default=0,
        ge=0,
    )

    is_active: bool = True


class HomepageBenefitCreate(
    HomepageBenefitBase,
):
    pass


class HomepageBenefitUpdate(
    HomepageBenefitBase,
):
    pass


class HomepageBenefitResponse(
    HomepageBenefitBase,
):
    id: int

    model_config = ConfigDict(
        from_attributes=True,
    )
