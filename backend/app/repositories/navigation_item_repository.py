from sqlalchemy.orm import Session

from app.models.navigation_item import (
    NavigationItem,
)
from app.schemas.navigation_item import (
    NavigationItemCreate,
    NavigationItemUpdate,
)


class NavigationItemRepository:
    def __init__(
        self,
        db: Session,
    ):
        self.db = db

    def get_visible(
        self,
    ) -> list[NavigationItem]:
        return (
            self.db.query(NavigationItem)
            .filter(
                NavigationItem.is_visible.is_(
                    True,
                ),
            )
            .order_by(
                NavigationItem.display_order.asc(),
                NavigationItem.id.asc(),
            )
            .all()
        )

    def get_all(
        self,
    ) -> list[NavigationItem]:
        return (
            self.db.query(NavigationItem)
            .order_by(
                NavigationItem.display_order.asc(),
                NavigationItem.id.asc(),
            )
            .all()
        )

    def get_by_id(
        self,
        navigation_item_id: int,
    ) -> NavigationItem | None:
        return (
            self.db.query(NavigationItem)
            .filter(
                NavigationItem.id
                == navigation_item_id,
            )
            .first()
        )

    def create(
        self,
        data: NavigationItemCreate,
    ) -> NavigationItem:
        navigation_item = NavigationItem(
            **data.model_dump(),
        )

        self.db.add(navigation_item)
        self.db.commit()
        self.db.refresh(navigation_item)

        return navigation_item

    def update(
        self,
        navigation_item: NavigationItem,
        data: NavigationItemUpdate,
    ) -> NavigationItem:
        for field, value in data.model_dump().items():
            setattr(
                navigation_item,
                field,
                value,
            )

        self.db.commit()
        self.db.refresh(navigation_item)

        return navigation_item

    def update_order(
        self,
        navigation_items: list[NavigationItem],
    ) -> list[NavigationItem]:
        for index, navigation_item in enumerate(
            navigation_items,
            start=1,
        ):
            navigation_item.display_order = index

        self.db.commit()

        for navigation_item in navigation_items:
            self.db.refresh(navigation_item)

        return navigation_items

    def delete(
        self,
        navigation_item: NavigationItem,
    ) -> None:
        self.db.delete(navigation_item)
        self.db.commit()
