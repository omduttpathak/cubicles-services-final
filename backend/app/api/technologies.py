from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
)
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.technology import (
    TechnologyDetailsResponse,
    TechnologyListResponse,
)
from app.services.technology_service import (
    TechnologyService,
)

router = APIRouter(
    prefix="/api/technologies",
    tags=["Technologies"],
)


@router.get(
    "",
    response_model=list[TechnologyListResponse],
)
def get_technologies(
    db: Session = Depends(get_db),
):
    service = TechnologyService(db)

    return service.get_technologies()


@router.get(
    "/{slug}",
    response_model=TechnologyDetailsResponse,
)
def get_technology_by_slug(
    slug: str,
    db: Session = Depends(get_db),
):
    service = TechnologyService(db)

    technology = service.get_technology_by_slug(slug)

    if technology is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Technology not found",
        )

    return technology
