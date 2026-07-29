from sqlalchemy.orm import Session

from app.models.services_page import ServicesPage
from app.schemas.services_page import ServicesPageUpdate


class ServicesPageRepository:
    def __init__(
        self,
        db: Session,
    ):
        self.db = db

    def get_active(
        self,
    ) -> ServicesPage | None:
        return (
            self.db.query(ServicesPage)
            .filter(
                ServicesPage.is_active.is_(True),
            )
            .order_by(
                ServicesPage.id.asc(),
            )
            .first()
        )

    def get_settings(
        self,
    ) -> ServicesPage | None:
        return (
            self.db.query(ServicesPage)
            .order_by(
                ServicesPage.id.asc(),
            )
            .first()
        )

    def create(
        self,
        data: ServicesPageUpdate,
    ) -> ServicesPage:
        page = ServicesPage(
            **data.model_dump(),
        )

        self.db.add(page)
        self.db.commit()
        self.db.refresh(page)

        return page

    def update(
        self,
        page: ServicesPage,
        data: ServicesPageUpdate,
    ) -> ServicesPage:
        for field, value in data.model_dump().items():
            setattr(
                page,
                field,
                value,
            )

        self.db.commit()
        self.db.refresh(page)

        return page
