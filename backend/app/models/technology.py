from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    Integer,
    String,
    Text,
    func,
)

from app.db.base import Base


class Technology(Base):
    __tablename__ = "technologies"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    name = Column(
        String(150),
        nullable=False,
    )

    slug = Column(
        String(150),
        unique=True,
        nullable=False,
        index=True,
    )

    category = Column(
        String(100),
        nullable=False,
        index=True,
    )

    icon = Column(
        String(100),
        nullable=False,
    )

    logo_url = Column(
        String(500),
        nullable=True,
    )

    description = Column(
        Text,
        nullable=False,
    )

    display_order = Column(
        Integer,
        nullable=False,
        server_default="0",
    )

    is_featured = Column(
        Boolean,
        nullable=False,
        server_default="0",
    )

    is_active = Column(
        Boolean,
        nullable=False,
        server_default="1",
    )

    seo_title = Column(
        String(255),
        nullable=False,
    )

    seo_description = Column(
        String(500),
        nullable=False,
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
