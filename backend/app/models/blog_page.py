from sqlalchemy import (
    Boolean,
    Column,
    Integer,
    String,
)

from app.db.base import Base


class BlogPage(Base):
    __tablename__ = "blog_page"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    hero_eyebrow = Column(
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

    search_placeholder = Column(
        String(255),
        nullable=False,
    )

    all_categories_label = Column(
        String(150),
        nullable=False,
    )

    clear_filters_text = Column(
        String(150),
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

    filtered_empty_description = Column(
        String(500),
        nullable=False,
    )

    read_button_text = Column(
        String(150),
        nullable=False,
    )

    author_prefix = Column(
        String(100),
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

    show_filters = Column(
        Boolean,
        nullable=False,
        server_default="1",
    )

    show_articles = Column(
        Boolean,
        nullable=False,
        server_default="1",
    )

    show_author = Column(
        Boolean,
        nullable=False,
        server_default="1",
    )

    show_date = Column(
        Boolean,
        nullable=False,
        server_default="1",
    )

    is_active = Column(
        Boolean,
        nullable=False,
        server_default="1",
    )
