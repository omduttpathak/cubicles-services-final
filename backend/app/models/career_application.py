from sqlalchemy import (
    Column,
    DateTime,
    Integer,
    String,
    Text,
    func,
)

from app.db.base import Base


class CareerApplication(Base):
    __tablename__ = "career_applications"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    full_name = Column(
        String(150),
        nullable=False,
    )

    email = Column(
        String(255),
        nullable=False,
        index=True,
    )

    phone = Column(
        String(30),
        nullable=True,
    )

    position = Column(
        String(150),
        nullable=False,
    )

    experience = Column(
        String(100),
        nullable=True,
    )

    current_company = Column(
        String(150),
        nullable=True,
    )

    location = Column(
        String(150),
        nullable=True,
    )

    linkedin_url = Column(
        String(500),
        nullable=True,
    )

    resume_url = Column(
        String(500),
        nullable=True,
    )

    cover_letter = Column(
        Text,
        nullable=True,
    )

    status = Column(
        String(30),
        nullable=False,
        server_default="new",
    )

    created_at = Column(
        DateTime,
        nullable=False,
        server_default=func.now(),
    )

    updated_at = Column(
        DateTime,
        nullable=False,
        server_default=func.now(),
        onupdate=func.now(),
    )
