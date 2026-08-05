from sqlalchemy.orm import Session

from app.models.technology import Technology
from app.schemas.technology import (
    TechnologyCreate,
    TechnologyUpdate,
)


class TechnologyRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_active(
        self,
    ) -> list[Technology]:
        return (
            self.db.query(Technology)
            .filter(
                Technology.is_active.is_(True),
            )
            .order_by(
                Technology.display_order.asc(),
                Technology.name.asc(),
            )
            .all()
        )

    def get_active_by_slug(
        self,
        slug: str,
    ) -> Technology | None:
        return (
            self.db.query(Technology)
            .filter(
                Technology.slug == slug,
                Technology.is_active.is_(True),
            )
            .first()
        )

    def get_all(
        self,
    ) -> list[Technology]:
        return (
            self.db.query(Technology)
            .order_by(
                Technology.display_order.asc(),
                Technology.name.asc(),
            )
            .all()
        )

    def get_by_id(
        self,
        technology_id: int,
    ) -> Technology | None:
        return (
            self.db.query(Technology)
            .filter(
                Technology.id == technology_id,
            )
            .first()
        )

    def get_by_slug(
        self,
        slug: str,
    ) -> Technology | None:
        return (
            self.db.query(Technology)
            .filter(
                Technology.slug == slug,
            )
            .first()
        )

    def create(
        self,
        data: TechnologyCreate,
    ) -> Technology:
        technology = Technology(
            **data.model_dump(),
        )

        self.db.add(technology)
        self.db.commit()
        self.db.refresh(technology)

        return technology

    def update(
        self,
        technology: Technology,
        data: TechnologyUpdate,
    ) -> Technology:
        update_data = data.model_dump()

        for field, value in update_data.items():
            setattr(technology, field, value)

        self.db.commit()
        self.db.refresh(technology)

        return technology

    def delete(
        self,
        technology: Technology,
    ) -> None:
        self.db.delete(technology)
        self.db.commit()
