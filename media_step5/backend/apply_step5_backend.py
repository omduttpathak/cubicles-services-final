from pathlib import Path

path = Path("app/api/admin.py")
text = path.read_text()

old = '''        file_url = str(
            request.url_for(
                "get_media_asset",
                public_id=asset.public_id,
            )
        )
'''
new = '''        file_url = f"/api/media/{asset.public_id}"
'''
if old not in text:
    raise RuntimeError("Upload URL block not found.")
text = text.replace(old, new, 1)

old = '''                "file_url": str(
                    request.url_for(
                        "get_media_asset",
                        public_id=asset.public_id,
                    )
                ),
'''
new = '''                "file_url": f"/api/media/{asset.public_id}",
'''
if old not in text:
    raise RuntimeError("Media library URL block not found.")
text = text.replace(old, new, 1)

path.write_text(text)
print("Backend Step 5 patch applied.")
