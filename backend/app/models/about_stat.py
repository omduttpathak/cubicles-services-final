from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    Integer,
    String,
    func,
)

from app.db.base import Base


class AboutStat(Base):
    __tablename__ = "about_stats"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    value = Column(
        String(50),
        nullable=False,
    )

    label = Column(
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
