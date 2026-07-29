from sqlalchemy import (
    Boolean,
    Column,
    Integer,
    String,
)

from app.db.base import Base


class CaseStudiesPage(Base):
    __tablename__ = "case_studies_page"

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

    all_industries_label = Column(
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

    results_heading = Column(
        String(150),
        nullable=False,
    )

    view_button_text = Column(
        String(150),
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

    show_case_studies = Column(
        Boolean,
        nullable=False,
        server_default="1",
    )

    show_results = Column(
        Boolean,
        nullable=False,
        server_default="1",
    )

    show_technologies = Column(
        Boolean,
        nullable=False,
        server_default="1",
    )

    is_active = Column(
        Boolean,
        nullable=False,
        server_default="1",
    )
