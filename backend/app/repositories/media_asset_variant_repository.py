from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.media_asset_variant import MediaAssetVariant


class MediaAssetVariantRepository:
    def __init__(self, db: Session):
        self.db = db

    def get(
        self,
        media_asset_id: int,
        variant_name: str,
    ) -> MediaAssetVariant | None:
        return (
            self.db.query(MediaAssetVariant)
            .filter(
                MediaAssetVariant.media_asset_id == media_asset_id,
                MediaAssetVariant.variant_name == variant_name,
            )
            .first()
        )

    def create(
        self,
        variant: MediaAssetVariant,
    ) -> MediaAssetVariant:
        try:
            self.db.add(variant)
            self.db.commit()
            self.db.refresh(variant)
            return variant
        except Exception:
            self.db.rollback()
            raise

    def total_storage_bytes(self) -> int:
        return int(
            self.db.query(
                func.coalesce(func.sum(MediaAssetVariant.file_size), 0)
            ).scalar()
            or 0
        )
