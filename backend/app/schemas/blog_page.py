from pydantic import (
    BaseModel,
    ConfigDict,
    Field,
)


class BlogPageBase(BaseModel):
    hero_eyebrow: str = Field(
        min_length=2,
        max_length=255,
    )

    hero_title: str = Field(
        min_length=3,
        max_length=500,
    )

    hero_description: str = Field(
        min_length=10,
        max_length=1000,
    )

    search_placeholder: str = Field(
        min_length=2,
        max_length=255,
    )

    all_categories_label: str = Field(
        min_length=2,
        max_length=150,
    )

    clear_filters_text: str = Field(
        min_length=2,
        max_length=150,
    )

    empty_title: str = Field(
        min_length=3,
        max_length=255,
    )

    empty_description: str = Field(
        min_length=5,
        max_length=500,
    )

    filtered_empty_description: str = Field(
        min_length=5,
        max_length=500,
    )

    read_button_text: str = Field(
        min_length=2,
        max_length=150,
    )

    author_prefix: str = Field(
        min_length=1,
        max_length=100,
    )

    seo_title: str = Field(
        min_length=5,
        max_length=255,
    )

    seo_description: str = Field(
        min_length=10,
        max_length=500,
    )

    show_hero: bool = True
    show_filters: bool = True
    show_articles: bool = True
    show_author: bool = True
    show_date: bool = True
    is_active: bool = True


class BlogPageUpdate(BlogPageBase):
    pass


class BlogPageResponse(BlogPageBase):
    id: int

    model_config = ConfigDict(
        from_attributes=True,
    )
