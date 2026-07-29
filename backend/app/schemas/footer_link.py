from datetime import datetime

from pydantic import (
    BaseModel,
    ConfigDict,
    Field,
    field_validator,
)


class FooterLinkBase(BaseModel):
    group_name: str = Field(
        min_length=1,
        max_length=100,
    )

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
        "group_name",
        "title",
        "url",
    )
    @classmethod
    def normalize_required_text(
        cls,
        value: str,
    ) -> str:
        normalized = value.strip()

        if not normalized:
            raise ValueError(
                "This field cannot be empty.",
            )

        return normalized

    @field_validator("url")
    @classmethod
    def validate_url(
        cls,
        value: str,
    ) -> str:
        if value.startswith("/"):
            return value

        if value.startswith(
            (
                "http://",
                "https://",
                "mailto:",
                "tel:",
            )
        ):
            return value

        raise ValueError(
            "URL must start with /, http://, https://, mailto: or tel:.",
        )


class FooterLinkCreate(FooterLinkBase):
    pass


class FooterLinkUpdate(FooterLinkBase):
    pass


class FooterLinkOrderItem(BaseModel):
    id: int
    group_name: str = Field(
        min_length=1,
        max_length=100,
    )
    display_order: int = Field(
        ge=0,
    )


class FooterLinkOrderUpdate(BaseModel):
    items: list[FooterLinkOrderItem] = Field(
        min_length=1,
    )

    @field_validator("items")
    @classmethod
    def validate_unique_ids(
        cls,
        value: list[FooterLinkOrderItem],
    ) -> list[FooterLinkOrderItem]:
        ids = [item.id for item in value]

        if len(ids) != len(set(ids)):
            raise ValueError(
                "Footer link order cannot contain duplicate IDs.",
            )

        return value


class FooterLinkResponse(FooterLinkBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(
        from_attributes=True,
    )


class PublicFooterLinkResponse(BaseModel):
    id: int
    group_name: str
    title: str
    url: str
    open_in_new_tab: bool
    display_order: int

    model_config = ConfigDict(
        from_attributes=True,
    )
