from sqlalchemy.orm import Session

from app.models.contact_page import ContactPage
from app.schemas.contact_page import ContactPageUpdate


class ContactPageRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_active(
        self,
    ) -> ContactPage | None:
        return (
            self.db.query(ContactPage)
            .filter(ContactPage.is_active.is_(True))
            .order_by(ContactPage.id.asc())
            .first()
        )

    def get_settings(
        self,
    ) -> ContactPage | None:
        return (
            self.db.query(ContactPage)
            .order_by(ContactPage.id.asc())
            .first()
        )

    def create(
        self,
        data: ContactPageUpdate,
    ) -> ContactPage:
        settings = ContactPage(
            **data.model_dump(),
        )

        self.db.add(settings)
        self.db.commit()
        self.db.refresh(settings)

        return settings

    def update(
        self,
        settings: ContactPage,
        data: ContactPageUpdate,
    ) -> ContactPage:
        for field, value in data.model_dump().items():
            setattr(settings, field, value)

        self.db.commit()
        self.db.refresh(settings)

        return settings
