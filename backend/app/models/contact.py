from sqlalchemy import Boolean, Column, DateTime, Integer, String, Text, func

from app.db.base import Base


class Contact(Base):
    __tablename__ = "contacts"

    id = Column(Integer, primary_key=True, index=True)

    full_name = Column(String(150), nullable=False)

    email = Column(String(255), nullable=False)

    company = Column(String(150))

    phone = Column(String(30))

    service = Column(String(100))

    message = Column(Text, nullable=False)

    is_read = Column(
        Boolean,
        nullable=False,
        server_default="0",
    )

    created_at = Column(
        DateTime,
        server_default=func.now(),
        nullable=False,
    )
