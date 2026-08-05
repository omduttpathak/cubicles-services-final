from datetime import datetime
from typing import Any

from sqlalchemy.orm import Session

from app.models.case_study import CaseStudy
from app.schemas.case_study import (
    CaseStudyCreate,
    CaseStudyUpdate,
)


class CaseStudyRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_published_case_studies(
        self,
    ) -> list[CaseStudy]:
        return (
            self.db.query(CaseStudy)
            .filter(CaseStudy.is_published.is_(True))
            .order_by(CaseStudy.published_at.desc())
            .all()
        )

    def get_published_by_slug(
        self,
        slug: str,
    ) -> CaseStudy | None:
        return (
            self.db.query(CaseStudy)
            .filter(
                CaseStudy.slug == slug,
                CaseStudy.is_published.is_(True),
            )
            .first()
        )

    def get_all(self) -> list[CaseStudy]:
        return self.db.query(CaseStudy).order_by(CaseStudy.created_at.desc()).all()

    def get_by_id(
        self,
        case_study_id: int,
    ) -> CaseStudy | None:
        return self.db.query(CaseStudy).filter(CaseStudy.id == case_study_id).first()

    def get_by_slug(
        self,
        slug: str,
    ) -> CaseStudy | None:
        return self.db.query(CaseStudy).filter(CaseStudy.slug == slug).first()

    def create(
        self,
        data: CaseStudyCreate,
        *,
        extra_fields: dict[str, Any] | None = None,
    ) -> CaseStudy:
        values = data.model_dump()

        if extra_fields:
            values.update(extra_fields)

        case_study = CaseStudy(**values)

        try:
            self.db.add(case_study)
            self.db.commit()
            self.db.refresh(case_study)
            return case_study
        except Exception:
            self.db.rollback()
            raise

    def update(
        self,
        case_study: CaseStudy,
        data: CaseStudyUpdate,
        *,
        extra_fields: dict[str, Any] | None = None,
    ) -> CaseStudy:
        update_data = data.model_dump()

        if extra_fields:
            update_data.update(extra_fields)

        try:
            for field, value in update_data.items():
                setattr(case_study, field, value)

            self.db.commit()
            self.db.refresh(case_study)
            return case_study
        except Exception:
            self.db.rollback()
            raise

    def update_publish_status(
        self,
        case_study: CaseStudy,
        is_published: bool,
    ) -> CaseStudy:
        case_study.is_published = is_published

        if is_published:
            case_study.published_at = datetime.now()

        self.db.commit()
        self.db.refresh(case_study)

        return case_study

    def delete(
        self,
        case_study: CaseStudy,
    ) -> None:
        self.db.delete(case_study)
        self.db.commit()
