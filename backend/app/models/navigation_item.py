from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    Integer,
    String,
    func,
)

from app.db.base import Base


class NavigationItem(Base):
    __tablename__ = "navigation_items"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    title = Column(
        String(100),
        nullable=False,
    )

    url = Column(
        String(500),
        nullable=False,
    )

    open_in_new_tab = Column(
        Boolean,
        nullable=False,
        default=False,
    )

    display_order = Column(
        Integer,
        nullable=False,
        default=0,
        index=True,
    )

    is_visible = Column(
        Boolean,
        nullable=False,
        default=True,
        index=True,
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
