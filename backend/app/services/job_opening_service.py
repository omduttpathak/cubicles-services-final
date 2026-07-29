from sqlalchemy.orm import Session

from app.models.job_opening import JobOpening
from app.repositories.job_opening_repository import (
    JobOpeningRepository,
)
from app.schemas.job_opening import (
    JobOpeningCreate,
    JobOpeningUpdate,
)


class JobOpeningService:
    def __init__(self, db: Session):
        self.repository = JobOpeningRepository(db)

    def get_public_job_openings(
        self,
    ) -> list[JobOpening]:
        return self.repository.get_public()

    def get_admin_job_openings(
        self,
    ) -> list[JobOpening]:
        return self.repository.get_all()

    def get_admin_job_opening_by_id(
        self,
        job_id: int,
    ) -> JobOpening | None:
        return self.repository.get_by_id(job_id)

    def create_job_opening(
        self,
        data: JobOpeningCreate,
    ) -> JobOpening:
        normalized = self._normalize_create(data)

        existing = self.repository.get_by_slug(normalized.slug)

        if existing is not None:
            raise ValueError("A job opening with this slug already exists")

        return self.repository.create(normalized)

    def update_job_opening(
        self,
        job_id: int,
        data: JobOpeningUpdate,
    ) -> JobOpening:
        job = self.repository.get_by_id(job_id)

        if job is None:
            raise LookupError("Job opening not found")

        normalized = self._normalize_update(data)

        existing = self.repository.get_by_slug(normalized.slug)

        if existing is not None and existing.id != job_id:
            raise ValueError("A job opening with this slug already exists")

        return self.repository.update(
            job,
            normalized,
        )

    def delete_job_opening(
        self,
        job_id: int,
    ) -> None:
        job = self.repository.get_by_id(job_id)

        if job is None:
            raise LookupError("Job opening not found")

        self.repository.delete(job)

    @staticmethod
    def _normalize_create(
        data: JobOpeningCreate,
    ) -> JobOpeningCreate:
        return data.model_copy(
            update={
                "title": data.title.strip(),
                "slug": data.slug.strip().lower(),
                "location": data.location.strip(),
                "employment_type": data.employment_type.strip(),
                "experience": data.experience.strip(),
                "short_description": data.short_description.strip(),
                "description": (
                    data.description.strip()
                    if data.description
                    else None
                ),
                "responsibilities": JobOpeningService._normalize_list(
                    data.responsibilities
                ),
                "requirements": JobOpeningService._normalize_list(
                    data.requirements
                ),
                "skills": JobOpeningService._normalize_list(data.skills),
            },
        )

    @staticmethod
    def _normalize_update(
        data: JobOpeningUpdate,
    ) -> JobOpeningUpdate:
        return data.model_copy(
            update={
                "title": data.title.strip(),
                "slug": data.slug.strip().lower(),
                "location": data.location.strip(),
                "employment_type": data.employment_type.strip(),
                "experience": data.experience.strip(),
                "short_description": data.short_description.strip(),
                "description": (
                    data.description.strip()
                    if data.description
                    else None
                ),
                "responsibilities": JobOpeningService._normalize_list(
                    data.responsibilities
                ),
                "requirements": JobOpeningService._normalize_list(
                    data.requirements
                ),
                "skills": JobOpeningService._normalize_list(data.skills),
            },
        )

    @staticmethod
    def _normalize_list(
        values: list[str],
    ) -> list[str]:
        normalized: list[str] = []

        for value in values:
            item = value.strip()

            if item and item not in normalized:
                normalized.append(item)

        return normalized


    def update_display_order(
        self,
        job_ids: list[int],
    ) -> list[JobOpening]:
        if len(job_ids) != len(set(job_ids)):
            raise ValueError(
                "Job opening IDs must not contain duplicates",
            )

        jobs = self.repository.get_all()
    
        jobs_by_id = {
            job.id: job
            for job in jobs
        }

        missing_ids = [
            job_id
            for job_id in job_ids
            if job_id not in jobs_by_id
        ]

        if missing_ids:
            raise LookupError(
                "One or more job openings were not found",
            )

        existing_ids = set(jobs_by_id)
        submitted_ids = set(job_ids)

        if existing_ids != submitted_ids:
            raise ValueError(
                "The order request must include every job opening",
            )

        for display_order, job_id in enumerate(
            job_ids,
            start=1,
        ):
            jobs_by_id[job_id].display_order = display_order

        self.repository.save()

        return self.repository.get_all()
