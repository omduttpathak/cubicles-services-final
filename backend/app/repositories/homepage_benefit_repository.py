from sqlalchemy.orm import Session

from app.models.homepage_benefit import (
    HomepageBenefit,
)
from app.schemas.homepage_benefit import (
    HomepageBenefitCreate,
    HomepageBenefitUpdate,
)


class HomepageBenefitRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_active(
        self,
    ) -> list[HomepageBenefit]:
        return (
            self.db.query(HomepageBenefit)
            .filter(
                HomepageBenefit.is_active.is_(True),
            )
            .order_by(
                HomepageBenefit.display_order.asc(),
                HomepageBenefit.id.asc(),
            )
            .all()
        )

    def get_all(
        self,
    ) -> list[HomepageBenefit]:
        return (
            self.db.query(HomepageBenefit)
            .order_by(
                HomepageBenefit.display_order.asc(),
                HomepageBenefit.id.asc(),
            )
            .all()
        )

    def get_by_id(
        self,
        benefit_id: int,
    ) -> HomepageBenefit | None:
        return (
            self.db.query(HomepageBenefit)
            .filter(
                HomepageBenefit.id == benefit_id,
            )
            .first()
        )

    def create(
        self,
        data: HomepageBenefitCreate,
    ) -> HomepageBenefit:
        benefit = HomepageBenefit(
            **data.model_dump(),
        )

        self.db.add(benefit)
        self.db.commit()
        self.db.refresh(benefit)

        return benefit

    def update(
        self,
        benefit: HomepageBenefit,
        data: HomepageBenefitUpdate,
    ) -> HomepageBenefit:
        update_data = data.model_dump()

        for field, value in update_data.items():
            setattr(benefit, field, value)

        self.db.commit()
        self.db.refresh(benefit)

        return benefit

    def delete(
        self,
        benefit: HomepageBenefit,
    ) -> None:
        self.db.delete(benefit)
        self.db.commit()
