from fastapi import (
    APIRouter,
    Depends,
)
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.homepage_benefit import (
    HomepageBenefitResponse,
)
from app.services.homepage_benefit_service import (
    HomepageBenefitService,
)

router = APIRouter(
    prefix="/api/homepage-benefits",
    tags=["Homepage Benefits"],
)


@router.get(
    "",
    response_model=list[HomepageBenefitResponse],
)
def get_homepage_benefits(
    db: Session = Depends(get_db),
):
    service = HomepageBenefitService(db)

    return service.get_benefits()
