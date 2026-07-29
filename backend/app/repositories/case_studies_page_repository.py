from sqlalchemy.orm import Session

from app.models.case_studies_page import CaseStudiesPage
from app.schemas.case_studies_page import (
    CaseStudiesPageUpdate,
)


class CaseStudiesPageRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_active(
        self,
    ) -> CaseStudiesPage | None:
        return (
            self.db.query(CaseStudiesPage)
            .filter(
                CaseStudiesPage.is_active.is_(True),
            )
            .order_by(
                CaseStudiesPage.id.asc(),
            )
            .first()
        )

    def get_settings(
        self,
    ) -> CaseStudiesPage | None:
        return (
            self.db.query(CaseStudiesPage)
            .order_by(
                CaseStudiesPage.id.asc(),
            )
            .first()
        )

    def create(
        self,
        data: CaseStudiesPageUpdate,
    ) -> CaseStudiesPage:
        page = CaseStudiesPage(
            **data.model_dump(),
        )

        self.db.add(page)
        self.db.commit()
        self.db.refresh(page)

        return page

    def update(
        self,
        page: CaseStudiesPage,
        data: CaseStudiesPageUpdate,
    ) -> CaseStudiesPage:
        for field, value in data.model_dump().items():
            setattr(page, field, value)

        self.db.commit()
        self.db.refresh(page)

        return page
