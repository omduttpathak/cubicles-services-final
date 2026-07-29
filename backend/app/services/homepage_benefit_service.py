from sqlalchemy.orm import Session

from app.models.homepage_benefit import (
    HomepageBenefit,
)
from app.repositories.homepage_benefit_repository import (
    HomepageBenefitRepository,
)
from app.schemas.homepage_benefit import (
    HomepageBenefitCreate,
    HomepageBenefitUpdate,
)


class HomepageBenefitService:
    def __init__(self, db: Session):
        self.repository = HomepageBenefitRepository(db)

    def get_benefits(
        self,
    ) -> list[HomepageBenefit]:
        return self.repository.get_active()

    def get_admin_benefits(
        self,
    ) -> list[HomepageBenefit]:
        return self.repository.get_all()

    def get_admin_benefit_by_id(
        self,
        benefit_id: int,
    ) -> HomepageBenefit | None:
        return self.repository.get_by_id(
            benefit_id,
        )

    def create_benefit(
        self,
        data: HomepageBenefitCreate,
    ) -> HomepageBenefit:
        normalized_data = data.model_copy(
            update={
                "title": data.title.strip(),
                "description": (data.description.strip()),
                "icon": data.icon.strip(),
            },
        )

        return self.repository.create(
            normalized_data,
        )

    def update_benefit(
        self,
        benefit_id: int,
        data: HomepageBenefitUpdate,
    ) -> HomepageBenefit:
        benefit = self.repository.get_by_id(
            benefit_id,
        )

        if benefit is None:
            raise LookupError(
                "Homepage benefit not found",
            )

        normalized_data = data.model_copy(
            update={
                "title": data.title.strip(),
                "description": (data.description.strip()),
                "icon": data.icon.strip(),
            },
        )

        return self.repository.update(
            benefit,
            normalized_data,
        )

    def delete_benefit(
        self,
        benefit_id: int,
    ) -> None:
        benefit = self.repository.get_by_id(
            benefit_id,
        )

        if benefit is None:
            raise LookupError(
                "Homepage benefit not found",
            )

        self.repository.delete(benefit)
