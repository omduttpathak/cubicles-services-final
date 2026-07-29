from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
)
from sqlalchemy.orm import Session

from app.core.database import get_db

from app.schemas.contact_page import (
    ContactPageResponse,
)

from app.services.contact_page_service import (
    ContactPageService,
)

router = APIRouter(
    prefix="/api/contact-page",
    tags=["Contact Page"],
)


@router.get(
    "",
    response_model=ContactPageResponse,
)
def get_contact_page(
    db: Session = Depends(get_db),
):
    service = ContactPageService(db)

    settings = service.get_contact_page()

    if settings is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Contact page settings not found",
        )

    return settings
