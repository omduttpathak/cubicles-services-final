from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
)
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.blog import (
    BlogDetailsResponse,
    BlogListResponse,
)
from app.services.blog_service import BlogService

router = APIRouter(
    prefix="/api/blogs",
    tags=["Blogs"],
)


@router.get(
    "",
    response_model=list[BlogListResponse],
)
def get_blogs(
    db: Session = Depends(get_db),
):
    service = BlogService(db)

    return service.get_blogs()


@router.get(
    "/{slug}",
    response_model=BlogDetailsResponse,
)
def get_blog_by_slug(
    slug: str,
    db: Session = Depends(get_db),
):
    service = BlogService(db)

    blog = service.get_blog_by_slug(slug)

    if blog is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Blog not found",
        )

    return blog
