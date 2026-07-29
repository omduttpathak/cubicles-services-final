from sqlalchemy.orm import Session

from app.models.career_page import CareerPage
from app.repositories.career_page_repository import (
    CareerPageRepository,
)
from app.schemas.career_page import CareerPageUpdate


class CareerPageService:
    def __init__(self, db: Session):
        self.repository = CareerPageRepository(db)

    def get_career_page(
        self,
    ) -> CareerPage | None:
        return self.repository.get_active()

    def get_admin_career_page(
        self,
    ) -> CareerPage | None:
        return self.repository.get_settings()

    def update_career_page(
        self,
        data: CareerPageUpdate,
    ) -> CareerPage:
        normalized = data.model_copy(
            update={
                "hero_eyebrow": data.hero_eyebrow.strip(),
                "hero_title": data.hero_title.strip(),
                "hero_description": data.hero_description.strip(),
                "openings_eyebrow": data.openings_eyebrow.strip(),
                "openings_title": data.openings_title.strip(),
                "openings_description": data.openings_description.strip(),
                "empty_title": data.empty_title.strip(),
                "empty_description": data.empty_description.strip(),
                "apply_button_text": data.apply_button_text.strip(),
                "application_eyebrow": data.application_eyebrow.strip(),
                "application_title_prefix": (
                    data.application_title_prefix.strip()
                ),
                "application_description": (
                    data.application_description.strip()
                ),
                "full_name_label": data.full_name_label.strip(),
                "email_label": data.email_label.strip(),
                "phone_label": data.phone_label.strip(),
                "position_label": data.position_label.strip(),
                "experience_label": data.experience_label.strip(),
                "company_label": data.company_label.strip(),
                "location_label": data.location_label.strip(),
                "linkedin_label": data.linkedin_label.strip(),
                "resume_label": data.resume_label.strip(),
                "cover_letter_label": data.cover_letter_label.strip(),
                "resume_upload_title": (
                    data.resume_upload_title.strip()
                ),
                "resume_upload_description": (
                    data.resume_upload_description.strip()
                ),
                "cancel_button_text": data.cancel_button_text.strip(),
                "submit_button_text": data.submit_button_text.strip(),
                "submitting_button_text": (
                    data.submitting_button_text.strip()
                ),
                "success_message": data.success_message.strip(),
                "error_message": data.error_message.strip(),
                "seo_title": data.seo_title.strip(),
                "seo_description": data.seo_description.strip(),
            },
        )

        settings = self.repository.get_settings()

        if settings is None:
            return self.repository.create(normalized)

        return self.repository.update(
            settings,
            normalized,
        )
