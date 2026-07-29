from sqlalchemy import (
    Boolean,
    Column,
    Integer,
    String,
    Text,
)

from app.db.base import Base


class HomepageIndustry(Base):
    __tablename__ = "homepage_industries"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    title = Column(
        String(150),
        nullable=False,
    )

    description = Column(
        Text,
        nullable=False,
    )

    icon = Column(
        String(80),
        nullable=False,
    )

    display_order = Column(
        Integer,
        nullable=False,
        default=0,
    )

    is_active = Column(
        Boolean,
        nullable=False,
        default=True,
    )
