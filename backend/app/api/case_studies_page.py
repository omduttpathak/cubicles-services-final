from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
)
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.case_studies_page import (
    CaseStudiesPageResponse,
)
from app.services.case_studies_page_service import (
    CaseStudiesPageService,
)

router = APIRouter(
    prefix="/api/case-studies-page",
    tags=["Case Studies Page"],
)


@router.get(
    "",
    response_model=CaseStudiesPageResponse,
)
def get_case_studies_page(
    db: Session = Depends(get_db),
):
    service = CaseStudiesPageService(db)

    page = service.get_case_studies_page()

    if page is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Case Studies page settings not found",
        )

    return page
