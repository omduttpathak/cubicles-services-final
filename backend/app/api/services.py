from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
)
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.service import ServiceResponse
from app.services.service_service import ServiceService

router = APIRouter(
    prefix="/api/services",
    tags=["Services"],
)


@router.get(
    "",
    response_model=list[ServiceResponse],
)
def get_services(
    db: Session = Depends(get_db),
):
    service = ServiceService(db)

    return service.get_services()


@router.get(
    "/{slug}",
    response_model=ServiceResponse,
)
def get_service_by_slug(
    slug: str,
    db: Session = Depends(get_db),
):
    service = ServiceService(db)

    result = service.get_service_by_slug(slug)

    if result is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Service not found",
        )

    return result
