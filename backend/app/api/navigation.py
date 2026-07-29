from fastapi import (
    APIRouter,
    Depends,
)
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.navigation_item import (
    PublicNavigationItemResponse,
)
from app.services.navigation_item_service import (
    NavigationItemService,
)

router = APIRouter(
    prefix="/api/navigation",
    tags=["Navigation"],
)


@router.get(
    "",
    response_model=list[
        PublicNavigationItemResponse
    ],
)
def get_public_navigation(
    db: Session = Depends(get_db),
):
    service = NavigationItemService(db)

    return service.get_public_navigation()
