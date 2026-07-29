from sqlalchemy.orm import Session

from app.models.homepage_testimonial import (
    HomepageTestimonial,
)
from app.schemas.homepage_testimonial import (
    HomepageTestimonialCreate,
    HomepageTestimonialUpdate,
)


class HomepageTestimonialRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_active(
        self,
    ) -> list[HomepageTestimonial]:
        return (
            self.db.query(HomepageTestimonial)
            .filter(
                HomepageTestimonial.is_active.is_(
                    True,
                ),
            )
            .order_by(
                HomepageTestimonial.display_order.asc(),
                HomepageTestimonial.id.asc(),
            )
            .all()
        )

    def get_all(
        self,
    ) -> list[HomepageTestimonial]:
        return (
            self.db.query(HomepageTestimonial)
            .order_by(
                HomepageTestimonial.display_order.asc(),
                HomepageTestimonial.id.asc(),
            )
            .all()
        )

    def get_by_id(
        self,
        testimonial_id: int,
    ) -> HomepageTestimonial | None:
        return (
            self.db.query(HomepageTestimonial)
            .filter(
                HomepageTestimonial.id == testimonial_id,
            )
            .first()
        )

    def create(
        self,
        data: HomepageTestimonialCreate,
    ) -> HomepageTestimonial:
        testimonial = HomepageTestimonial(
            **data.model_dump(),
        )

        self.db.add(testimonial)
        self.db.commit()
        self.db.refresh(testimonial)

        return testimonial

    def update(
        self,
        testimonial: HomepageTestimonial,
        data: HomepageTestimonialUpdate,
    ) -> HomepageTestimonial:
        update_data = data.model_dump()

        for field, value in update_data.items():
            setattr(
                testimonial,
                field,
                value,
            )

        self.db.commit()
        self.db.refresh(testimonial)

        return testimonial

    def delete(
        self,
        testimonial: HomepageTestimonial,
    ) -> None:
        self.db.delete(testimonial)
        self.db.commit()
