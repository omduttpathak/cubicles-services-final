from sqlalchemy.orm import Session

from app.models.homepage_faq import HomepageFaq
from app.schemas.homepage_faq import (
    HomepageFaqCreate,
    HomepageFaqUpdate,
)


class HomepageFaqRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_active(
        self,
    ) -> list[HomepageFaq]:
        return (
            self.db.query(HomepageFaq)
            .filter(
                HomepageFaq.is_active.is_(True),
            )
            .order_by(
                HomepageFaq.display_order.asc(),
                HomepageFaq.id.asc(),
            )
            .all()
        )

    def get_all(
        self,
    ) -> list[HomepageFaq]:
        return (
            self.db.query(HomepageFaq)
            .order_by(
                HomepageFaq.display_order.asc(),
                HomepageFaq.id.asc(),
            )
            .all()
        )

    def get_by_id(
        self,
        faq_id: int,
    ) -> HomepageFaq | None:
        return (
            self.db.query(HomepageFaq)
            .filter(
                HomepageFaq.id == faq_id,
            )
            .first()
        )

    def create(
        self,
        data: HomepageFaqCreate,
    ) -> HomepageFaq:
        faq = HomepageFaq(
            **data.model_dump(),
        )

        self.db.add(faq)
        self.db.commit()
        self.db.refresh(faq)

        return faq

    def update(
        self,
        faq: HomepageFaq,
        data: HomepageFaqUpdate,
    ) -> HomepageFaq:
        update_data = data.model_dump()

        for field, value in update_data.items():
            setattr(faq, field, value)

        self.db.commit()
        self.db.refresh(faq)

        return faq

    def delete(
        self,
        faq: HomepageFaq,
    ) -> None:
        self.db.delete(faq)
        self.db.commit()
