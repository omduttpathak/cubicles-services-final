from sqlalchemy.orm import Session

from app.core.database import SessionLocal
from app.models.blog import Blog
from app.models.case_study import CaseStudy
from app.models.site_setting import SiteSetting
from app.models.technology import Technology
from app.services.media_asset_service import MediaAssetService


def backfill(db: Session) -> None:
    media_service = MediaAssetService(db)
    updated = 0

    for settings in db.query(SiteSetting).all():
        logo_media_id = media_service.resolve_media_id(settings.logo_url)
        favicon_media_id = media_service.resolve_media_id(
            settings.favicon_url
        )

        if settings.logo_media_id != logo_media_id:
            settings.logo_media_id = logo_media_id
            updated += 1

        if settings.favicon_media_id != favicon_media_id:
            settings.favicon_media_id = favicon_media_id
            updated += 1

    for blog in db.query(Blog).all():
        media_id = media_service.resolve_media_id(blog.image_url)

        if blog.image_media_id != media_id:
            blog.image_media_id = media_id
            updated += 1

    for case_study in db.query(CaseStudy).all():
        media_id = media_service.resolve_media_id(
            case_study.image_url
        )

        if case_study.image_media_id != media_id:
            case_study.image_media_id = media_id
            updated += 1

    for technology in db.query(Technology).all():
        media_id = media_service.resolve_media_id(
            technology.logo_url
        )

        if technology.logo_media_id != media_id:
            technology.logo_media_id = media_id
            updated += 1

    db.commit()
    print(f"Backfill complete. Updated {updated} media reference(s).")


def main() -> None:
    db = SessionLocal()

    try:
        backfill(db)
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    main()
