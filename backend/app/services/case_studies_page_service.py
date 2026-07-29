from sqlalchemy.orm import Session

from app.models.case_studies_page import CaseStudiesPage
from app.repositories.case_studies_page_repository import (
    CaseStudiesPageRepository,
)
from app.schemas.case_studies_page import (
    CaseStudiesPageUpdate,
)


class CaseStudiesPageService:
    def __init__(self, db: Session):
        self.repository = CaseStudiesPageRepository(db)

    def get_case_studies_page(
        self,
    ) -> CaseStudiesPage | None:
        return self.repository.get_active()

    def get_admin_case_studies_page(
        self,
    ) -> CaseStudiesPage | None:
        return self.repository.get_settings()

    def update_case_studies_page(
        self,
        data: CaseStudiesPageUpdate,
    ) -> CaseStudiesPage:
        normalized_data = data.model_copy(
            update={
                "hero_eyebrow": data.hero_eyebrow.strip(),
                "hero_title": data.hero_title.strip(),
                "hero_description": data.hero_description.strip(),
                "search_placeholder": data.search_placeholder.strip(),
                "all_industries_label": (
                    data.all_industries_label.strip()
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
                "results_heading": (
                    data.results_heading.strip()
                ),
                "view_button_text": (
                    data.view_button_text.strip()
                ),
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
