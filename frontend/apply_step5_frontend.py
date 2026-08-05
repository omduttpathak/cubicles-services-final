from pathlib import Path

root = Path("src")
import_line = 'import { resolveMediaUrl } from "@/utils/mediaUrl"\n'

files = {
    "components/layout/Header.tsx": [
        ("src={settings.logo_url}", "src={resolveMediaUrl(settings.logo_url) ?? undefined}"),
    ],
    "components/layout/Footer.tsx": [
        ("src={settings.logo_url}", "src={resolveMediaUrl(settings.logo_url) ?? undefined}"),
    ],
    "components/technologies/TechnologyCategories.tsx": [
        ("src={technology.logo_url}", "src={resolveMediaUrl(technology.logo_url) ?? undefined}"),
    ],
    "components/home/TechnologySection.tsx": [
        ("src={technology.logo_url}", "src={resolveMediaUrl(technology.logo_url) ?? undefined}"),
    ],
    "components/admin/MediaPickerModal.tsx": [
        ("src={item.file_url}", "src={resolveMediaUrl(item.file_url) ?? undefined}"),
    ],
    "components/admin/ImageUploader.tsx": [
        ("src={value}", "src={resolveMediaUrl(value) ?? undefined}"),
    ],
    "pages/CaseStudies.tsx": [
        ("src={caseStudy.imageUrl}", "src={resolveMediaUrl(caseStudy.imageUrl) ?? undefined}"),
    ],
    "pages/Blogs.tsx": [
        ("src={blog.imageUrl}", "src={resolveMediaUrl(blog.imageUrl) ?? undefined}"),
    ],
    "pages/blogs/BlogDetails.tsx": [
        ("src={blog.imageUrl}", "src={resolveMediaUrl(blog.imageUrl) ?? undefined}"),
    ],
    "pages/case-studies/CaseStudyDetails.tsx": [
        ("src={caseStudy.imageUrl}", "src={resolveMediaUrl(caseStudy.imageUrl) ?? undefined}"),
    ],
    "pages/technologies/TechnologyDetails.tsx": [
        ("src={technology.logo_url}", "src={resolveMediaUrl(technology.logo_url) ?? undefined}"),
    ],
    "pages/admin/AdminTechnologies.tsx": [
        ("src={technology.logo_url}", "src={resolveMediaUrl(technology.logo_url) ?? undefined}"),
    ],
    "pages/admin/AdminSiteSettings.tsx": [
        ("src={formData.logo_url}", "src={resolveMediaUrl(formData.logo_url) ?? undefined}"),
    ],
    "pages/admin/AdminMediaLibrary.tsx": [
        ("src={item.file_url}", "src={resolveMediaUrl(item.file_url) ?? undefined}"),
    ],
}

for relative, replacements in files.items():
    path = root / relative
    text = path.read_text()

    if import_line not in text:
        lines = text.splitlines(keepends=True)
        insert_at = 0
        while insert_at < len(lines) and lines[insert_at].startswith("import "):
            insert_at += 1
        lines.insert(insert_at, import_line)
        text = "".join(lines)

    for old, new in replacements:
        if old not in text:
            raise RuntimeError(f"Missing {old!r} in {relative}")
        text = text.replace(old, new)

    path.write_text(text)

print("Frontend Step 5 patch applied.")
