from pathlib import Path

SERVICE_PATH = Path("app/services/media_asset_service.py")
MEDIA_API_PATH = Path("app/api/media.py")

service = SERVICE_PATH.read_text()

service = service.replace(
    "from PIL import Image, UnidentifiedImageError\n",
    "from PIL import Image, ImageOps, UnidentifiedImageError\n",
    1,
)

if "from app.models.media_asset_variant import MediaAssetVariant\n" not in service:
    service = service.replace(
        "from app.models.media_asset import MediaAsset\n",
        "from app.models.media_asset import MediaAsset\n"
        "from app.models.media_asset_variant import MediaAssetVariant\n",
        1,
    )

if "from app.repositories.media_asset_variant_repository import MediaAssetVariantRepository\n" not in service:
    service = service.replace(
        "from app.repositories.media_asset_repository import MediaAssetRepository\n",
        "from app.repositories.media_asset_repository import MediaAssetRepository\n"
        "from app.repositories.media_asset_variant_repository import "
        "MediaAssetVariantRepository\n",
        1,
    )

if "MEDIA_VARIANT_WIDTHS" not in service:
    service = service.replace(
        "MAX_IMAGE_SIZE = 5 * 1024 * 1024\n",
        "MAX_IMAGE_SIZE = 5 * 1024 * 1024\n\n"
        "MEDIA_VARIANT_WIDTHS = {\n"
        "    \"thumbnail\": 320,\n"
        "    \"medium\": 768,\n"
        "    \"large\": 1440,\n"
        "}\n\n"
        "VARIANT_SUPPORTED_MIME_TYPES = {\n"
        "    \"image/png\",\n"
        "    \"image/jpeg\",\n"
        "    \"image/webp\",\n"
        "}\n",
        1,
    )

if "self.variant_repository" not in service:
    service = service.replace(
        "        self.repository = MediaAssetRepository(db)\n",
        "        self.repository = MediaAssetRepository(db)\n"
        "        self.variant_repository = MediaAssetVariantRepository(db)\n",
        1,
    )

service = service.replace(
    "        if existing is not None:\n            return existing\n",
    "        if existing is not None:\n"
    "            self.ensure_variants(existing)\n"
    "            return existing\n",
    1,
)

service = service.replace(
    "        return self.repository.create(asset)\n\n    def get_by_public_id",
    "        created_asset = self.repository.create(asset)\n"
    "        self.ensure_variants(created_asset)\n\n"
    "        return created_asset\n\n"
    "    def get_by_public_id",
    1,
)

service = service.replace(
    "        storage_used_bytes = sum(\n"
    "            int(asset.file_size)\n"
    "            for asset in assets\n"
    "        )\n",
    "        storage_used_bytes = (\n"
    "            sum(\n"
    "                int(asset.file_size)\n"
    "                for asset in assets\n"
    "            )\n"
    "            + self.variant_repository.total_storage_bytes()\n"
    "        )\n",
    1,
)

methods = '''    def get_variant(
        self,
        asset: MediaAsset,
        variant_name: str,
    ) -> MediaAssetVariant | None:
        return self.variant_repository.get(
            int(asset.id),
            variant_name,
        )

    def ensure_variants(
        self,
        asset: MediaAsset,
    ) -> list[MediaAssetVariant]:
        if asset.mime_type not in VARIANT_SUPPORTED_MIME_TYPES:
            return []

        if not asset.width or not asset.height:
            return []

        created_variants: list[MediaAssetVariant] = []

        try:
            with Image.open(BytesIO(asset.file_data)) as source_image:
                source_image = ImageOps.exif_transpose(source_image)

                for variant_name, target_width in MEDIA_VARIANT_WIDTHS.items():
                    if self.variant_repository.get(int(asset.id), variant_name):
                        continue

                    if source_image.width <= target_width:
                        continue

                    variant_image = source_image.copy()
                    target_height = max(
                        1,
                        round(
                            source_image.height
                            * target_width
                            / source_image.width
                        ),
                    )
                    variant_image.thumbnail(
                        (target_width, target_height),
                        Image.Resampling.LANCZOS,
                    )

                    if variant_image.mode not in {"RGB", "RGBA", "LA"}:
                        variant_image = variant_image.convert("RGBA")

                    output = BytesIO()
                    variant_image.save(
                        output,
                        format="WEBP",
                        quality=82,
                        method=6,
                    )
                    variant_data = output.getvalue()

                    variant = MediaAssetVariant(
                        media_asset_id=asset.id,
                        variant_name=variant_name,
                        filename=(
                            f"{Path(asset.filename).stem}-"
                            f"{variant_name}.webp"
                        ),
                        mime_type="image/webp",
                        extension=".webp",
                        file_size=len(variant_data),
                        width=variant_image.width,
                        height=variant_image.height,
                        checksum=sha256(variant_data).hexdigest(),
                        file_data=variant_data,
                    )
                    created_variants.append(
                        self.variant_repository.create(variant)
                    )
        except (UnidentifiedImageError, OSError, ValueError):
            return []

        return created_variants

'''

if "    def ensure_variants(\n" not in service:
    anchor = "    def get_dashboard_stats(\n"
    if anchor not in service:
        raise RuntimeError("Could not find get_dashboard_stats method.")
    service = service.replace(anchor, methods + anchor, 1)

SERVICE_PATH.write_text(service)

MEDIA_API_PATH.write_text('''from typing import Literal

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
''')

print("Media Step 6 patch applied successfully.")
