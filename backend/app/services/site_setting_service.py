from sqlalchemy.orm import Session

from app.core.branding import (
    ADDRESS,
    COMPANY_NAME,
    CONTACT_EMAIL,
    CONTACT_PHONE,
    COPYRIGHT_TEXT,
    FOOTER_DESCRIPTION,
)
from app.models.site_setting import SiteSetting
from app.repositories.site_setting_repository import SiteSettingRepository
from app.schemas.site_setting import SiteSettingUpdate
from app.services.media_asset_service import MediaAssetService


class SiteSettingService:
    def __init__(self, db: Session):
        self.repository = SiteSettingRepository(db)
        self.media_service = MediaAssetService(db)

    def get_site_settings(self) -> SiteSetting | None:
        settings = self.repository.get_active()

        if settings is None:
            return None

        return self._apply_code_branding(settings)

    def get_admin_site_settings(self) -> SiteSetting | None:
        settings = self.repository.get_settings()

        if settings is None:
            return None

        return self._apply_code_branding(settings)

    def update_site_settings(
        self,
        data: SiteSettingUpdate,
    ) -> SiteSetting:
        logo_url = self._normalize_optional(data.logo_url)
        favicon_url = self._normalize_optional(data.favicon_url)

        logo_media_id = self.media_service.resolve_media_id(logo_url)
        favicon_media_id = self.media_service.resolve_media_id(favicon_url)

        normalized_data = data.model_copy(
            update={
                # Business identity is controlled from app/core/branding.py.
                "company_name": COMPANY_NAME,
                "contact_email": CONTACT_EMAIL,
                "contact_phone": CONTACT_PHONE,
                "address": ADDRESS,
                "footer_description": FOOTER_DESCRIPTION,
                "copyright_text": COPYRIGHT_TEXT,

                # These fields remain CMS-managed.
                "logo_url": logo_url,
                "favicon_url": favicon_url,
                "linkedin_url": self._normalize_optional(
                    data.linkedin_url
                ),
                "facebook_url": self._normalize_optional(
                    data.facebook_url
                ),
                "twitter_url": self._normalize_optional(
                    data.twitter_url
                ),
                "youtube_url": self._normalize_optional(
                    data.youtube_url
                ),
            },
        )

        extra_fields = {
            "logo_media_id": logo_media_id,
            "favicon_media_id": favicon_media_id,
        }

        settings = self.repository.get_settings()

        if settings is None:
            settings = self.repository.create(
                normalized_data,
                extra_fields=extra_fields,
            )
        else:
            settings = self.repository.update(
                settings,
                normalized_data,
                extra_fields=extra_fields,
            )

        return self._apply_code_branding(settings)

    @staticmethod
    def _apply_code_branding(
        settings: SiteSetting,
    ) -> SiteSetting:
        """
        Override database branding with source-code branding.

        This makes the public business identity controlled by
        backend/app/core/branding.py instead of Admin Site Settings.
        """

        settings.company_name = COMPANY_NAME
        settings.contact_email = CONTACT_EMAIL
        settings.contact_phone = CONTACT_PHONE
        settings.address = ADDRESS
        settings.footer_description = FOOTER_DESCRIPTION
        settings.copyright_text = COPYRIGHT_TEXT

        return settings

    @staticmethod
    def _normalize_optional(
        value: str | None,
    ) -> str | None:
        if value is None:
            return None

        normalized = value.strip()

        return normalized or None
