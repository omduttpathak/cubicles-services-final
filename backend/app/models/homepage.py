from sqlalchemy import (
    Boolean,
    Column,
    Integer,
    JSON,
    String,
    Text,
)

from app.db.base import Base


class Homepage(Base):
    __tablename__ = "homepage"

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
        Text,
        nullable=False,
    )

    hero_description = Column(
        Text,
        nullable=False,
    )

    primary_button_text = Column(
        String(100),
        nullable=False,
    )

    primary_button_url = Column(
        String(255),
        nullable=False,
    )

    secondary_button_text = Column(
        String(100),
        nullable=False,
    )

    secondary_button_url = Column(
        String(255),
        nullable=False,
    )

    cta_title = Column(
        Text,
        nullable=False,
    )

    cta_description = Column(
        Text,
        nullable=False,
    )

    cta_button_text = Column(
        String(100),
        nullable=False,
    )

    cta_button_url = Column(
        String(255),
        nullable=False,
    )

    seo_title = Column(
        String(255),
        nullable=False,
    )

    seo_description = Column(
        Text,
        nullable=False,
    )

    is_active = Column(
        Boolean,
        nullable=False,
        default=True,
    )

    show_hero = Column(
        Boolean,
        nullable=False,
        default=True,
    )

    services_title = Column(
        String(255),
        nullable=False,
    )

    services_description = Column(
        String(500),
        nullable=False,
    )

    show_services = Column(
        Boolean,
        nullable=False,
        default=True,
    )

    technologies_title = Column(
        String(255),
        nullable=False,
    )

    technologies_description = Column(
        String(500),
        nullable=False,
    )

    show_technologies = Column(
        Boolean,
        nullable=False,
        default=True,
    )

    benefits_title = Column(
        String(255),
        nullable=False,
    )

    benefits_description = Column(
        String(500),
        nullable=False,
    )

    show_benefits = Column(
        Boolean,
        nullable=False,
        default=True,
    )

    industries_title = Column(
        String(255),
        nullable=False,
    )

    industries_description = Column(
        String(500),
        nullable=False,
    )

    show_industries = Column(
        Boolean,
        nullable=False,
        default=True,
    )

    case_studies_title = Column(
        String(255),
        nullable=False,
    )

    case_studies_description = Column(
        String(500),
        nullable=False,
    )

    show_case_studies = Column(
        Boolean,
        nullable=False,
        default=True,
    )

    testimonials_title = Column(
        String(255),
        nullable=False,
    )

    testimonials_description = Column(
        String(500),
        nullable=False,
    )

    show_testimonials = Column(
        Boolean,
        nullable=False,
        default=True,
    )

    stats_title = Column(
        String(255),
        nullable=False,
    )

    stats_description = Column(
        String(500),
        nullable=False,
    )

    show_stats = Column(
        Boolean,
        nullable=False,
        default=True,
    )

    faq_title = Column(
        String(255),
        nullable=False,
    )

    faq_description = Column(
        String(500),
        nullable=False,
    )

    show_faq = Column(
        Boolean,
        nullable=False,
        default=True,
    )

    show_cta = Column(
        Boolean,
        nullable=False,
        default=True,
    )

    section_order = Column(
        JSON,
        nullable=True,
    )
