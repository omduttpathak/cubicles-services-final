from app.core.database import SessionLocal
from app.services.media_asset_service import MediaAssetService


def main() -> None:
    db = SessionLocal()

    try:
        service = MediaAssetService(db)
        generated = 0

        for asset in service.list_assets():
            created = service.ensure_variants(asset)
            generated += len(created)
            print(
                f"{asset.original_filename}: "
                f"generated {len(created)} new variant(s)"
            )

        print(f"Variant backfill complete. Generated {generated} variant(s).")
    finally:
        db.close()


if __name__ == "__main__":
    main()
