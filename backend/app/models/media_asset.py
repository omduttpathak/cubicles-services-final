from sqlalchemy import (
    BigInteger,
    Column,
    DateTime,
    Integer,
    String,
    Text,
    func,
)
from sqlalchemy.dialects.mysql import LONGBLOB

from app.db.base import Base


class MediaAsset(Base):
    __tablename__ = "media_assets"

    id = Column(
        BigInteger,
        primary_key=True,
        autoincrement=True,
        index=True,
    )

    public_id = Column(
        String(36),
        unique=True,
        nullable=False,
        index=True,
    )

    filename = Column(
        String(255),
        nullable=False,
    )

    original_filename = Column(
        String(255),
        nullable=False,
    )

    mime_type = Column(
        String(100),
        nullable=False,
        index=True,
    )

    extension = Column(
        String(20),
        nullable=False,
    )

    file_size = Column(
        BigInteger,
        nullable=False,
    )

    width = Column(
        Integer,
        nullable=True,
    )

    height = Column(
        Integer,
        nullable=True,
    )

    checksum = Column(
        String(64),
        nullable=False,
        index=True,
    )

    title = Column(
        String(255),
        nullable=True,
    )

    alt_text = Column(
        String(500),
        nullable=True,
    )

    description = Column(
        Text,
        nullable=True,
    )

    file_data = Column(
        LONGBLOB,
        nullable=False,
    )

    created_at = Column(
        DateTime,
        nullable=False,
        server_default=func.now(),
    )

    updated_at = Column(
        DateTime,
        nullable=False,
        server_default=func.now(),
        onupdate=func.now(),
    )
