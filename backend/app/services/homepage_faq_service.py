from sqlalchemy.orm import Session

from app.models.homepage_faq import HomepageFaq
from app.repositories.homepage_faq_repository import (
    HomepageFaqRepository,
)
from app.schemas.homepage_faq import (
    HomepageFaqCreate,
    HomepageFaqUpdate,
)


class HomepageFaqService:
    def __init__(self, db: Session):
        self.repository = HomepageFaqRepository(db)

    def get_faqs(
        self,
    ) -> list[HomepageFaq]:
        return self.repository.get_active()

    def get_admin_faqs(
        self,
    ) -> list[HomepageFaq]:
        return self.repository.get_all()

    def get_admin_faq_by_id(
        self,
        faq_id: int,
    ) -> HomepageFaq | None:
        return self.repository.get_by_id(
            faq_id,
        )

    def create_faq(
        self,
        data: HomepageFaqCreate,
    ) -> HomepageFaq:
        normalized_data = data.model_copy(
            update={
                "question": data.question.strip(),
                "answer": data.answer.strip(),
            },
        )

        return self.repository.create(
            normalized_data,
        )

    def update_faq(
        self,
        faq_id: int,
        data: HomepageFaqUpdate,
    ) -> HomepageFaq:
        faq = self.repository.get_by_id(
            faq_id,
        )

        if faq is None:
            raise LookupError(
                "Homepage FAQ not found",
            )

        normalized_data = data.model_copy(
            update={
                "question": data.question.strip(),
                "answer": data.answer.strip(),
            },
        )

        return self.repository.update(
            faq,
            normalized_data,
        )

    def delete_faq(
        self,
        faq_id: int,
    ) -> None:
        faq = self.repository.get_by_id(
            faq_id,
        )

        if faq is None:
            raise LookupError(
                "Homepage FAQ not found",
            )

        self.repository.delete(faq)
