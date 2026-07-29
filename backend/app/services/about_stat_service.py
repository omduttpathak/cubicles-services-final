from sqlalchemy.orm import Session

from app.models.about_stat import AboutStat
from app.repositories.about_stat_repository import (
    AboutStatRepository,
)
from app.schemas.about_stat import (
    AboutStatCreate,
    AboutStatUpdate,
)


class AboutStatService:
    def __init__(self, db: Session):
        self.repository = AboutStatRepository(db)

    def get_about_stats(self) -> list[AboutStat]:
        return self.repository.get_active()

    def get_admin_about_stats(self) -> list[AboutStat]:
        return self.repository.get_all()

    def create_about_stat(
        self,
        data: AboutStatCreate,
    ) -> AboutStat:
        normalized = data.model_copy(
            update={
                "value": data.value.strip(),
                "label": data.label.strip(),
            },
        )

        return self.repository.create(normalized)

    def update_about_stat(
        self,
        stat_id: int,
        data: AboutStatUpdate,
    ) -> AboutStat:
        stat = self.repository.get_by_id(stat_id)

        if stat is None:
            raise LookupError("About statistic not found.")

        normalized = data.model_copy(
            update={
                "value": data.value.strip(),
                "label": data.label.strip(),
            },
        )

        return self.repository.update(
            stat,
            normalized,
        )

    def delete_about_stat(
        self,
        stat_id: int,
    ) -> None:
        stat = self.repository.get_by_id(stat_id)

        if stat is None:
            raise LookupError("About statistic not found.")

        self.repository.delete(stat)
