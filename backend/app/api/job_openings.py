from fastapi import (
    APIRouter,
    Depends,
)
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.job_opening import (
    PublicJobOpeningResponse,
)
from app.services.job_opening_service import (
    JobOpeningService,
)

router = APIRouter(
    prefix="/api/job-openings",
    tags=["Job Openings"],
)


@router.get(
    "",
    response_model=list[PublicJobOpeningResponse],
)
def get_public_job_openings(
    db: Session = Depends(get_db),
):
    service = JobOpeningService(db)

    return service.get_public_job_openings()
