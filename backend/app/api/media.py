from typing import Literal

from fastapi import APIRouter, Depends, HTTPException, Query, Response, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.services.media_asset_service import MediaAssetService


router = APIRouter(
    prefix="/api/media",
    tags=["Media"],
)

MediaSize = Literal["original", "thumbnail", "medium", "large"]


@router.get(
    "/{public_id}",
    name="get_media_asset",
)
def get_media_asset(
    public_id: str,
    size: MediaSize = Query(default="original"),
    db: Session = Depends(get_db),
):
    service = MediaAssetService(db)
    asset = service.get_by_public_id(public_id)

    if asset is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Media asset not found.",
        )

    content = asset.file_data
    mime_type = asset.mime_type
    filename = asset.filename
    file_size = int(asset.file_size)
    checksum = asset.checksum
    served_size = "original"

    if size != "original":
        variant = service.get_variant(asset, size)

        if variant is not None:
            content = variant.file_data
            mime_type = variant.mime_type
            filename = variant.filename
            file_size = int(variant.file_size)
            checksum = variant.checksum
            served_size = size

    headers = {
        "Cache-Control": "public, max-age=31536000, immutable",
        "ETag": f'"{checksum}"',
        "Content-Length": str(file_size),
        "Content-Disposition": f'inline; filename="{filename}"',
        "X-Media-Size": served_size,
    }

    if mime_type == "image/svg+xml":
        headers["Content-Security-Policy"] = (
            "default-src 'none'; style-src 'unsafe-inline'; sandbox"
        )

    return Response(
        content=content,
        media_type=mime_type,
        headers=headers,
    )
