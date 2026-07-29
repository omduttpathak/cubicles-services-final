from pydantic import (
    BaseModel,
    ConfigDict,
    Field,
)


class ServiceBase(BaseModel):
    title: str = Field(
        min_length=3,
        max_length=150,
    )

    slug: str = Field(
        min_length=3,
        max_length=150,
        pattern=r"^[a-z0-9]+(?:-[a-z0-9]+)*$",
    )

    icon: str = Field(
        min_length=2,
        max_length=50,
    )

    short_description: str = Field(
        min_length=20,
        max_length=500,
    )

    description: str = Field(
        min_length=50,
    )

    highlights: list[str] = Field(
        min_length=1,
    )

    hero_title: str = Field(
        min_length=3,
        max_length=200,
    )

    hero_description: str = Field(
        min_length=20,
        max_length=500,
    )

    seo_title: str = Field(
        min_length=10,
        max_length=255,
    )

    seo_description: str = Field(
        min_length=20,
        max_length=500,
    )


class ServiceCreate(ServiceBase):
    pass


class ServiceUpdate(ServiceBase):
    pass


class ServiceResponse(ServiceBase):
    id: int

    model_config = ConfigDict(
        from_attributes=True,
    )
