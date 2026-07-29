from sqlalchemy.orm import Session

from app.models.about_value import AboutValue
from app.repositories.about_value_repository import (
    AboutValueRepository,
)
from app.schemas.about_value import (
    AboutValueCreate,
    AboutValueUpdate,
)


class AboutValueService:
    def __init__(self, db: Session):
        self.repository = AboutValueRepository(db)

    def get_about_values(self) -> list[AboutValue]:
        return self.repository.get_active()

    def get_admin_about_values(self) -> list[AboutValue]:
        return self.repository.get_all()

    def create_about_value(
        self,
        data: AboutValueCreate,
    ) -> AboutValue:
        normalized = data.model_copy(
            update={
                "title": data.title.strip(),
                "description": data.description.strip(),
            },
        )

        return self.repository.create(normalized)

    def update_about_value(
        self,
        value_id: int,
        data: AboutValueUpdate,
    ) -> AboutValue:
        value = self.repository.get_by_id(value_id)

        if value is None:
            raise LookupError("About value not found.")

        normalized = data.model_copy(
            update={
                "title": data.title.strip(),
                "description": data.description.strip(),
            },
        )

        return self.repository.update(
            value,
            normalized,
        )

    def delete_about_value(
        self,
        value_id: int,
    ) -> None:
        value = self.repository.get_by_id(value_id)

        if value is None:
            raise LookupError("About value not found.")

        self.repository.delete(value)
