from sqlalchemy.orm import Session

from app.models.navigation_item import (
    NavigationItem,
)
from app.repositories.navigation_item_repository import (
    NavigationItemRepository,
)
from app.schemas.navigation_item import (
    NavigationItemCreate,
    NavigationItemUpdate,
)


class NavigationItemService:
    def __init__(
        self,
        db: Session,
    ):
        self.repository = (
            NavigationItemRepository(db)
        )

    def get_public_navigation(
        self,
    ) -> list[NavigationItem]:
        return self.repository.get_visible()

    def get_admin_navigation(
        self,
    ) -> list[NavigationItem]:
        return self.repository.get_all()

    def get_navigation_item_by_id(
        self,
        navigation_item_id: int,
    ) -> NavigationItem | None:
        return self.repository.get_by_id(
            navigation_item_id,
        )

    def create_navigation_item(
        self,
        data: NavigationItemCreate,
    ) -> NavigationItem:
        normalized_data = data.model_copy(
            update={
                "title": data.title.strip(),
                "url": data.url.strip(),
            },
        )

        return self.repository.create(
            normalized_data,
        )

    def update_navigation_item(
        self,
        navigation_item_id: int,
        data: NavigationItemUpdate,
    ) -> NavigationItem:
        navigation_item = (
            self.repository.get_by_id(
                navigation_item_id,
            )
        )

        if navigation_item is None:
            raise LookupError(
                "Navigation item not found.",
            )

        normalized_data = data.model_copy(
            update={
                "title": data.title.strip(),
                "url": data.url.strip(),
            },
        )

        return self.repository.update(
            navigation_item,
            normalized_data,
        )

    def update_navigation_order(
        self,
        item_ids: list[int],
    ) -> list[NavigationItem]:
        existing_items = (
            self.repository.get_all()
        )

        existing_by_id = {
            item.id: item
            for item in existing_items
        }

        if set(item_ids) != set(existing_by_id):
            raise ValueError(
                "Navigation order must contain every navigation item exactly once.",
            )

        ordered_items = [
            existing_by_id[item_id]
            for item_id in item_ids
        ]

        return self.repository.update_order(
            ordered_items,
        )

    def delete_navigation_item(
        self,
        navigation_item_id: int,
    ) -> None:
        navigation_item = (
            self.repository.get_by_id(
                navigation_item_id,
            )
        )

        if navigation_item is None:
            raise LookupError(
                "Navigation item not found.",
            )

        self.repository.delete(
            navigation_item,
        )
