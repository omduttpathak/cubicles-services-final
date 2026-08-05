# Media System Step 4

This step automatically links database media URLs to the new foreign-key
columns while preserving all existing frontend request/response fields.

## Apply

From the backend directory:

```bash
unzip -o /path/to/media_step4_package.zip -d .
python -m compileall app
python -m app.scripts.backfill_media_references
```

Restart FastAPI after applying the package.

## Behavior

- `/api/media/{uuid}` URLs are resolved to `media_assets.id`.
- Legacy `/uploads/...` URLs remain accepted and keep a NULL media ID.
- Removing an image clears the related media ID.
- Invalid database-media UUIDs are rejected.
- Media usage checks now inspect both foreign keys and legacy URL fields.
