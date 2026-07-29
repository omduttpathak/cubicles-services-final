from sqlalchemy.orm import Session

from app.models.blog_page import BlogPage
from app.schemas.blog_page import BlogPageUpdate


class BlogPageRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_active(
        self,
    ) -> BlogPage | None:
        return (
            self.db.query(BlogPage)
            .filter(
                BlogPage.is_active.is_(True),
            )
            .order_by(
                BlogPage.id.asc(),
            )
            .first()
        )

    def get_settings(
        self,
    ) -> BlogPage | None:
        return (
            self.db.query(BlogPage)
            .order_by(
                BlogPage.id.asc(),
            )
            .first()
        )

    def create(
        self,
        data: BlogPageUpdate,
    ) -> BlogPage:
        page = BlogPage(
            **data.model_dump(),
        )

        self.db.add(page)
        self.db.commit()
        self.db.refresh(page)

        return page

    def update(
        self,
        page: BlogPage,
        data: BlogPageUpdate,
    ) -> BlogPage:
        for field, value in data.model_dump().items():
            setattr(page, field, value)

        self.db.commit()
        self.db.refresh(page)

        return page
