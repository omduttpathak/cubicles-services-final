from fastapi import (
    APIRouter,
    Depends,
)
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.homepage_stat import (
    HomepageStatResponse,
)
from app.services.homepage_stat_service import (
    HomepageStatService,
)

router = APIRouter(
    prefix="/api/homepage-stats",
    tags=["Homepage Statistics"],
)


@router.get(
    "",
    response_model=list[HomepageStatResponse],
)
def get_homepage_stats(
    db: Session = Depends(get_db),
):
    service = HomepageStatService(db)

    return service.get_stats()
