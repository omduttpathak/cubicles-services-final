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


class Blog(Base):
    __tablename__ = "blogs"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    title = Column(
        String(255),
        nullable=False,
    )

    slug = Column(
        String(255),
        unique=True,
        nullable=False,
        index=True,
    )

    category = Column(
        String(100),
        nullable=False,
    )

    excerpt = Column(
        String(500),
        nullable=False,
    )

    content = Column(
        Text,
        nullable=False,
    )

    author = Column(
        String(150),
        nullable=False,
    )

    image_url = Column(
        String(500),
        nullable=True,
    )

    seo_title = Column(
        String(255),
        nullable=False,
    )

    seo_description = Column(
        String(500),
        nullable=False,
    )

    is_published = Column(
        Boolean,
        nullable=False,
        server_default="1",
    )

    published_at = Column(
        DateTime,
        nullable=False,
        server_default=func.now(),
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
