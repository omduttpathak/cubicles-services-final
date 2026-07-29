from datetime import datetime

from pydantic import (
    BaseModel,
    ConfigDict,
    Field,
)


class AboutValueBase(BaseModel):
    title: str = Field(
        min_length=2,
        max_length=150,
    )

    description: str = Field(
        min_length=5,
        max_length=500,
    )

    display_order: int = 0

    is_active: bool = True


class AboutValueCreate(AboutValueBase):
    pass


class AboutValueUpdate(AboutValueBase):
    pass


class AboutValueResponse(AboutValueBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(
        from_attributes=True,
    )
