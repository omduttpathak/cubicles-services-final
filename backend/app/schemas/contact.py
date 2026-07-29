from pydantic import BaseModel, EmailStr


class ContactCreate(BaseModel):
    full_name: str
    email: EmailStr
    company: str | None = None
    phone: str | None = None
    service: str | None = None
    message: str
