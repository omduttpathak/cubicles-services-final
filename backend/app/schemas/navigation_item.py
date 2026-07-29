from datetime import datetime

from pydantic import (
    BaseModel,
    ConfigDict,
    Field,
    field_validator,
)


class NavigationItemBase(BaseModel):
    title: str = Field(
        min_length=1,
        max_length=100,
    )

    url: str = Field(
        min_length=1,
        max_length=500,
    )

    open_in_new_tab: bool = False

    display_order: int = Field(
        default=0,
        ge=0,
    )

    is_visible: bool = True

    @field_validator(
        "title",
        "url",
    )
    @classmethod
    def validate_required_text(
        cls,
        value: str,
    ) -> str:
        normalized_value = value.strip()

        if not normalized_value:
            raise ValueError(
                "This field cannot be empty.",
            )

        return normalized_value

    @field_validator("url")
    @classmethod
    def validate_url(
        cls,
        value: str,
    ) -> str:
        normalized_value = value.strip()

        if normalized_value.startswith("/"):
            return normalized_value

        if normalized_value.startswith(
            (
                "http://",
                "https://",
                "mailto:",
                "tel:",
            )
        ):
            return normalized_value

        raise ValueError(
            "URL must start with /, http://, https://, mailto: or tel:.",
        )


class NavigationItemCreate(
    NavigationItemBase,
):
    pass


class NavigationItemUpdate(
    NavigationItemBase,
):
    pass


class NavigationItemOrderUpdate(BaseModel):
    item_ids: list[int] = Field(
        min_length=1,
    )

    @field_validator("item_ids")
    @classmethod
    def validate_unique_item_ids(
        cls,
        value: list[int],
    ) -> list[int]:
        if len(value) != len(set(value)):
            raise ValueError(
                "Navigation order cannot contain duplicate IDs.",
            )

        return value


class NavigationItemResponse(
    NavigationItemBase,
):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(
        from_attributes=True,
    )


class PublicNavigationItemResponse(
    BaseModel,
):
    id: int
    title: str
    url: str
    open_in_new_tab: bool
    display_order: int

    model_config = ConfigDict(
        from_attributes=True,
    )
