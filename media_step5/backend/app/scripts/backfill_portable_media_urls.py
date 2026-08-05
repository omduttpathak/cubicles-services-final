from urllib.parse import urlparse

from sqlalchemy.orm import Session

from app.core.database import SessionLocal
from app.models.blog import Blog
from app.models.case_study import CaseStudy
from app.models.site_setting import SiteSetting
from app.models.technology import Technology


def portable(value: str | None) -> str | None:
    if value is None:
        return None

    value = value.strip()

    if not value:
        return None

    path = urlparse(value).path.rstrip("/")

    if "/api/media/" not in path:
        return value

    public_id = path.rsplit("/api/media/", 1)[-1].strip()

    if not public_id:
        return value

    return f"/api/media/{public_id}"


def backfill(db: Session) -> None:
    updated = 0

    for settings in db.query(SiteSetting).all():
        for field in ("logo_url", "favicon_url"):
            old = getattr(settings, field)
            new = portable(old)
            if old != new:
                setattr(settings, field, new)
                updated += 1

    for model, field in (
        (Blog, "image_url"),
        (CaseStudy, "image_url"),
        (Technology, "logo_url"),
    ):
        for row in db.query(model).all():
            old = getattr(row, field)
            new = portable(old)
            if old != new:
                setattr(row, field, new)
                updated += 1

    db.commit()
    print(f"Portable media URL backfill complete. Updated {updated} value(s).")


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
