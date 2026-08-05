from typing import Any

from sqlalchemy.orm import Session

from app.models.site_setting import SiteSetting
from app.schemas.site_setting import SiteSettingUpdate


class SiteSettingRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_active(
        self,
    ) -> SiteSetting | None:
        return (
            self.db.query(SiteSetting)
            .filter(
                SiteSetting.is_active.is_(True),
            )
            .order_by(SiteSetting.id.asc())
            .first()
        )

    def get_settings(
        self,
    ) -> SiteSetting | None:
        return self.db.query(SiteSetting).order_by(SiteSetting.id.asc()).first()

    def create(
        self,
        data: SiteSettingUpdate,
        *,
        extra_fields: dict[str, Any] | None = None,
    ) -> SiteSetting:
        values = data.model_dump()

        if extra_fields:
            values.update(extra_fields)

        settings = SiteSetting(**values)

        try:
            self.db.add(settings)
            self.db.commit()
            self.db.refresh(settings)
            return settings
        except Exception:
            self.db.rollback()
            raise

    def update(
        self,
        settings: SiteSetting,
        data: SiteSettingUpdate,
        *,
        extra_fields: dict[str, Any] | None = None,
    ) -> SiteSetting:
        update_data = data.model_dump()

        if extra_fields:
            update_data.update(extra_fields)

        try:
            for field, value in update_data.items():
                setattr(settings, field, value)

            self.db.commit()
            self.db.refresh(settings)
            return settings
        except Exception:
            self.db.rollback()
            raise
