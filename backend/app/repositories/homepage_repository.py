from sqlalchemy.orm import Session

from app.models.homepage import Homepage
from app.schemas.homepage import HomepageUpdate


class HomepageRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_active(
        self,
    ) -> Homepage | None:
        return (
            self.db.query(Homepage)
            .filter(Homepage.is_active.is_(True))
            .order_by(Homepage.id.asc())
            .first()
        )

    def get_settings(
        self,
    ) -> Homepage | None:
        return self.db.query(Homepage).order_by(Homepage.id.asc()).first()

    def create(
        self,
        data: HomepageUpdate,
    ) -> Homepage:
        homepage = Homepage(
            **data.model_dump(),
        )

        self.db.add(homepage)
        self.db.commit()
        self.db.refresh(homepage)

        return homepage

    def update(
        self,
        homepage: Homepage,
        data: HomepageUpdate,
    ) -> Homepage:
        update_data = data.model_dump()

        for field, value in update_data.items():
            setattr(homepage, field, value)

        self.db.commit()
        self.db.refresh(homepage)

        return homepage
