from fastapi import (
    APIRouter,
    Depends,
)
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.homepage_testimonial import (
    HomepageTestimonialResponse,
)
from app.services.homepage_testimonial_service import (
    HomepageTestimonialService,
)

router = APIRouter(
    prefix="/api/homepage-testimonials",
    tags=["Homepage Testimonials"],
)


@router.get(
    "",
    response_model=list[HomepageTestimonialResponse],
)
def get_homepage_testimonials(
    db: Session = Depends(get_db),
):
    service = HomepageTestimonialService(db)

    return service.get_testimonials()
