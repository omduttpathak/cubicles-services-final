from sqlalchemy.orm import Session

from app.models.about_value import AboutValue
from app.schemas.about_value import (
    AboutValueCreate,
    AboutValueUpdate,
)


class AboutValueRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_active(self) -> list[AboutValue]:
        return (
            self.db.query(AboutValue)
            .filter(AboutValue.is_active.is_(True))
            .order_by(
                AboutValue.display_order.asc(),
                AboutValue.id.asc(),
            )
            .all()
        )

    def get_all(self) -> list[AboutValue]:
        return (
            self.db.query(AboutValue)
            .order_by(
                AboutValue.display_order.asc(),
                AboutValue.id.asc(),
            )
            .all()
        )

    def get_by_id(
        self,
        value_id: int,
    ) -> AboutValue | None:
        return (
            self.db.query(AboutValue)
            .filter(AboutValue.id == value_id)
            .first()
        )

    def create(
        self,
        data: AboutValueCreate,
    ) -> AboutValue:
        value = AboutValue(
            **data.model_dump(),
        )

        self.db.add(value)
        self.db.commit()
        self.db.refresh(value)

        return value

    def update(
        self,
        value: AboutValue,
        data: AboutValueUpdate,
    ) -> AboutValue:
        for field, field_value in data.model_dump().items():
            setattr(value, field, field_value)

        self.db.commit()
        self.db.refresh(value)

        return value

    def delete(
        self,
        value: AboutValue,
    ) -> None:
        self.db.delete(value)
        self.db.commit()
