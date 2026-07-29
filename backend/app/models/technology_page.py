from sqlalchemy import Boolean, Column, Integer, String

from app.db.base import Base


class TechnologyPage(Base):
    __tablename__ = "technology_page"

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
        String(1000),
        nullable=False,
    )

    featured_eyebrow = Column(
        String(255),
        nullable=False,
    )

    featured_title = Column(
        String(500),
        nullable=False,
    )

    featured_description = Column(
        String(1000),
        nullable=False,
    )

    categories_eyebrow = Column(
        String(255),
        nullable=False,
    )

    categories_title = Column(
        String(500),
        nullable=False,
    )

    categories_description = Column(
        String(1000),
        nullable=False,
    )

    empty_title = Column(
        String(255),
        nullable=False,
    )

    empty_description = Column(
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
        server_default="1",
    )

    show_featured = Column(
        Boolean,
        nullable=False,
        server_default="1",
    )

    show_categories = Column(
        Boolean,
        nullable=False,
        server_default="1",
    )

    is_active = Column(
        Boolean,
        nullable=False,
        server_default="1",
    )
