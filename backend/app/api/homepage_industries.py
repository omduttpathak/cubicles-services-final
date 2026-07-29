from fastapi import (
    APIRouter,
    Depends,
)
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.homepage_industry import (
    HomepageIndustryResponse,
)
from app.services.homepage_industry_service import (
    HomepageIndustryService,
)

router = APIRouter(
    prefix="/api/homepage-industries",
    tags=["Homepage Industries"],
)


@router.get(
    "",
    response_model=list[HomepageIndustryResponse],
)
def get_homepage_industries(
    db: Session = Depends(get_db),
):
    service = HomepageIndustryService(db)

    return service.get_industries()
