from pathlib import Path

ADMIN_PATH = Path("app/api/admin.py")
MAIN_PATH = Path("app/main.py")

admin = ADMIN_PATH.read_text()

old_import = "from app.services.site_setting_service import (\n    SiteSettingService,\n)\n"
new_import = (
    old_import
    + "\nfrom app.services.media_asset_service import (\n"
      "    MAX_IMAGE_SIZE,\n"
      "    MediaAssetService,\n"
      ")\n"
)

if "from app.services.media_asset_service import (" not in admin:
    if old_import not in admin:
        raise RuntimeError("Could not find the site-setting service import anchor.")
    admin = admin.replace(old_import, new_import, 1)

start = admin.find('IMAGE_UPLOAD_DIRECTORY = Path(')
end = admin.find('@router.get(\n    "/navigation",', start)

if start == -1 or end == -1:
    raise RuntimeError("Could not find the existing upload/media block.")

new_media_block = '''@router.post(
    "/uploads/images",
    status_code=status.HTTP_201_CREATED,
)
async def upload_admin_image(
    request: Request,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(
        get_current_admin,
    ),
):
    try:
        file_content = await file.read(
            MAX_IMAGE_SIZE + 1,
        )

        service = MediaAssetService(db)

        try:
            asset = service.create_image(
                original_filename=file.filename or "",
                content_type=file.content_type,
                file_content=file_content,
            )
        except ValueError as error:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=str(error),
            ) from error

        file_url = str(
            request.url_for(
                "get_media_asset",
                public_id=asset.public_id,
            )
        )

        return {
            "message": "Image uploaded successfully.",
            "filename": asset.filename,
            "file_url": file_url,
        }
    finally:
        await file.close()


@router.get(
    "/media",
)
def get_admin_media_library(
    request: Request,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(
        get_current_admin,
    ),
):
    service = MediaAssetService(db)
    media_items = []

    for asset in service.list_assets():
        usage = service.get_usage(asset)

        media_items.append(
            {
                "filename": asset.filename,
                "file_url": str(
                    request.url_for(
                        "get_media_asset",
                        public_id=asset.public_id,
                    )
                ),
                "extension": asset.extension,
                "size_bytes": asset.file_size,
                "created_at": asset.created_at.isoformat(),
                "is_used": bool(usage),
                "usage": usage,
            }
        )

    return media_items


'''

admin = admin[:start] + new_media_block + admin[end:]

delete_start = admin.find('@router.delete(\n    "/media/{filename}",')
delete_end = admin.find('@router.get(\n    "/footer-links",', delete_start)

if delete_start == -1 or delete_end == -1:
    raise RuntimeError("Could not find the existing media delete block.")

new_delete_block = '''@router.delete(
    "/media/{filename}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_admin_media_file(
    filename: str,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(
        get_current_admin,
    ),
):
    safe_filename = Path(filename).name

    if safe_filename != filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid media filename.",
        )

    service = MediaAssetService(db)
    asset = service.get_by_filename(safe_filename)

    if asset is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Media asset not found.",
        )

    usage = service.get_usage(asset)

    if usage:
        usage_labels = ", ".join(
            str(item["label"])
            for item in usage
        )

        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=(
                "This media file is currently "
                f"in use by: {usage_labels}. "
                "Remove or replace those references "
                "before deleting it."
            ),
        )

    service.delete_asset(asset)

    return Response(
        status_code=status.HTTP_204_NO_CONTENT,
    )


'''

admin = admin[:delete_start] + new_delete_block + admin[delete_end:]
ADMIN_PATH.write_text(admin)

main = MAIN_PATH.read_text()

media_import = "from app.api.media import router as media_router\n"
if media_import not in main:
    anchor = "from app.api.job_openings import router as job_openings_router\n"
    if anchor not in main:
        raise RuntimeError("Could not find main.py import anchor.")
    main = main.replace(anchor, anchor + media_import, 1)

if "app.include_router(media_router)" not in main:
    anchor = "app.include_router(auth_router)\n"
    if anchor not in main:
        raise RuntimeError("Could not find main.py router anchor.")
    main = main.replace(anchor, anchor + "app.include_router(media_router)\n", 1)

MAIN_PATH.write_text(main)

print("Step 2 patches applied successfully.")
