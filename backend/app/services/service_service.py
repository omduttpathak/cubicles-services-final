from sqlalchemy.orm import Session

from app.models.service import Service
from app.repositories.service_repository import (
    ServiceRepository,
)
from app.schemas.service import (
    ServiceCreate,
    ServiceUpdate,
)


class ServiceService:
    def __init__(self, db: Session):
        self.repository = ServiceRepository(db)

    def get_services(self) -> list[Service]:
        return self.repository.get_all()

    def get_service_by_slug(
        self,
        slug: str,
    ) -> Service | None:
        return self.repository.get_by_slug(slug)

    def get_admin_services(
        self,
    ) -> list[Service]:
        return self.repository.get_all()

    def get_admin_service_by_id(
        self,
        service_id: int,
    ) -> Service | None:
        return self.repository.get_by_id(
            service_id,
        )

    def create_service(
        self,
        data: ServiceCreate,
    ) -> Service:
        normalized_slug = data.slug.strip().lower()

        existing = self.repository.get_by_slug(
            normalized_slug,
        )

        if existing is not None:
            raise ValueError(
                "A service with this slug already exists.",
            )

        normalized_data = self._normalize_service_data(
            data,
            normalized_slug,
        )

        return self.repository.create(
            normalized_data,
        )

    def update_service(
        self,
        service_id: int,
        data: ServiceUpdate,
    ) -> Service:
        service = self.repository.get_by_id(
            service_id,
        )

        if service is None:
            raise LookupError("Service not found")

        normalized_slug = data.slug.strip().lower()

        existing = self.repository.get_by_slug(
            normalized_slug,
        )

        if existing is not None and existing.id != service_id:
            raise ValueError(
                "A service with this slug already exists.",
            )

        normalized_data = self._normalize_service_data(
            data,
            normalized_slug,
        )

        return self.repository.update(
            service,
            normalized_data,
        )

    def delete_service(
        self,
        service_id: int,
    ) -> None:
        service = self.repository.get_by_id(
            service_id,
        )

        if service is None:
            raise LookupError("Service not found")

        self.repository.delete(service)

    def _normalize_service_data(
        self,
        data: ServiceCreate | ServiceUpdate,
        normalized_slug: str,
    ) -> ServiceCreate | ServiceUpdate:
        normalized_highlights = [
            item.strip() for item in data.highlights if item.strip()
        ]

        if not normalized_highlights:
            raise ValueError(
                "At least one service highlight is required.",
            )

        return data.model_copy(
            update={
                "title": data.title.strip(),
                "slug": normalized_slug,
                "icon": data.icon.strip(),
                "short_description": (data.short_description.strip()),
                "description": data.description.strip(),
                "highlights": normalized_highlights,
                "hero_title": data.hero_title.strip(),
                "hero_description": (data.hero_description.strip()),
                "seo_title": data.seo_title.strip(),
                "seo_description": (data.seo_description.strip()),
            },
        )
