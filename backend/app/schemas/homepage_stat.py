from pydantic import (
    BaseModel,
    ConfigDict,
    Field,
)


class HomepageStatBase(BaseModel):
    value: str = Field(
        min_length=1,
        max_length=50,
    )

    title: str = Field(
        min_length=2,
        max_length=150,
    )

    display_order: int = Field(
        default=0,
        ge=0,
    )

    is_active: bool = True


class HomepageStatCreate(HomepageStatBase):
    pass


class HomepageStatUpdate(HomepageStatBase):
    pass


class HomepageStatResponse(HomepageStatBase):
    id: int

    model_config = ConfigDict(
        from_attributes=True,
    )
