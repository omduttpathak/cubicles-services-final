from sqlalchemy.orm import Session

from app.models.contact import Contact
from app.schemas.contact import ContactCreate


class ContactRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, contact: ContactCreate):
        db_contact = Contact(**contact.model_dump())

        self.db.add(db_contact)

        self.db.commit()

        self.db.refresh(db_contact)

        return db_contact
