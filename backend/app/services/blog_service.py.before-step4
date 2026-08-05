from datetime import datetime

from sqlalchemy.orm import Session

from app.models.blog import Blog
from app.repositories.blog_repository import BlogRepository
from app.schemas.blog import BlogCreate, BlogUpdate


class BlogService:
    def __init__(self, db: Session):
        self.repository = BlogRepository(db)

    def get_blogs(self) -> list[Blog]:
        return self.repository.get_published_blogs()

    def get_blog_by_slug(
        self,
        slug: str,
    ) -> Blog | None:
        return self.repository.get_published_blog_by_slug(
            slug,
        )

    def get_admin_blogs(self) -> list[Blog]:
        return self.repository.get_all()

    def get_admin_blog_by_id(
        self,
        blog_id: int,
    ) -> Blog | None:
        return self.repository.get_by_id(blog_id)

    def create_blog(
        self,
        data: BlogCreate,
    ) -> Blog:
        normalized_slug = data.slug.strip().lower()

        existing_blog = self.repository.get_by_slug(
            normalized_slug,
        )

        if existing_blog is not None:
            raise ValueError(
                "A blog with this slug already exists",
            )

        published_at = data.published_at

        if published_at is None:
            published_at = datetime.now()

        normalized_data = data.model_copy(
            update={
                "title": data.title.strip(),
                "slug": normalized_slug,
                "category": data.category.strip(),
                "excerpt": data.excerpt.strip(),
                "content": data.content.strip(),
                "author": data.author.strip(),
                "image_url": (data.image_url.strip() if data.image_url else None),
                "seo_title": data.seo_title.strip(),
                "seo_description": data.seo_description.strip(),
                "published_at": published_at,
            },
        )

        return self.repository.create(normalized_data)

    def update_blog(
        self,
        blog_id: int,
        data: BlogUpdate,
    ) -> Blog:
        blog = self.repository.get_by_id(blog_id)

        if blog is None:
            raise LookupError("Blog not found")

        normalized_slug = data.slug.strip().lower()

        blog_with_slug = self.repository.get_by_slug(
            normalized_slug,
        )

        if blog_with_slug is not None and blog_with_slug.id != blog_id:
            raise ValueError(
                "A blog with this slug already exists",
            )

        normalized_data = data.model_copy(
            update={
                "title": data.title.strip(),
                "slug": normalized_slug,
                "category": data.category.strip(),
                "excerpt": data.excerpt.strip(),
                "content": data.content.strip(),
                "author": data.author.strip(),
                "image_url": (data.image_url.strip() if data.image_url else None),
                "seo_title": data.seo_title.strip(),
                "seo_description": data.seo_description.strip(),
            },
        )

        return self.repository.update(
            blog,
            normalized_data,
        )

    def update_publish_status(
        self,
        blog_id: int,
        is_published: bool,
    ) -> Blog:
        blog = self.repository.get_by_id(blog_id)

        if blog is None:
            raise ValueError("Blog not found")

        return self.repository.update_publish_status(
            blog,
            is_published,
        )

    def delete_blog(
        self,
        blog_id: int,
    ) -> None:
        blog = self.repository.get_by_id(blog_id)

        if blog is None:
            raise LookupError("Blog not found")

        self.repository.delete(blog)
