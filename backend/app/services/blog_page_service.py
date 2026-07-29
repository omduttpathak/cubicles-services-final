from sqlalchemy.orm import Session

from app.models.blog_page import BlogPage
from app.repositories.blog_page_repository import (
    BlogPageRepository,
)
from app.schemas.blog_page import BlogPageUpdate


class BlogPageService:
    def __init__(self, db: Session):
        self.repository = BlogPageRepository(db)

    def get_blog_page(
        self,
    ) -> BlogPage | None:
        return self.repository.get_active()

    def get_admin_blog_page(
        self,
    ) -> BlogPage | None:
        return self.repository.get_settings()

    def update_blog_page(
        self,
        data: BlogPageUpdate,
    ) -> BlogPage:
        normalized_data = data.model_copy(
            update={
                "hero_eyebrow": data.hero_eyebrow.strip(),
                "hero_title": data.hero_title.strip(),
                "hero_description": data.hero_description.strip(),
                "search_placeholder": data.search_placeholder.strip(),
                "all_categories_label": (
                    data.all_categories_label.strip()
                ),
                "clear_filters_text": (
                    data.clear_filters_text.strip()
                ),
                "empty_title": data.empty_title.strip(),
                "empty_description": (
                    data.empty_description.strip()
                ),
                "filtered_empty_description": (
                    data.filtered_empty_description.strip()
                ),
                "read_button_text": (
                    data.read_button_text.strip()
                ),
                "author_prefix": data.author_prefix.strip(),
                "seo_title": data.seo_title.strip(),
                "seo_description": (
                    data.seo_description.strip()
                ),
            },
        )

        page = self.repository.get_settings()

        if page is None:
            return self.repository.create(
                normalized_data,
            )

        return self.repository.update(
            page,
            normalized_data,
        )
