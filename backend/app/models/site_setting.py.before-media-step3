from sqlalchemy import (
    Boolean,
    Column,
    Integer,
    String,
    Text,
)

from app.db.base import Base


class SiteSetting(Base):
    __tablename__ = "site_settings"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    company_name = Column(
        String(150),
        nullable=False,
    )

    logo_url = Column(
        String(500),
        nullable=True,
    )

    favicon_url = Column(
        String(500),
        nullable=True,
    )

    contact_email = Column(
        String(255),
        nullable=False,
    )

    contact_phone = Column(
        String(50),
        nullable=True,
    )

    address = Column(
        Text,
        nullable=True,
    )

    footer_description = Column(
        Text,
        nullable=False,
    )

    copyright_text = Column(
        String(255),
        nullable=False,
    )

    linkedin_url = Column(
        String(500),
        nullable=True,
    )

    facebook_url = Column(
        String(500),
        nullable=True,
    )

    twitter_url = Column(
        String(500),
        nullable=True,
    )

    youtube_url = Column(
        String(500),
        nullable=True,
    )

    is_active = Column(
        Boolean,
        nullable=False,
        default=True,
    )
