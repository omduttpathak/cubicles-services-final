from pathlib import Path

SERVICE_PATH = Path("app/services/media_asset_service.py")
ADMIN_PATH = Path("app/api/admin.py")

service_text = SERVICE_PATH.read_text()

marker = "    def get_usage(\n"

if marker not in service_text:
    raise RuntimeError("Could not find MediaAssetService.get_usage().")

method = '''    def get_dashboard_stats(
        self,
        recent_limit: int = 5,
    ) -> dict[str, object]:
        assets = self.list_assets()

        total_media = len(assets)
        storage_used_bytes = sum(
            int(asset.file_size)
            for asset in assets
        )

        recent_uploads = []

        for asset in assets[:recent_limit]:
            usage = self.get_usage(asset)

            recent_uploads.append(
                {
                    "filename": asset.filename,
                    "original_filename": asset.original_filename,
                    "file_url": f"/api/media/{asset.public_id}",
                    "extension": asset.extension,
                    "size_bytes": int(asset.file_size),
                    "created_at": asset.created_at.isoformat(),
                    "is_used": bool(usage),
                    "usage_count": len(usage),
                }
            )

        images_in_use = sum(
            1
            for asset in assets
            if self.get_usage(asset)
        )

        return {
            "total_media": total_media,
            "storage_used_bytes": storage_used_bytes,
            "images_in_use": images_in_use,
            "unused_images": total_media - images_in_use,
            "recent_uploads": recent_uploads,
        }

'''

if "    def get_dashboard_stats(\n" not in service_text:
    service_text = service_text.replace(marker, method + marker, 1)
    SERVICE_PATH.write_text(service_text)

admin_text = ADMIN_PATH.read_text()

route_marker = '@router.get(\n    "/media",\n)'

if route_marker not in admin_text:
    raise RuntimeError("Could not find the existing /media route.")

route = '''@router.get(
    "/media-stats",
)
def get_admin_media_stats(
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(
        get_current_admin,
    ),
):
    return MediaAssetService(db).get_dashboard_stats()


'''

if '"/media-stats"' not in admin_text:
    admin_text = admin_text.replace(route_marker, route + route_marker, 1)
    ADMIN_PATH.write_text(admin_text)

print("Media dashboard statistics endpoint added successfully.")
