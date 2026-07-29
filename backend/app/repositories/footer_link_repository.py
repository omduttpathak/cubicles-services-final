from sqlalchemy.orm import Session

from app.models.footer_link import FooterLink
from app.schemas.footer_link import (
    FooterLinkCreate,
    FooterLinkOrderItem,
    FooterLinkUpdate,
)


class FooterLinkRepository:
    def __init__(
        self,
        db: Session,
    ):
        self.db = db

    def get_visible(
        self,
    ) -> list[FooterLink]:
        return (
            self.db.query(FooterLink)
            .filter(
                FooterLink.is_visible.is_(True),
            )
            .order_by(
                FooterLink.group_name.asc(),
                FooterLink.display_order.asc(),
                FooterLink.id.asc(),
            )
            .all()
        )

    def get_all(
        self,
    ) -> list[FooterLink]:
        return (
            self.db.query(FooterLink)
            .order_by(
                FooterLink.group_name.asc(),
                FooterLink.display_order.asc(),
                FooterLink.id.asc(),
            )
            .all()
        )

    def get_by_id(
        self,
        footer_link_id: int,
    ) -> FooterLink | None:
        return (
            self.db.query(FooterLink)
            .filter(
                FooterLink.id == footer_link_id,
            )
            .first()
        )

    def create(
        self,
        data: FooterLinkCreate,
    ) -> FooterLink:
        footer_link = FooterLink(
            **data.model_dump(),
        )

        self.db.add(footer_link)
        self.db.commit()
        self.db.refresh(footer_link)

        return footer_link

    def update(
        self,
        footer_link: FooterLink,
        data: FooterLinkUpdate,
    ) -> FooterLink:
        for field, value in data.model_dump().items():
            setattr(
                footer_link,
                field,
                value,
            )

        self.db.commit()
        self.db.refresh(footer_link)

        return footer_link

    def update_order(
        self,
        order_items: list[FooterLinkOrderItem],
    ) -> list[FooterLink]:
        links = self.get_all()
        links_by_id = {
            link.id: link
            for link in links
        }

        for order_item in order_items:
            link = links_by_id[order_item.id]
            link.group_name = order_item.group_name.strip()
            link.display_order = order_item.display_order

        self.db.commit()

        return self.get_all()

    def delete(
        self,
        footer_link: FooterLink,
    ) -> None:
        self.db.delete(footer_link)
        self.db.commit()
