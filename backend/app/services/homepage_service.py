from sqlalchemy.orm import Session

from app.models.homepage import Homepage
from app.repositories.homepage_repository import (
    HomepageRepository,
)
from app.schemas.homepage import HomepageUpdate


class HomepageService:
    def __init__(self, db: Session):
        self.repository = HomepageRepository(db)

    def get_homepage(
        self,
    ) -> Homepage | None:
        return self.repository.get_active()

    def get_admin_homepage(
        self,
    ) -> Homepage | None:
        return self.repository.get_settings()

    def update_homepage(
        self,
        data: HomepageUpdate,
    ) -> Homepage:
        normalized_data = data.model_copy(
            update={
                "hero_badge": data.hero_badge.strip(),
                "hero_title": data.hero_title.strip(),
                "hero_description": data.hero_description.strip(),
                "primary_button_text": data.primary_button_text.strip(),
                "primary_button_url": data.primary_button_url.strip(),
                "secondary_button_text": data.secondary_button_text.strip(),
                "secondary_button_url": data.secondary_button_url.strip(),
                "cta_title": data.cta_title.strip(),
                "cta_description": data.cta_description.strip(),
                "cta_button_text": data.cta_button_text.strip(),
                "cta_button_url": data.cta_button_url.strip(),
                "seo_title": data.seo_title.strip(),
                "seo_description": data.seo_description.strip(),
                "services_title": data.services_title.strip(),
                "services_description": data.services_description.strip(),
                "technologies_title": data.technologies_title.strip(),
                "technologies_description": (
                    data.technologies_description.strip()
                ),
                "benefits_title": data.benefits_title.strip(),
                "benefits_description": data.benefits_description.strip(),
                "industries_title": data.industries_title.strip(),
                "industries_description": (
                    data.industries_description.strip()
                ),
                "case_studies_title": data.case_studies_title.strip(),
                "case_studies_description": (
                    data.case_studies_description.strip()
                ),
                "testimonials_title": data.testimonials_title.strip(),
                "testimonials_description": (
                    data.testimonials_description.strip()
                ),
                "stats_title": data.stats_title.strip(),
                "stats_description": data.stats_description.strip(),
                "faq_title": data.faq_title.strip(),
                "faq_description": data.faq_description.strip(),
                "section_order": list(data.section_order),
            },
        )

        homepage = self.repository.get_settings()

        if homepage is None:
            return self.repository.create(
                normalized_data,
            )

        return self.repository.update(
            homepage,
            normalized_data,
        )
