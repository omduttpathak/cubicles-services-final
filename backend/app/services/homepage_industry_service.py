from sqlalchemy.orm import Session

from app.models.homepage_industry import (
    HomepageIndustry,
)
from app.repositories.homepage_industry_repository import (
    HomepageIndustryRepository,
)
from app.schemas.homepage_industry import (
    HomepageIndustryCreate,
    HomepageIndustryUpdate,
)


class HomepageIndustryService:
    def __init__(self, db: Session):
        self.repository = HomepageIndustryRepository(db)

    def get_industries(
        self,
    ) -> list[HomepageIndustry]:
        return self.repository.get_active()

    def get_admin_industries(
        self,
    ) -> list[HomepageIndustry]:
        return self.repository.get_all()

    def get_admin_industry_by_id(
        self,
        industry_id: int,
    ) -> HomepageIndustry | None:
        return self.repository.get_by_id(
            industry_id,
        )

    def create_industry(
        self,
        data: HomepageIndustryCreate,
    ) -> HomepageIndustry:
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

    def update_industry(
        self,
        industry_id: int,
        data: HomepageIndustryUpdate,
    ) -> HomepageIndustry:
        industry = self.repository.get_by_id(
            industry_id,
        )

        if industry is None:
            raise LookupError(
                "Homepage industry not found",
            )

        normalized_data = data.model_copy(
            update={
                "title": data.title.strip(),
                "description": (data.description.strip()),
                "icon": data.icon.strip(),
            },
        )

        return self.repository.update(
            industry,
            normalized_data,
        )

    def delete_industry(
        self,
        industry_id: int,
    ) -> None:
        industry = self.repository.get_by_id(
            industry_id,
        )

        if industry is None:
            raise LookupError(
                "Homepage industry not found",
            )

        self.repository.delete(industry)
