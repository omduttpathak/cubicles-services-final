from sqlalchemy.orm import Session

from app.models.career_application import (
    CareerApplication,
)
from app.schemas.career_application import (
    CareerApplicationCreate,
    CareerApplicationStatus,
)


class CareerApplicationRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(
        self,
        data: CareerApplicationCreate,
    ) -> CareerApplication:
        application = CareerApplication(
            **data.model_dump(),
        )

        self.db.add(application)
        self.db.commit()
        self.db.refresh(application)

        return application

    def get_all(
        self,
    ) -> list[CareerApplication]:
        return (
            self.db.query(CareerApplication)
            .order_by(
                CareerApplication.created_at.desc(),
            )
            .all()
        )

    def get_by_id(
        self,
        application_id: int,
    ) -> CareerApplication | None:
        return (
            self.db.query(CareerApplication)
            .filter(
                CareerApplication.id == application_id,
            )
            .first()
        )

    def update_status(
        self,
        application: CareerApplication,
        new_status: CareerApplicationStatus,
    ) -> CareerApplication:
        application.status = new_status

        self.db.commit()
        self.db.refresh(application)

        return application

    def delete(
        self,
        application: CareerApplication,
    ) -> None:
        self.db.delete(application)
        self.db.commit()
