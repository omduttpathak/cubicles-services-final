from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
)
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.career_page import CareerPageResponse
from app.services.career_page_service import CareerPageService

router = APIRouter(
    prefix="/api/career-page",
    tags=["Career Page"],
)


@router.get(
    "",
    response_model=CareerPageResponse,
)
def get_career_page(
    db: Session = Depends(get_db),
):
    service = CareerPageService(db)

    settings = service.get_career_page()

    if settings is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Career page settings not found",
        )

    return settings
