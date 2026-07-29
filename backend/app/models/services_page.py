from sqlalchemy import (
    Boolean,
    Column,
    Integer,
    String,
)

from app.db.base import Base


class ServicesPage(Base):
    __tablename__ = "services_page"

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

    hero_highlight = Column(
        String(255),
        nullable=False,
    )

    hero_description = Column(
        String(1000),
        nullable=False,
    )

    primary_button_text = Column(
        String(100),
        nullable=False,
    )

    primary_button_url = Column(
        String(500),
        nullable=False,
    )

    secondary_button_text = Column(
        String(100),
        nullable=False,
    )

    secondary_button_url = Column(
        String(500),
        nullable=False,
    )

    hero_feature_one = Column(
        String(150),
        nullable=False,
    )

    hero_feature_two = Column(
        String(150),
        nullable=False,
    )

    hero_feature_three = Column(
        String(150),
        nullable=False,
    )

    hero_feature_four = Column(
        String(150),
        nullable=False,
    )

    services_eyebrow = Column(
        String(255),
        nullable=False,
    )

    services_title = Column(
        String(500),
        nullable=False,
    )

    services_description = Column(
        String(1000),
        nullable=False,
    )

    services_empty_title = Column(
        String(255),
        nullable=False,
    )

    services_empty_description = Column(
        String(500),
        nullable=False,
    )

    service_button_text = Column(
        String(100),
        nullable=False,
    )

    benefits_badge = Column(
        String(255),
        nullable=False,
    )

    benefits_title = Column(
        String(500),
        nullable=False,
    )

    benefits_description = Column(
        String(1000),
        nullable=False,
    )

    process_eyebrow = Column(
        String(255),
        nullable=False,
    )

    process_title = Column(
        String(500),
        nullable=False,
    )

    process_description = Column(
        String(1000),
        nullable=False,
    )

    industries_eyebrow = Column(
        String(255),
        nullable=False,
    )

    industries_title = Column(
        String(500),
        nullable=False,
    )

    industries_description = Column(
        String(1000),
        nullable=False,
    )

    cta_title = Column(
        String(500),
        nullable=False,
    )

    cta_description = Column(
        String(1000),
        nullable=False,
    )

    cta_primary_button_text = Column(
        String(100),
        nullable=False,
    )

    cta_primary_button_url = Column(
        String(500),
        nullable=False,
    )

    cta_secondary_button_text = Column(
        String(100),
        nullable=False,
    )

    cta_secondary_button_url = Column(
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

    show_services = Column(
        Boolean,
        nullable=False,
        default=True,
    )

    show_benefits = Column(
        Boolean,
        nullable=False,
        default=True,
    )

    show_process = Column(
        Boolean,
        nullable=False,
        default=True,
    )

    show_stats = Column(
        Boolean,
        nullable=False,
        default=True,
    )

    show_industries = Column(
        Boolean,
        nullable=False,
        default=True,
    )

    show_cta = Column(
        Boolean,
        nullable=False,
        default=True,
    )

    is_active = Column(
        Boolean,
        nullable=False,
        default=True,
    )
