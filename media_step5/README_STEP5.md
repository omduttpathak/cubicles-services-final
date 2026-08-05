# Media Step 5

This step stores portable paths such as `/api/media/<uuid>` and resolves them in the frontend.

## Backend

From the project root:

```bash
cp backend/app/api/admin.py backend/app/api/admin.py.before-step5
cp backend/apply_step5_backend.py backend/
cp backend/app/scripts/backfill_portable_media_urls.py backend/app/scripts/

cd backend
python apply_step5_backend.py
python -m compileall app
python -m app.scripts.backfill_portable_media_urls
```

## Frontend

From the project root:

```bash
cp frontend/src/utils/mediaUrl.ts frontend/src/utils/
cp frontend/apply_step5_frontend.py frontend/

cd frontend
python apply_step5_frontend.py
npx prettier --write src
npm run typecheck
npm run lint
npm run build
```

Existing absolute URLs remain supported.
