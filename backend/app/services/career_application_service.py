from pathlib import Path
from sqlalchemy.orm import Session

from app.models.career_application import (
    CareerApplication,
)
from app.repositories.career_application_repository import (
    CareerApplicationRepository,
)
from app.schemas.career_application import (
    CareerApplicationCreate,
    CareerApplicationStatus,
)


class CareerApplicationService:
    def __init__(self, db: Session):
        self.repository = CareerApplicationRepository(db)

    def create_application(
        self,
        data: CareerApplicationCreate,
    ) -> CareerApplication:
        normalized_data = data.model_copy(
            update={
                "full_name": data.full_name.strip(),
                "email": str(data.email).strip().lower(),
                "phone": (data.phone.strip() if data.phone else None),
                "position": data.position.strip(),
                "experience": (data.experience.strip() if data.experience else None),
                "current_company": (
                    data.current_company.strip() if data.current_company else None
                ),
                "location": (data.location.strip() if data.location else None),
                "linkedin_url": (
                    data.linkedin_url.strip() if data.linkedin_url else None
                ),
                "resume_url": (data.resume_url.strip() if data.resume_url else None),
                "cover_letter": (
                    data.cover_letter.strip() if data.cover_letter else None
                ),
            },
        )

        return self.repository.create(
            normalized_data,
        )

    def get_admin_applications(
        self,
    ) -> list[CareerApplication]:
        return self.repository.get_all()

    def get_admin_application_by_id(
        self,
        application_id: int,
    ) -> CareerApplication | None:
        return self.repository.get_by_id(
            application_id,
        )

    def update_application_status(
        self,
        application_id: int,
        new_status: CareerApplicationStatus,
    ) -> CareerApplication:
        application = self.repository.get_by_id(
            application_id,
        )

        if application is None:
            raise LookupError(
                "Career application not found",
            )

        return self.repository.update_status(
            application,
            new_status,
        )

    def delete_application(
        self,
        application_id: int,
    ) -> None:
        application = self.repository.get_by_id(
            application_id,
        )

        if application is None:
            raise LookupError(
                "Career application not found",
            )

        resume_url = application.resume_url

        self.repository.delete(application)

        if resume_url:
            relative_path = resume_url.lstrip("/")

            resume_path = Path(relative_path)

            try:
                if resume_path.exists() and resume_path.is_file():
                    resume_path.unlink()
            except OSError as error:
                print(
                    "Unable to delete résumé file:",
                    error,
                )
