from sqlalchemy import (
    Boolean,
    Column,
    Integer,
    Text,
)

from app.db.base import Base


class HomepageFaq(Base):
    __tablename__ = "homepage_faqs"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    question = Column(
        Text,
        nullable=False,
    )

    answer = Column(
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
