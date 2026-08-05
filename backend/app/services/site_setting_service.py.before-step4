from sqlalchemy.orm import Session

from app.models.site_setting import SiteSetting
from app.repositories.site_setting_repository import (
    SiteSettingRepository,
)
from app.schemas.site_setting import (
    SiteSettingUpdate,
)


class SiteSettingService:
    def __init__(self, db: Session):
        self.repository = SiteSettingRepository(db)

    def get_site_settings(
        self,
    ) -> SiteSetting | None:
        return self.repository.get_active()

    def get_admin_site_settings(
        self,
    ) -> SiteSetting | None:
        return self.repository.get_settings()

    def update_site_settings(
        self,
        data: SiteSettingUpdate,
    ) -> SiteSetting:
        normalized_data = data.model_copy(
            update={
                "company_name": (data.company_name.strip()),
                "logo_url": self._normalize_optional(
                    data.logo_url,
                ),
                "favicon_url": (
                    self._normalize_optional(
                        data.favicon_url,
                    )
                ),
                "contact_email": str(
                    data.contact_email,
                )
                .strip()
                .lower(),
                "contact_phone": (
                    self._normalize_optional(
                        data.contact_phone,
                    )
                ),
                "address": self._normalize_optional(
                    data.address,
                ),
                "footer_description": (data.footer_description.strip()),
                "copyright_text": (data.copyright_text.strip()),
                "linkedin_url": (
                    self._normalize_optional(
                        data.linkedin_url,
                    )
                ),
                "facebook_url": (
                    self._normalize_optional(
                        data.facebook_url,
                    )
                ),
                "twitter_url": (
                    self._normalize_optional(
                        data.twitter_url,
                    )
                ),
                "youtube_url": (
                    self._normalize_optional(
                        data.youtube_url,
                    )
                ),
            },
        )

        settings = self.repository.get_settings()

        if settings is None:
            return self.repository.create(
                normalized_data,
            )

        return self.repository.update(
            settings,
            normalized_data,
        )

    @staticmethod
    def _normalize_optional(
        value: str | None,
    ) -> str | None:
        if value is None:
            return None

        normalized = value.strip()

        return normalized or None
