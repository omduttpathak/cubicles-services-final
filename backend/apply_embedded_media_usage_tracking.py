from pathlib import Path

path = Path("app/services/media_asset_service.py")
text = path.read_text()

service_import = "from app.models.service import Service\n"
technology_import = "from app.models.technology import Technology\n"

if service_import not in text:
    if technology_import not in text:
        raise RuntimeError("Technology import not found.")
    text = text.replace(
        technology_import,
        service_import + technology_import,
        1,
    )

start = text.find("    def get_usage(\n")
end = text.find("    @staticmethod\n    def _get_dimensions(", start)

if start == -1 or end == -1:
    raise RuntimeError("get_usage method not found.")

replacement = """    def get_usage(
        self,
        asset: MediaAsset,
    ) -> list[dict[str, str | int]]:
        usage: list[dict[str, str | int]] = []
        media_path = f"/api/media/{asset.public_id}"

        def add_usage(
            usage_type: str,
            item_id: int,
            label: str,
        ) -> None:
            candidate = {
                "type": usage_type,
                "id": item_id,
                "label": label,
            }

            if candidate not in usage:
                usage.append(candidate)

        site_settings = (
            self.db.query(SiteSetting)
            .filter(
                or_(
                    SiteSetting.logo_media_id == asset.id,
                    SiteSetting.favicon_media_id == asset.id,
                    SiteSetting.logo_url.contains(media_path),
                    SiteSetting.favicon_url.contains(media_path),
                )
            )
            .all()
        )

        for settings in site_settings:
            if (
                settings.logo_media_id == asset.id
                or self._contains_media_path(settings.logo_url, media_path)
            ):
                add_usage("site_logo", settings.id, "Site logo")

            if (
                settings.favicon_media_id == asset.id
                or self._contains_media_path(settings.favicon_url, media_path)
            ):
                add_usage("favicon", settings.id, "Site favicon")

        blogs = (
            self.db.query(Blog)
            .filter(
                or_(
                    Blog.image_media_id == asset.id,
                    Blog.image_url.contains(media_path),
                    Blog.content.contains(media_path),
                )
            )
            .all()
        )

        for blog in blogs:
            if (
                blog.image_media_id == asset.id
                or self._contains_media_path(blog.image_url, media_path)
            ):
                add_usage(
                    "blog_featured_image",
                    blog.id,
                    f"{blog.title} — featured image",
                )

            if self._contains_media_path(blog.content, media_path):
                add_usage(
                    "blog_content",
                    blog.id,
                    f"{blog.title} — article content",
                )

        case_studies = (
            self.db.query(CaseStudy)
            .filter(
                or_(
                    CaseStudy.image_media_id == asset.id,
                    CaseStudy.image_url.contains(media_path),
                    CaseStudy.challenge.contains(media_path),
                    CaseStudy.solution.contains(media_path),
                )
            )
            .all()
        )

        for case_study in case_studies:
            if (
                case_study.image_media_id == asset.id
                or self._contains_media_path(case_study.image_url, media_path)
            ):
                add_usage(
                    "case_study_featured_image",
                    case_study.id,
                    f"{case_study.title} — featured image",
                )

            if self._contains_media_path(case_study.challenge, media_path):
                add_usage(
                    "case_study_challenge",
                    case_study.id,
                    f"{case_study.title} — challenge",
                )

            if self._contains_media_path(case_study.solution, media_path):
                add_usage(
                    "case_study_solution",
                    case_study.id,
                    f"{case_study.title} — solution",
                )

        technologies = (
            self.db.query(Technology)
            .filter(
                or_(
                    Technology.logo_media_id == asset.id,
                    Technology.logo_url.contains(media_path),
                    Technology.description.contains(media_path),
                )
            )
            .all()
        )

        for technology in technologies:
            if (
                technology.logo_media_id == asset.id
                or self._contains_media_path(technology.logo_url, media_path)
            ):
                add_usage(
                    "technology_logo",
                    technology.id,
                    f"{technology.name} — logo",
                )

            if self._contains_media_path(technology.description, media_path):
                add_usage(
                    "technology_description",
                    technology.id,
                    f"{technology.name} — description",
                )

        services = (
            self.db.query(Service)
            .filter(Service.description.contains(media_path))
            .all()
        )

        for service in services:
            add_usage(
                "service_description",
                service.id,
                f"{service.title} — description",
            )

        return usage

    @staticmethod
    def _contains_media_path(
        value: str | None,
        media_path: str,
    ) -> bool:
        return bool(value and media_path in value)

"""

text = text[:start] + replacement + text[end:]
path.write_text(text)

print("Embedded media usage tracking patch applied.")
