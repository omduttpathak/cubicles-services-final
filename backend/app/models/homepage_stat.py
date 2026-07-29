from sqlalchemy import (
    Boolean,
    Column,
    Integer,
    String,
)

from app.db.base import Base


class HomepageStat(Base):
    __tablename__ = "homepage_stats"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    value = Column(
        String(50),
        nullable=False,
    )

    title = Column(
        String(150),
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
