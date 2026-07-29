from sqlalchemy.orm import Session

from app.models.technology_page import TechnologyPage
from app.schemas.technology_page import TechnologyPageUpdate


class TechnologyPageRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_active(
        self,
    ) -> TechnologyPage | None:
        return (
            self.db.query(TechnologyPage)
            .filter(
                TechnologyPage.is_active.is_(True),
            )
            .order_by(
                TechnologyPage.id.asc(),
            )
            .first()
        )

    def get_settings(
        self,
    ) -> TechnologyPage | None:
        return (
            self.db.query(TechnologyPage)
            .order_by(
                TechnologyPage.id.asc(),
            )
            .first()
        )

    def create(
        self,
        data: TechnologyPageUpdate,
    ) -> TechnologyPage:
        page = TechnologyPage(
            **data.model_dump(),
        )

        self.db.add(page)
        self.db.commit()
        self.db.refresh(page)

        return page

    def update(
        self,
        page: TechnologyPage,
        data: TechnologyPageUpdate,
    ) -> TechnologyPage:
        for field, value in data.model_dump().items():
            setattr(page, field, value)

        self.db.commit()
        self.db.refresh(page)

        return page
