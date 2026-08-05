from sqlalchemy.orm import Session

from app.models.technology import Technology
from app.repositories.technology_repository import (
    TechnologyRepository,
)
from app.schemas.technology import (
    TechnologyCreate,
    TechnologyUpdate,
)


class TechnologyService:
    def __init__(self, db: Session):
        self.repository = TechnologyRepository(db)

    def get_technologies(
        self,
    ) -> list[Technology]:
        return self.repository.get_active()

    def get_technology_by_slug(
        self,
        slug: str,
    ) -> Technology | None:
        return self.repository.get_active_by_slug(
            slug,
        )

    def get_admin_technologies(
        self,
    ) -> list[Technology]:
        return self.repository.get_all()

    def get_admin_technology_by_id(
        self,
        technology_id: int,
    ) -> Technology | None:
        return self.repository.get_by_id(
            technology_id,
        )

    def create_technology(
        self,
        data: TechnologyCreate,
    ) -> Technology:
        normalized_slug = data.slug.strip().lower()

        existing = self.repository.get_by_slug(
            normalized_slug,
        )

        if existing is not None:
            raise ValueError(
                "A technology with this slug already exists.",
            )

        normalized_data = self._normalize_data(
            data,
            normalized_slug,
        )

        return self.repository.create(
            normalized_data,
        )

    def update_technology(
        self,
        technology_id: int,
        data: TechnologyUpdate,
    ) -> Technology:
        technology = self.repository.get_by_id(
            technology_id,
        )

        if technology is None:
            raise LookupError(
                "Technology not found",
            )

        normalized_slug = data.slug.strip().lower()

        existing = self.repository.get_by_slug(
            normalized_slug,
        )

        if existing is not None and existing.id != technology_id:
            raise ValueError(
                "A technology with this slug already exists.",
            )

        normalized_data = self._normalize_data(
            data,
            normalized_slug,
        )

        return self.repository.update(
            technology,
            normalized_data,
        )

    def delete_technology(
        self,
        technology_id: int,
    ) -> None:
        technology = self.repository.get_by_id(
            technology_id,
        )

        if technology is None:
            raise LookupError(
                "Technology not found",
            )

        self.repository.delete(technology)

    def _normalize_data(
        self,
        data: TechnologyCreate | TechnologyUpdate,
        normalized_slug: str,
    ) -> TechnologyCreate | TechnologyUpdate:
        return data.model_copy(
            update={
                "name": data.name.strip(),
                "slug": normalized_slug,
                "category": data.category.strip(),
                "icon": data.icon.strip(),
                "logo_url": (data.logo_url.strip() if data.logo_url else None),
                "description": data.description.strip(),
                "seo_title": data.seo_title.strip(),
                "seo_description": (data.seo_description.strip()),
            },
        )
