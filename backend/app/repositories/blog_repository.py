from datetime import datetime
from typing import Any

from sqlalchemy.orm import Session

from app.models.blog import Blog
from app.schemas.blog import BlogCreate, BlogUpdate


class BlogRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_published_blogs(self) -> list[Blog]:
        return (
            self.db.query(Blog)
            .filter(Blog.is_published.is_(True))
            .order_by(Blog.published_at.desc())
            .all()
        )

    def get_published_blog_by_slug(
        self,
        slug: str,
    ) -> Blog | None:
        return (
            self.db.query(Blog)
            .filter(
                Blog.slug == slug,
                Blog.is_published.is_(True),
            )
            .first()
        )

    def get_all(self) -> list[Blog]:
        return self.db.query(Blog).order_by(Blog.created_at.desc()).all()

    def get_by_id(
        self,
        blog_id: int,
    ) -> Blog | None:
        return self.db.query(Blog).filter(Blog.id == blog_id).first()

    def get_by_slug(
        self,
        slug: str,
    ) -> Blog | None:
        return self.db.query(Blog).filter(Blog.slug == slug).first()

    def create(
        self,
        data: BlogCreate,
        *,
        extra_fields: dict[str, Any] | None = None,
    ) -> Blog:
        values = data.model_dump()

        if extra_fields:
            values.update(extra_fields)

        blog = Blog(**values)

        try:
            self.db.add(blog)
            self.db.commit()
            self.db.refresh(blog)
            return blog
        except Exception:
            self.db.rollback()
            raise

    def update(
        self,
        blog: Blog,
        data: BlogUpdate,
        *,
        extra_fields: dict[str, Any] | None = None,
    ) -> Blog:
        update_data = data.model_dump()

        if extra_fields:
            update_data.update(extra_fields)

        try:
            for field, value in update_data.items():
                setattr(blog, field, value)

            self.db.commit()
            self.db.refresh(blog)
            return blog
        except Exception:
            self.db.rollback()
            raise

    def update_publish_status(
        self,
        blog: Blog,
        is_published: bool,
    ) -> Blog:
        blog.is_published = is_published

        if is_published:
            blog.published_at = datetime.now()

        self.db.commit()
        self.db.refresh(blog)

        return blog

    def delete(
        self,
        blog: Blog,
    ) -> None:
        self.db.delete(blog)
        self.db.commit()
