from sqlalchemy.orm import Session

from app.models.homepage_stat import HomepageStat
from app.repositories.homepage_stat_repository import (
    HomepageStatRepository,
)
from app.schemas.homepage_stat import (
    HomepageStatCreate,
    HomepageStatUpdate,
)


class HomepageStatService:
    def __init__(self, db: Session):
        self.repository = HomepageStatRepository(db)

    def get_stats(
        self,
    ) -> list[HomepageStat]:
        return self.repository.get_active()

    def get_admin_stats(
        self,
    ) -> list[HomepageStat]:
        return self.repository.get_all()

    def get_admin_stat_by_id(
        self,
        stat_id: int,
    ) -> HomepageStat | None:
        return self.repository.get_by_id(stat_id)

    def create_stat(
        self,
        data: HomepageStatCreate,
    ) -> HomepageStat:
        normalized_data = data.model_copy(
            update={
                "value": data.value.strip(),
                "title": data.title.strip(),
            },
        )

        return self.repository.create(
            normalized_data,
        )

    def update_stat(
        self,
        stat_id: int,
        data: HomepageStatUpdate,
    ) -> HomepageStat:
        stat = self.repository.get_by_id(stat_id)

        if stat is None:
            raise LookupError(
                "Homepage statistic not found",
            )

        normalized_data = data.model_copy(
            update={
                "value": data.value.strip(),
                "title": data.title.strip(),
            },
        )

        return self.repository.update(
            stat,
            normalized_data,
        )

    def delete_stat(
        self,
        stat_id: int,
    ) -> None:
        stat = self.repository.get_by_id(stat_id)

        if stat is None:
            raise LookupError(
                "Homepage statistic not found",
            )

        self.repository.delete(stat)
