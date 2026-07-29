from sqlalchemy.orm import Session

from app.models.homepage_testimonial import (
    HomepageTestimonial,
)
from app.repositories.homepage_testimonial_repository import (
    HomepageTestimonialRepository,
)
from app.schemas.homepage_testimonial import (
    HomepageTestimonialCreate,
    HomepageTestimonialUpdate,
)


class HomepageTestimonialService:
    def __init__(self, db: Session):
        self.repository = HomepageTestimonialRepository(db)

    def get_testimonials(
        self,
    ) -> list[HomepageTestimonial]:
        return self.repository.get_active()

    def get_admin_testimonials(
        self,
    ) -> list[HomepageTestimonial]:
        return self.repository.get_all()

    def get_admin_testimonial_by_id(
        self,
        testimonial_id: int,
    ) -> HomepageTestimonial | None:
        return self.repository.get_by_id(
            testimonial_id,
        )

    def create_testimonial(
        self,
        data: HomepageTestimonialCreate,
    ) -> HomepageTestimonial:
        normalized_data = data.model_copy(
            update={
                "name": data.name.strip(),
                "designation": (data.designation.strip()),
                "content": data.content.strip(),
            },
        )

        return self.repository.create(
            normalized_data,
        )

    def update_testimonial(
        self,
        testimonial_id: int,
        data: HomepageTestimonialUpdate,
    ) -> HomepageTestimonial:
        testimonial = self.repository.get_by_id(
            testimonial_id,
        )

        if testimonial is None:
            raise LookupError(
                "Homepage testimonial not found",
            )

        normalized_data = data.model_copy(
            update={
                "name": data.name.strip(),
                "designation": (data.designation.strip()),
                "content": data.content.strip(),
            },
        )

        return self.repository.update(
            testimonial,
            normalized_data,
        )

    def delete_testimonial(
        self,
        testimonial_id: int,
    ) -> None:
        testimonial = self.repository.get_by_id(
            testimonial_id,
        )

        if testimonial is None:
            raise LookupError(
                "Homepage testimonial not found",
            )

        self.repository.delete(testimonial)
