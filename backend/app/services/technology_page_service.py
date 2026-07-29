from sqlalchemy.orm import Session

from app.models.technology_page import TechnologyPage
from app.repositories.technology_page_repository import (
    TechnologyPageRepository,
)
from app.schemas.technology_page import TechnologyPageUpdate


class TechnologyPageService:
    def __init__(self, db: Session):
        self.repository = TechnologyPageRepository(db)

    def get_technology_page(
        self,
    ) -> TechnologyPage | None:
        return self.repository.get_active()

    def get_admin_technology_page(
        self,
    ) -> TechnologyPage | None:
        return self.repository.get_settings()

    def update_technology_page(
        self,
        data: TechnologyPageUpdate,
    ) -> TechnologyPage:
        normalized_data = data.model_copy(
            update={
                "hero_badge": data.hero_badge.strip(),
                "hero_title": data.hero_title.strip(),
                "hero_description": data.hero_description.strip(),
                "featured_eyebrow": data.featured_eyebrow.strip(),
                "featured_title": data.featured_title.strip(),
                "featured_description": (
                    data.featured_description.strip()
                ),
                "categories_eyebrow": data.categories_eyebrow.strip(),
                "categories_title": data.categories_title.strip(),
                "categories_description": (
                    data.categories_description.strip()
                ),
                "empty_title": data.empty_title.strip(),
                "empty_description": data.empty_description.strip(),
                "seo_title": data.seo_title.strip(),
                "seo_description": data.seo_description.strip(),
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
