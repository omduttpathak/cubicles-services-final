from sqlalchemy.orm import Session

from app.repositories.contact_repository import ContactRepository
from app.schemas.contact import ContactCreate


class ContactService:
    def __init__(self, db: Session):
        self.repository = ContactRepository(db)

    def create_contact(self, contact: ContactCreate):
        return self.repository.create(contact)
