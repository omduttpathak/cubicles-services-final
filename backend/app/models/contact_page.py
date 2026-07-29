from sqlalchemy import (
    Boolean,
    Column,
    Integer,
    String,
)

from app.db.base import Base


class ContactPage(Base):
    __tablename__ = "contact_page"

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

    form_title = Column(
        String(255),
        nullable=False,
    )

    form_description = Column(
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

    company_label = Column(
        String(100),
        nullable=False,
    )

    phone_label = Column(
        String(100),
        nullable=False,
    )

    service_label = Column(
        String(100),
        nullable=False,
    )

    message_label = Column(
        String(100),
        nullable=False,
    )

    service_placeholder = Column(
        String(150),
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

    show_breadcrumb = Column(
        Boolean,
        nullable=False,
        default=True,
    )

    show_form = Column(
        Boolean,
        nullable=False,
        default=True,
    )

    is_active = Column(
        Boolean,
        nullable=False,
        default=True,
    )
