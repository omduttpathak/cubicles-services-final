from sqlalchemy.orm import Session

from app.models.about_stat import AboutStat
from app.schemas.about_stat import (
    AboutStatCreate,
    AboutStatUpdate,
)


class AboutStatRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_active(self) -> list[AboutStat]:
        return (
            self.db.query(AboutStat)
            .filter(AboutStat.is_active.is_(True))
            .order_by(
                AboutStat.display_order.asc(),
                AboutStat.id.asc(),
            )
            .all()
        )

    def get_all(self) -> list[AboutStat]:
        return (
            self.db.query(AboutStat)
            .order_by(
                AboutStat.display_order.asc(),
                AboutStat.id.asc(),
            )
            .all()
        )

    def get_by_id(
        self,
        stat_id: int,
    ) -> AboutStat | None:
        return (
            self.db.query(AboutStat)
            .filter(AboutStat.id == stat_id)
            .first()
        )

    def create(
        self,
        data: AboutStatCreate,
    ) -> AboutStat:
        stat = AboutStat(
            **data.model_dump(),
        )

        self.db.add(stat)
        self.db.commit()
        self.db.refresh(stat)

        return stat

    def update(
        self,
        stat: AboutStat,
        data: AboutStatUpdate,
    ) -> AboutStat:
        for field, value in data.model_dump().items():
            setattr(stat, field, value)

        self.db.commit()
        self.db.refresh(stat)

        return stat

    def delete(
        self,
        stat: AboutStat,
    ) -> None:
        self.db.delete(stat)
        self.db.commit()
