from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
)
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.homepage import HomepageResponse
from app.services.homepage_service import (
    HomepageService,
)

router = APIRouter(
    prefix="/api/homepage",
    tags=["Homepage"],
)


@router.get(
    "",
    response_model=HomepageResponse,
)
def get_homepage(
    db: Session = Depends(get_db),
):
    service = HomepageService(db)

    homepage = service.get_homepage()

    if homepage is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Homepage settings not found",
        )

    return homepage
