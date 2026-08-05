from pathlib import Path

IMPORT_LINE = 'import { resolveMediaUrl } from "@/utils/mediaUrl"\n'
ROOT = Path("src")

fixed_files: list[str] = []

for path in ROOT.rglob("*.tsx"):
    text = path.read_text()

    if 'resolveMediaUrl' not in text:
        continue

    lines = text.splitlines(keepends=True)

    # Remove every misplaced/duplicate resolveMediaUrl import first.
    lines = [
        line
        for line in lines
        if line.strip() != 'import { resolveMediaUrl } from "@/utils/mediaUrl"'
    ]

    # Find the end of the initial import section safely, including multiline imports.
    index = 0
    last_import_end = -1

    while index < len(lines):
        stripped = lines[index].strip()

        if not stripped:
            index += 1
            continue

        if not stripped.startswith("import "):
            break

        # Single-line side-effect import or normal one-line import.
        if (
            stripped.startswith('import "')
            or stripped.startswith("import '")
            or " from " in stripped
        ):
            last_import_end = index
            index += 1
            continue

        # Multiline import: advance until the line containing `from`.
        index += 1
        while index < len(lines):
            last_import_end = index
            if " from " in lines[index]:
                index += 1
                break
            index += 1

    if last_import_end == -1:
        raise RuntimeError(f"Could not locate import section in {path}")

    insert_at = last_import_end + 1
    lines.insert(insert_at, IMPORT_LINE)

    new_text = "".join(lines)

    # Safety checks.
    if new_text.count('import { resolveMediaUrl } from "@/utils/mediaUrl"') != 1:
        raise RuntimeError(f"Unexpected import count in {path}")

    path.write_text(new_text)
    fixed_files.append(str(path))

print(f"Repaired {len(fixed_files)} file(s):")
for file_path in fixed_files:
    print(f"  {file_path}")
