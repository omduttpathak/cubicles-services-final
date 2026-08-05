from pathlib import Path

path = Path("app/main.py")
text = path.read_text()

health_import = "from app.api.health import router as health_router\n"
anchor = "from app.api.homepage import router as homepage_router\n"

if health_import not in text:
    if anchor not in text:
        raise RuntimeError("Could not locate homepage router import.")
    text = text.replace(anchor, health_import + anchor, 1)

include_anchor = "app.include_router(media_router)\n"

if "app.include_router(health_router)" not in text:
    if include_anchor not in text:
        raise RuntimeError("Could not locate media router registration.")
    text = text.replace(
        include_anchor,
        include_anchor + "app.include_router(health_router)\n",
        1,
    )

path.write_text(text)
print("Health router registered in app/main.py.")
