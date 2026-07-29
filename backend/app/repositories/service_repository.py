from sqlalchemy.orm import Session

from app.models.service import Service
from app.schemas.service import (
    ServiceCreate,
    ServiceUpdate,
)


class ServiceRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_all(self) -> list[Service]:
        return self.db.query(Service).order_by(Service.id.asc()).all()

    def get_by_id(
        self,
        service_id: int,
    ) -> Service | None:
        return self.db.query(Service).filter(Service.id == service_id).first()

    def get_by_slug(
        self,
        slug: str,
    ) -> Service | None:
        return self.db.query(Service).filter(Service.slug == slug).first()

    def create(
        self,
        data: ServiceCreate,
    ) -> Service:
        service = Service(
            **data.model_dump(),
        )

        self.db.add(service)
        self.db.commit()
        self.db.refresh(service)

        return service

    def update(
        self,
        service: Service,
        data: ServiceUpdate,
    ) -> Service:
        update_data = data.model_dump()

        for field, value in update_data.items():
            setattr(service, field, value)

        self.db.commit()
        self.db.refresh(service)

        return service

    def delete(
        self,
        service: Service,
    ) -> None:
        self.db.delete(service)
        self.db.commit()
