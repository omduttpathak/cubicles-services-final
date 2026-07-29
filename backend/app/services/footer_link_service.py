from sqlalchemy.orm import Session

from app.models.footer_link import FooterLink
from app.repositories.footer_link_repository import (
    FooterLinkRepository,
)
from app.schemas.footer_link import (
    FooterLinkCreate,
    FooterLinkOrderItem,
    FooterLinkUpdate,
)


class FooterLinkService:
    def __init__(
        self,
        db: Session,
    ):
        self.repository = FooterLinkRepository(db)

    def get_public_footer_links(
        self,
    ) -> list[FooterLink]:
        return self.repository.get_visible()

    def get_admin_footer_links(
        self,
    ) -> list[FooterLink]:
        return self.repository.get_all()

    def get_footer_link_by_id(
        self,
        footer_link_id: int,
    ) -> FooterLink | None:
        return self.repository.get_by_id(
            footer_link_id,
        )

    def create_footer_link(
        self,
        data: FooterLinkCreate,
    ) -> FooterLink:
        normalized_data = data.model_copy(
            update={
                "group_name": data.group_name.strip(),
                "title": data.title.strip(),
                "url": data.url.strip(),
            },
        )

        return self.repository.create(
            normalized_data,
        )

    def update_footer_link(
        self,
        footer_link_id: int,
        data: FooterLinkUpdate,
    ) -> FooterLink:
        footer_link = self.repository.get_by_id(
            footer_link_id,
        )

        if footer_link is None:
            raise LookupError(
                "Footer link not found.",
            )

        normalized_data = data.model_copy(
            update={
                "group_name": data.group_name.strip(),
                "title": data.title.strip(),
                "url": data.url.strip(),
            },
        )

        return self.repository.update(
            footer_link,
            normalized_data,
        )

    def update_footer_link_order(
        self,
        order_items: list[FooterLinkOrderItem],
    ) -> list[FooterLink]:
        existing_links = self.repository.get_all()
        existing_ids = {
            link.id
            for link in existing_links
        }

        submitted_ids = {
            item.id
            for item in order_items
        }

        if existing_ids != submitted_ids:
            raise ValueError(
                "Footer link order must contain every footer link exactly once.",
            )

        return self.repository.update_order(
            order_items,
        )

    def delete_footer_link(
        self,
        footer_link_id: int,
    ) -> None:
        footer_link = self.repository.get_by_id(
            footer_link_id,
        )

        if footer_link is None:
            raise LookupError(
                "Footer link not found.",
            )

        self.repository.delete(
            footer_link,
        )
