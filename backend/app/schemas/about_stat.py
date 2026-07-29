from datetime import datetime

from pydantic import (
    BaseModel,
    ConfigDict,
    Field,
)


class AboutStatBase(BaseModel):
    value: str = Field(
        min_length=1,
        max_length=50,
    )

    label: str = Field(
        min_length=2,
        max_length=150,
    )

    display_order: int = 0

    is_active: bool = True


class AboutStatCreate(AboutStatBase):
    pass


class AboutStatUpdate(AboutStatBase):
    pass


class AboutStatResponse(AboutStatBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(
        from_attributes=True,
    )
