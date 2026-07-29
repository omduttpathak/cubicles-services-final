from sqlalchemy.orm import Session

from app.models.homepage_stat import HomepageStat
from app.schemas.homepage_stat import (
    HomepageStatCreate,
    HomepageStatUpdate,
)


class HomepageStatRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_active(
        self,
    ) -> list[HomepageStat]:
        return (
            self.db.query(HomepageStat)
            .filter(
                HomepageStat.is_active.is_(True),
            )
            .order_by(
                HomepageStat.display_order.asc(),
                HomepageStat.id.asc(),
            )
            .all()
        )

    def get_all(
        self,
    ) -> list[HomepageStat]:
        return (
            self.db.query(HomepageStat)
            .order_by(
                HomepageStat.display_order.asc(),
                HomepageStat.id.asc(),
            )
            .all()
        )

    def get_by_id(
        self,
        stat_id: int,
    ) -> HomepageStat | None:
        return (
            self.db.query(HomepageStat)
            .filter(
                HomepageStat.id == stat_id,
            )
            .first()
        )

    def create(
        self,
        data: HomepageStatCreate,
    ) -> HomepageStat:
        stat = HomepageStat(
            **data.model_dump(),
        )

        self.db.add(stat)
        self.db.commit()
        self.db.refresh(stat)

        return stat

    def update(
        self,
        stat: HomepageStat,
        data: HomepageStatUpdate,
    ) -> HomepageStat:
        update_data = data.model_dump()

        for field, value in update_data.items():
            setattr(stat, field, value)

        self.db.commit()
        self.db.refresh(stat)

        return stat

    def delete(
        self,
        stat: HomepageStat,
    ) -> None:
        self.db.delete(stat)
        self.db.commit()
