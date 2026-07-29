from sqlalchemy.orm import Session

from app.models.career_page import CareerPage
from app.schemas.career_page import CareerPageUpdate


class CareerPageRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_active(
        self,
    ) -> CareerPage | None:
        return (
            self.db.query(CareerPage)
            .filter(CareerPage.is_active.is_(True))
            .order_by(CareerPage.id.asc())
            .first()
        )

    def get_settings(
        self,
    ) -> CareerPage | None:
        return (
            self.db.query(CareerPage)
            .order_by(CareerPage.id.asc())
            .first()
        )

    def create(
        self,
        data: CareerPageUpdate,
    ) -> CareerPage:
        settings = CareerPage(
            **data.model_dump(),
        )

        self.db.add(settings)
        self.db.commit()
        self.db.refresh(settings)

        return settings

    def update(
        self,
        settings: CareerPage,
        data: CareerPageUpdate,
    ) -> CareerPage:
        for field, value in data.model_dump().items():
            setattr(settings, field, value)

        self.db.commit()
        self.db.refresh(settings)

        return settings
