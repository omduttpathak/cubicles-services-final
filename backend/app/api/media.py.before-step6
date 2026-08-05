from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.services.media_asset_service import MediaAssetService


router = APIRouter(
    prefix="/api/media",
    tags=["Media"],
)


@router.get(
    "/{public_id}",
    name="get_media_asset",
)
def get_media_asset(
    public_id: str,
    db: Session = Depends(get_db),
):
    asset = MediaAssetService(db).get_by_public_id(public_id)

    if asset is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Media asset not found.",
        )

    headers = {
        "Cache-Control": "public, max-age=31536000, immutable",
        "ETag": f'"{asset.checksum}"',
        "Content-Length": str(asset.file_size),
        "Content-Disposition": f'inline; filename="{asset.filename}"',
    }

    if asset.mime_type == "image/svg+xml":
        headers["Content-Security-Policy"] = (
            "default-src 'none'; style-src 'unsafe-inline'; sandbox"
        )

    return Response(
        content=asset.file_data,
        media_type=asset.mime_type,
        headers=headers,
    )
