from sqlalchemy.orm import Session

from app.models.services_page import ServicesPage
from app.repositories.services_page_repository import (
    ServicesPageRepository,
)
from app.schemas.services_page import (
    ServicesPageUpdate,
)


class ServicesPageService:
    def __init__(
        self,
        db: Session,
    ):
        self.repository = ServicesPageRepository(
            db,
        )

    def get_services_page(
        self,
    ) -> ServicesPage | None:
        return self.repository.get_active()

    def get_admin_services_page(
        self,
    ) -> ServicesPage | None:
        return self.repository.get_settings()

    def update_services_page(
        self,
        data: ServicesPageUpdate,
    ) -> ServicesPage:
        page = self.repository.get_settings()

        if page is None:
            return self.repository.create(data)

        return self.repository.update(
            page,
            data,
        )
