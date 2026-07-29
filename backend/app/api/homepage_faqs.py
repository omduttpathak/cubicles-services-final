from fastapi import (
    APIRouter,
    Depends,
)
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.homepage_faq import (
    HomepageFaqResponse,
)
from app.services.homepage_faq_service import (
    HomepageFaqService,
)

router = APIRouter(
    prefix="/api/homepage-faqs",
    tags=["Homepage FAQs"],
)


@router.get(
    "",
    response_model=list[HomepageFaqResponse],
)
def get_homepage_faqs(
    db: Session = Depends(get_db),
):
    service = HomepageFaqService(db)

    return service.get_faqs()
