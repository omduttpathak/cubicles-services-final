from sqlalchemy.orm import Session

from app.models.job_opening import JobOpening
from app.schemas.job_opening import (
    JobOpeningCreate,
    JobOpeningUpdate,
)


class JobOpeningRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_public(
        self,
    ) -> list[JobOpening]:
        return (
            self.db.query(JobOpening)
            .filter(JobOpening.is_active.is_(True))
            .order_by(
                JobOpening.display_order.asc(),
                JobOpening.id.asc(),
            )
            .all()
        )

    def get_all(
        self,
    ) -> list[JobOpening]:
        return (
            self.db.query(JobOpening)
            .order_by(
                JobOpening.display_order.asc(),
                JobOpening.id.asc(),
            )
            .all()
        )

    def get_by_id(
        self,
        job_id: int,
    ) -> JobOpening | None:
        return (
            self.db.query(JobOpening)
            .filter(JobOpening.id == job_id)
            .first()
        )

    def get_by_slug(
        self,
        slug: str,
    ) -> JobOpening | None:
        return (
            self.db.query(JobOpening)
            .filter(JobOpening.slug == slug)
            .first()
        )

    def create(
        self,
        data: JobOpeningCreate,
    ) -> JobOpening:
        job = JobOpening(
            **data.model_dump(),
        )

        self.db.add(job)
        self.db.commit()
        self.db.refresh(job)

        return job

    def update(
        self,
        job: JobOpening,
        data: JobOpeningUpdate,
    ) -> JobOpening:
        for field, value in data.model_dump().items():
            setattr(job, field, value)

        self.db.commit()
        self.db.refresh(job)

        return job

    def delete(
        self,
        job: JobOpening,
    ) -> None:
        self.db.delete(job)
        self.db.commit()

    def save(
        self,
    ) -> None:
        self.db.commit()
