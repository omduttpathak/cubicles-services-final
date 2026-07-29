from sqlalchemy.orm import Session

from app.models.about_page import AboutPage
from app.repositories.about_page_repository import (
    AboutPageRepository,
)
from app.schemas.about_page import (
    AboutPageUpdate,
)


class AboutPageService:
    def __init__(self, db: Session):
        self.repository = AboutPageRepository(db)

    def get_about_page(self) -> AboutPage | None:
        return self.repository.get_active()

    def get_admin_about_page(self) -> AboutPage | None:
        return self.repository.get_settings()

    def update_about_page(
        self,
        data: AboutPageUpdate,
    ) -> AboutPage:
        normalized = data.model_copy(
            update={
                "hero_badge": data.hero_badge.strip(),
                "hero_title": data.hero_title.strip(),
                "hero_description": data.hero_description.strip(),
                "overview_eyebrow": data.overview_eyebrow.strip(),
                "overview_title": data.overview_title.strip(),
                "overview_description_one": data.overview_description_one.strip(),
                "overview_description_two": data.overview_description_two.strip(),
                "values_eyebrow": data.values_eyebrow.strip(),
                "values_title": data.values_title.strip(),
                "values_description": data.values_description.strip(),
                "seo_title": data.seo_title.strip(),
                "seo_description": data.seo_description.strip(),
            }
        )

        about = self.repository.get_settings()

        if about is None:
            return self.repository.create(normalized)

        return self.repository.update(
            about,
            normalized,
        )
