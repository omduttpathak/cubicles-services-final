from sqlalchemy import (
    BigInteger,
    Column,
    DateTime,
    ForeignKey,
    Integer,
    String,
    UniqueConstraint,
    func,
)
from sqlalchemy.dialects.mysql import LONGBLOB

from app.db.base import Base


class MediaAssetVariant(Base):
    __tablename__ = "media_asset_variants"
    __table_args__ = (
        UniqueConstraint(
            "media_asset_id",
            "variant_name",
            name="uq_media_asset_variants_asset_variant",
        ),
    )

    id = Column(BigInteger, primary_key=True, autoincrement=True, index=True)
    media_asset_id = Column(
        BigInteger,
        ForeignKey("media_assets.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    variant_name = Column(String(30), nullable=False, index=True)
    filename = Column(String(255), nullable=False)
    mime_type = Column(String(100), nullable=False)
    extension = Column(String(20), nullable=False)
    file_size = Column(BigInteger, nullable=False)
    width = Column(Integer, nullable=False)
    height = Column(Integer, nullable=False)
    checksum = Column(String(64), nullable=False, index=True)
    file_data = Column(LONGBLOB, nullable=False)
    created_at = Column(DateTime, nullable=False, server_default=func.now())
