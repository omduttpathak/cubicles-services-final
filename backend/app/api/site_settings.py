from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
)
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.site_setting import (
    SiteSettingResponse,
)
from app.services.site_setting_service import (
    SiteSettingService,
)

router = APIRouter(
    prefix="/api/site-settings",
    tags=["Site Settings"],
)


@router.get(
    "",
    response_model=SiteSettingResponse,
)
def get_site_settings(
    db: Session = Depends(get_db),
):
    service = SiteSettingService(db)

    settings = service.get_site_settings()

    if settings is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Site settings not found",
        )

    return settings
