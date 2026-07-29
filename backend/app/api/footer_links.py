from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.footer_link import PublicFooterLinkResponse
from app.services.footer_link_service import FooterLinkService

router = APIRouter(
    prefix="/api/footer-links",
    tags=["Footer Links"],
)


@router.get(
    "",
    response_model=list[PublicFooterLinkResponse],
)
def get_footer_links(
    db: Session = Depends(get_db),
):
    service = FooterLinkService(db)

    return service.get_public_footer_links()
