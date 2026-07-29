from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
)
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.about_page import AboutPageResponse
from app.schemas.about_stat import AboutStatResponse
from app.schemas.about_value import AboutValueResponse
from app.services.about_page_service import AboutPageService
from app.services.about_stat_service import AboutStatService
from app.services.about_value_service import AboutValueService

router = APIRouter(
    prefix="/api/about",
    tags=["About"],
)


@router.get(
    "",
    response_model=AboutPageResponse,
)
def get_about_page(
    db: Session = Depends(get_db),
):
    about = AboutPageService(db).get_about_page()

    if about is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="About page settings not found.",
        )

    return about


@router.get(
    "/stats",
    response_model=list[AboutStatResponse],
)
def get_about_stats(
    db: Session = Depends(get_db),
):
    return AboutStatService(db).get_about_stats()


@router.get(
    "/values",
    response_model=list[AboutValueResponse],
)
def get_about_values(
    db: Session = Depends(get_db),
):
    return AboutValueService(db).get_about_values()
