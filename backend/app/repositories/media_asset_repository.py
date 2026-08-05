from sqlalchemy.orm import Session

from app.models.media_asset import MediaAsset


class MediaAssetRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_public_id(self, public_id: str) -> MediaAsset | None:
        return (
            self.db.query(MediaAsset)
            .filter(MediaAsset.public_id == public_id)
            .first()
        )

    def get_by_filename(self, filename: str) -> MediaAsset | None:
        return (
            self.db.query(MediaAsset)
            .filter(MediaAsset.filename == filename)
            .first()
        )

    def get_by_checksum(self, checksum: str) -> MediaAsset | None:
        return (
            self.db.query(MediaAsset)
            .filter(MediaAsset.checksum == checksum)
            .first()
        )

    def list_all(self) -> list[MediaAsset]:
        return (
            self.db.query(MediaAsset)
            .order_by(MediaAsset.created_at.desc(), MediaAsset.id.desc())
            .all()
        )

    def create(self, asset: MediaAsset) -> MediaAsset:
        try:
            self.db.add(asset)
            self.db.commit()
            self.db.refresh(asset)
            return asset
        except Exception:
            self.db.rollback()
            raise

    def delete(self, asset: MediaAsset) -> None:
        try:
            self.db.delete(asset)
            self.db.commit()
        except Exception:
            self.db.rollback()
            raise
