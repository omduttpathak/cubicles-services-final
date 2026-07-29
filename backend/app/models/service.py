from sqlalchemy import JSON, Column, Integer, String, Text

from app.db.base import Base


class Service(Base):
    __tablename__ = "services"

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
        String(150),
        unique=True,
        nullable=False,
        index=True,
    )

    icon = Column(
        String(50),
        nullable=False,
    )

    short_description = Column(
        String(500),
        nullable=False,
    )

    description = Column(
        Text,
        nullable=False,
    )

    highlights = Column(
        JSON,
        nullable=False,
    )

    hero_title = Column(
        String(200),
        nullable=False,
    )

    hero_description = Column(
        String(500),
        nullable=False,
    )

    seo_title = Column(
        String(255),
        nullable=False,
    )

    seo_description = Column(
        String(500),
        nullable=False,
    )
