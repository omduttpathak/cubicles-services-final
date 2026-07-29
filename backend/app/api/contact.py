from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.contact import ContactCreate
from app.services.contact_service import ContactService

router = APIRouter(
    prefix="/api/contact",
    tags=["Contact"],
)


@router.post(
    "",
    status_code=status.HTTP_201_CREATED,
)
def create_contact(
    contact: ContactCreate,
    db: Session = Depends(get_db),
):
    service = ContactService(db)

    saved_contact = service.create_contact(contact)

    return {
        "message": "Contact message submitted successfully.",
        "id": saved_contact.id,
    }
