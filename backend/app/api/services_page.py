from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
)
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.services_page import (
    ServicesPageResponse,
)
from app.services.services_page_service import (
    ServicesPageService,
)

router = APIRouter(
    prefix="/api/services-page",
    tags=["Services Page"],
)


@router.get(
    "",
    response_model=ServicesPageResponse,
)
def get_services_page(
    db: Session = Depends(get_db),
):
    service = ServicesPageService(db)

    page = service.get_services_page()

    if page is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Services page not found",
        )

    return page
