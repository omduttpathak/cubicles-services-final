from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class BlogCreate(BaseModel):
    title: str = Field(min_length=3, max_length=255)
    slug: str = Field(
        min_length=3,
        max_length=255,
        pattern=r"^[a-z0-9]+(?:-[a-z0-9]+)*$",
    )
    category: str = Field(min_length=2, max_length=100)
    excerpt: str = Field(min_length=10, max_length=500)
    content: str = Field(min_length=20)
    author: str = Field(min_length=2, max_length=150)
    image_url: str | None = Field(default=None, max_length=500)
    seo_title: str = Field(min_length=3, max_length=255)
    seo_description: str = Field(min_length=10, max_length=500)
    is_published: bool = False
    published_at: datetime | None = None


class BlogUpdate(BaseModel):
    title: str = Field(min_length=3, max_length=255)
    slug: str = Field(
        min_length=3,
        max_length=255,
        pattern=r"^[a-z0-9]+(?:-[a-z0-9]+)*$",
    )
    category: str = Field(min_length=2, max_length=100)
    excerpt: str = Field(min_length=10, max_length=500)
    content: str = Field(min_length=20)
    author: str = Field(min_length=2, max_length=150)
    image_url: str | None = Field(default=None, max_length=500)
    seo_title: str = Field(min_length=3, max_length=255)
    seo_description: str = Field(min_length=10, max_length=500)


class BlogListResponse(BaseModel):
    id: int
    title: str
    slug: str
    category: str
    excerpt: str
    author: str
    image_url: str | None
    published_at: datetime

    model_config = ConfigDict(from_attributes=True)


class BlogDetailsResponse(BlogListResponse):
    content: str
    seo_title: str
    seo_description: str


class AdminBlogResponse(BlogDetailsResponse):
    is_published: bool
    created_at: datetime
    updated_at: datetime
