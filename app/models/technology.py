from sqlalchemy import BigInteger, Boolean, Column, DateTime, ForeignKey, Integer, String, Text, func
from sqlalchemy.orm import relationship
from app.db.base import Base

class Technology(Base):
    __tablename__ = "technologies"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False)
    slug = Column(String(150), unique=True, nullable=False, index=True)
    category = Column(String(100), nullable=False, index=True)
    icon = Column(String(100), nullable=False)
    logo_url = Column(String(500), nullable=True)
    logo_media_id = Column(BigInteger, ForeignKey("media_assets.id", ondelete="SET NULL"), nullable=True, index=True)
    description = Column(Text, nullable=False)
    display_order = Column(Integer, nullable=False, server_default="0")
    is_featured = Column(Boolean, nullable=False, server_default="0")
    is_active = Column(Boolean, nullable=False, server_default="1")
    seo_title = Column(String(255), nullable=False)
    seo_description = Column(String(500), nullable=False)
    created_at = Column(DateTime, nullable=False, server_default=func.now())
    updated_at = Column(DateTime, nullable=False, server_default=func.now(), onupdate=func.now())
    logo_media = relationship("MediaAsset", passive_deletes=True)
