from datetime import datetime

from sqlalchemy.orm import Session

from app.models.case_study import CaseStudy
from app.repositories.case_study_repository import (
    CaseStudyRepository,
)
from app.schemas.case_study import (
    CaseStudyCreate,
    CaseStudyUpdate,
)


class CaseStudyService:
    def __init__(self, db: Session):
        self.repository = CaseStudyRepository(db)

    def get_case_studies(
        self,
    ) -> list[CaseStudy]:
        return self.repository.get_published_case_studies()

    def get_case_study_by_slug(
        self,
        slug: str,
    ) -> CaseStudy | None:
        return self.repository.get_published_by_slug(
            slug,
        )

    def get_admin_case_studies(
        self,
    ) -> list[CaseStudy]:
        return self.repository.get_all()

    def get_admin_case_study_by_id(
        self,
        case_study_id: int,
    ) -> CaseStudy | None:
        return self.repository.get_by_id(
            case_study_id,
        )

    def create_case_study(
        self,
        data: CaseStudyCreate,
    ) -> CaseStudy:
        normalized_slug = data.slug.strip().lower()

        existing_case_study = self.repository.get_by_slug(
            normalized_slug,
        )

        if existing_case_study is not None:
            raise ValueError(
                "A case study with this slug already exists",
            )

        normalized_results = [
            result.strip() for result in data.results if result.strip()
        ]

        normalized_technologies = [
            technology.strip() for technology in data.technologies if technology.strip()
        ]

        if not normalized_results:
            raise ValueError(
                "At least one result is required",
            )

        if not normalized_technologies:
            raise ValueError(
                "At least one technology is required",
            )

        normalized_data = data.model_copy(
            update={
                "title": data.title.strip(),
                "slug": normalized_slug,
                "industry": data.industry.strip(),
                "service": data.service.strip(),
                "summary": data.summary.strip(),
                "challenge": data.challenge.strip(),
                "solution": data.solution.strip(),
                "results": normalized_results,
                "technologies": normalized_technologies,
                "image_url": (data.image_url.strip() if data.image_url else None),
                "seo_title": data.seo_title.strip(),
                "seo_description": (data.seo_description.strip()),
                "published_at": (data.published_at or datetime.now()),
            },
        )

        return self.repository.create(
            normalized_data,
        )

    def update_case_study(
        self,
        case_study_id: int,
        data: CaseStudyUpdate,
    ) -> CaseStudy:
        case_study = self.repository.get_by_id(
            case_study_id,
        )

        if case_study is None:
            raise LookupError("Case study not found")

        normalized_slug = data.slug.strip().lower()

        existing_case_study = self.repository.get_by_slug(
            normalized_slug,
        )

        if existing_case_study is not None and existing_case_study.id != case_study_id:
            raise ValueError(
                "A case study with this slug already exists",
            )

        normalized_results = [
            result.strip() for result in data.results if result.strip()
        ]

        normalized_technologies = [
            technology.strip() for technology in data.technologies if technology.strip()
        ]

        if not normalized_results:
            raise ValueError(
                "At least one result is required",
            )

        if not normalized_technologies:
            raise ValueError(
                "At least one technology is required",
            )

        normalized_data = data.model_copy(
            update={
                "title": data.title.strip(),
                "slug": normalized_slug,
                "industry": data.industry.strip(),
                "service": data.service.strip(),
                "summary": data.summary.strip(),
                "challenge": data.challenge.strip(),
                "solution": data.solution.strip(),
                "results": normalized_results,
                "technologies": normalized_technologies,
                "image_url": (data.image_url.strip() if data.image_url else None),
                "seo_title": data.seo_title.strip(),
                "seo_description": (data.seo_description.strip()),
            },
        )

        return self.repository.update(
            case_study,
            normalized_data,
        )

    def update_publish_status(
        self,
        case_study_id: int,
        is_published: bool,
    ) -> CaseStudy:
        case_study = self.repository.get_by_id(
            case_study_id,
        )

        if case_study is None:
            raise LookupError("Case study not found")

        return self.repository.update_publish_status(
            case_study,
            is_published,
        )

    def delete_case_study(
        self,
        case_study_id: int,
    ) -> None:
        case_study = self.repository.get_by_id(
            case_study_id,
        )

        if case_study is None:
            raise LookupError("Case study not found")

        self.repository.delete(case_study)
