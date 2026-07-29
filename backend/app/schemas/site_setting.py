from pydantic import (
    BaseModel,
    ConfigDict,
    EmailStr,
    Field,
)


class SiteSettingBase(BaseModel):
    company_name: str = Field(
        min_length=2,
        max_length=150,
    )

    logo_url: str | None = Field(
        default=None,
        max_length=500,
    )

    favicon_url: str | None = Field(
        default=None,
        max_length=500,
    )

    contact_email: EmailStr

    contact_phone: str | None = Field(
        default=None,
        max_length=50,
    )

    address: str | None = None

    footer_description: str = Field(
        min_length=10,
    )

    copyright_text: str = Field(
        min_length=3,
        max_length=255,
    )

    linkedin_url: str | None = Field(
        default=None,
        max_length=500,
    )

    facebook_url: str | None = Field(
        default=None,
        max_length=500,
    )

    twitter_url: str | None = Field(
        default=None,
        max_length=500,
    )

    youtube_url: str | None = Field(
        default=None,
        max_length=500,
    )

    is_active: bool = True


class SiteSettingUpdate(SiteSettingBase):
    pass


class SiteSettingResponse(SiteSettingBase):
    id: int

    model_config = ConfigDict(
        from_attributes=True,
    )
