from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
)
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.technology_page import (
    TechnologyPageResponse,
)
from app.services.technology_page_service import (
    TechnologyPageService,
)

router = APIRouter(
    prefix="/api/technology-page",
    tags=["Technology Page"],
)


@router.get(
    "",
    response_model=TechnologyPageResponse,
)
def get_technology_page(
    db: Session = Depends(get_db),
):
    service = TechnologyPageService(db)

    page = service.get_technology_page()

    if page is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Technology page settings not found",
        )

    return page
