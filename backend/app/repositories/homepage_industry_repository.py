from sqlalchemy.orm import Session

from app.models.homepage_industry import (
    HomepageIndustry,
)
from app.schemas.homepage_industry import (
    HomepageIndustryCreate,
    HomepageIndustryUpdate,
)


class HomepageIndustryRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_active(
        self,
    ) -> list[HomepageIndustry]:
        return (
            self.db.query(HomepageIndustry)
            .filter(
                HomepageIndustry.is_active.is_(True),
            )
            .order_by(
                HomepageIndustry.display_order.asc(),
                HomepageIndustry.id.asc(),
            )
            .all()
        )

    def get_all(
        self,
    ) -> list[HomepageIndustry]:
        return (
            self.db.query(HomepageIndustry)
            .order_by(
                HomepageIndustry.display_order.asc(),
                HomepageIndustry.id.asc(),
            )
            .all()
        )

    def get_by_id(
        self,
        industry_id: int,
    ) -> HomepageIndustry | None:
        return (
            self.db.query(HomepageIndustry)
            .filter(
                HomepageIndustry.id == industry_id,
            )
            .first()
        )

    def create(
        self,
        data: HomepageIndustryCreate,
    ) -> HomepageIndustry:
        industry = HomepageIndustry(
            **data.model_dump(),
        )

        self.db.add(industry)
        self.db.commit()
        self.db.refresh(industry)

        return industry

    def update(
        self,
        industry: HomepageIndustry,
        data: HomepageIndustryUpdate,
    ) -> HomepageIndustry:
        update_data = data.model_dump()

        for field, value in update_data.items():
            setattr(industry, field, value)

        self.db.commit()
        self.db.refresh(industry)

        return industry

    def delete(
        self,
        industry: HomepageIndustry,
    ) -> None:
        self.db.delete(industry)
        self.db.commit()
