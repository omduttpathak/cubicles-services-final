from sqlalchemy import (
    Boolean,
    Column,
    Integer,
    String,
)

from app.db.base import Base


class CareerPage(Base):
    __tablename__ = "career_page"

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

    openings_eyebrow = Column(
        String(255),
        nullable=False,
    )

    openings_title = Column(
        String(500),
        nullable=False,
    )

    openings_description = Column(
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

    apply_button_text = Column(
        String(100),
        nullable=False,
    )

    application_eyebrow = Column(
        String(255),
        nullable=False,
    )

    application_title_prefix = Column(
        String(255),
        nullable=False,
    )

    application_description = Column(
        String(500),
        nullable=False,
    )

    full_name_label = Column(
        String(100),
        nullable=False,
    )

    email_label = Column(
        String(100),
        nullable=False,
    )

    phone_label = Column(
        String(100),
        nullable=False,
    )

    position_label = Column(
        String(100),
        nullable=False,
    )

    experience_label = Column(
        String(100),
        nullable=False,
    )

    company_label = Column(
        String(100),
        nullable=False,
    )

    location_label = Column(
        String(100),
        nullable=False,
    )

    linkedin_label = Column(
        String(100),
        nullable=False,
    )

    resume_label = Column(
        String(100),
        nullable=False,
    )

    cover_letter_label = Column(
        String(100),
        nullable=False,
    )

    resume_upload_title = Column(
        String(150),
        nullable=False,
    )

    resume_upload_description = Column(
        String(255),
        nullable=False,
    )

    cancel_button_text = Column(
        String(100),
        nullable=False,
    )

    submit_button_text = Column(
        String(100),
        nullable=False,
    )

    submitting_button_text = Column(
        String(100),
        nullable=False,
    )

    success_message = Column(
        String(255),
        nullable=False,
    )

    error_message = Column(
        String(255),
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

    show_openings = Column(
        Boolean,
        nullable=False,
        default=True,
    )

    is_active = Column(
        Boolean,
        nullable=False,
        default=True,
    )
