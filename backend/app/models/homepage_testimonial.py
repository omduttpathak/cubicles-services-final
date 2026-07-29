from sqlalchemy import (
    Boolean,
    Column,
    Integer,
    String,
    Text,
)

from app.db.base import Base


class HomepageTestimonial(Base):
    __tablename__ = "homepage_testimonials"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    name = Column(
        String(150),
        nullable=False,
    )

    designation = Column(
        String(200),
        nullable=False,
    )

    content = Column(
        Text,
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
