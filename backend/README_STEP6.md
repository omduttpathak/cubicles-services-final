# Media Step 6 — Optimized Variants

Adds database-backed WebP variants:

- thumbnail: 320 px
- medium: 768 px
- large: 1440 px
- original: unchanged

Images are never enlarged. SVG and ICO files remain unchanged.

## Apply

From the backend directory:

```bash
cp app/services/media_asset_service.py app/services/media_asset_service.py.before-step6
cp app/api/media.py app/api/media.py.before-step6

unzip -o /path/to/media_step6_package.zip -d .
python apply_media_step6.py
python -m compileall app
alembic heads
alembic upgrade head
alembic current
python -m app.scripts.backfill_media_variants
```

Expected Alembic head:

```text
5f8c2e7a91bd (head)
```

Test:

```bash
curl -I "http://127.0.0.1:8000/api/media/<public_id>?size=thumbnail"
```

Generated variants return `content-type: image/webp`. Missing variants safely fall back to the original image.
