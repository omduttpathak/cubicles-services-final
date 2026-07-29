from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
)
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.case_study import (
    CaseStudyDetailsResponse,
    CaseStudyListResponse,
)
from app.services.case_study_service import (
    CaseStudyService,
)

router = APIRouter(
    prefix="/api/case-studies",
    tags=["Case Studies"],
)


@router.get(
    "",
    response_model=list[CaseStudyListResponse],
)
def get_case_studies(
    db: Session = Depends(get_db),
):
    service = CaseStudyService(db)

    return service.get_case_studies()


@router.get(
    "/{slug}",
    response_model=CaseStudyDetailsResponse,
)
def get_case_study_by_slug(
    slug: str,
    db: Session = Depends(get_db),
):
    service = CaseStudyService(db)

    case_study = service.get_case_study_by_slug(slug)

    if case_study is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Case study not found",
        )

    return case_study
