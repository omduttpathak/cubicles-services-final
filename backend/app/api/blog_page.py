from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
)
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.blog_page import BlogPageResponse
from app.services.blog_page_service import BlogPageService

router = APIRouter(
    prefix="/api/blog-page",
    tags=["Blog Page"],
)


@router.get(
    "",
    response_model=BlogPageResponse,
)
def get_blog_page(
    db: Session = Depends(get_db),
):
    service = BlogPageService(db)

    page = service.get_blog_page()

    if page is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Blog page settings not found",
        )

    return page
