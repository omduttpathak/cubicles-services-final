from sqlalchemy.orm import Session

from app.models.contact_page import ContactPage
from app.repositories.contact_page_repository import (
    ContactPageRepository,
)
from app.schemas.contact_page import ContactPageUpdate


class ContactPageService:
    def __init__(self, db: Session):
        self.repository = ContactPageRepository(db)

    def get_contact_page(
        self,
    ) -> ContactPage | None:
        return self.repository.get_active()

    def get_admin_contact_page(
        self,
    ) -> ContactPage | None:
        return self.repository.get_settings()

    def update_contact_page(
        self,
        data: ContactPageUpdate,
    ) -> ContactPage:
        normalized = data.model_copy(
            update={
                "hero_eyebrow": data.hero_eyebrow.strip(),
                "hero_title": data.hero_title.strip(),
                "hero_description": data.hero_description.strip(),
                "form_title": data.form_title.strip(),
                "form_description": data.form_description.strip(),
                "full_name_label": data.full_name_label.strip(),
                "email_label": data.email_label.strip(),
                "company_label": data.company_label.strip(),
                "phone_label": data.phone_label.strip(),
                "service_label": data.service_label.strip(),
                "message_label": data.message_label.strip(),
                "service_placeholder": data.service_placeholder.strip(),
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
