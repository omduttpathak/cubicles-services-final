from sqlalchemy import (
    Boolean,
    Column,
    Integer,
    String,
    Text,
)

from app.db.base import Base


class AboutPage(Base):
    __tablename__ = "about_page"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    hero_badge = Column(
        String(255),
        nullable=False,
    )

    hero_title = Column(
        String(500),
        nullable=False,
    )

    hero_description = Column(
        Text,
        nullable=False,
    )

    overview_eyebrow = Column(
        String(255),
        nullable=False,
    )

    overview_title = Column(
        String(500),
        nullable=False,
    )

    overview_description_one = Column(
        Text,
        nullable=False,
    )

    overview_description_two = Column(
        Text,
        nullable=False,
    )

    values_eyebrow = Column(
        String(255),
        nullable=False,
    )

    values_title = Column(
        String(500),
        nullable=False,
    )

    values_description = Column(
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

    show_hero = Column(
        Boolean,
        nullable=False,
        default=True,
    )

    show_overview = Column(
        Boolean,
        nullable=False,
        default=True,
    )

    show_values = Column(
        Boolean,
        nullable=False,
        default=True,
    )

    is_active = Column(
        Boolean,
        nullable=False,
        default=True,
    )
