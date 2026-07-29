from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    Integer,
    JSON,
    String,
    Text,
    func,
)

from app.db.base import Base


class JobOpening(Base):
    __tablename__ = "job_openings"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    title = Column(
        String(150),
        nullable=False,
    )

    slug = Column(
        String(180),
        nullable=False,
        unique=True,
        index=True,
    )

    location = Column(
        String(150),
        nullable=False,
    )

    employment_type = Column(
        String(100),
        nullable=False,
    )

    experience = Column(
        String(100),
        nullable=False,
    )

    short_description = Column(
        String(1000),
        nullable=False,
    )

    description = Column(
        Text,
        nullable=True,
    )

    responsibilities = Column(
        JSON,
        nullable=True,
    )

    requirements = Column(
        JSON,
        nullable=True,
    )

    skills = Column(
        JSON,
        nullable=True,
    )

    display_order = Column(
        Integer,
        nullable=False,
        default=0,
    )

    is_active = Column(
        Boolean,
        nullable=False,
        default=True,
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
