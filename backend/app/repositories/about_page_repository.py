from sqlalchemy.orm import Session

from app.models.about_page import AboutPage
from app.schemas.about_page import AboutPageUpdate


class AboutPageRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_active(self) -> AboutPage | None:
        return (
            self.db.query(AboutPage)
            .filter(AboutPage.is_active.is_(True))
            .order_by(AboutPage.id.asc())
            .first()
        )

    def get_settings(self) -> AboutPage | None:
        return self.db.query(AboutPage).order_by(AboutPage.id.asc()).first()

    def create(
        self,
        data: AboutPageUpdate,
    ) -> AboutPage:
        about = AboutPage(
            **data.model_dump(),
        )

        self.db.add(about)
        self.db.commit()
        self.db.refresh(about)

        return about

    def update(
        self,
        about: AboutPage,
        data: AboutPageUpdate,
    ) -> AboutPage:
        for field, value in data.model_dump().items():
            setattr(about, field, value)

        self.db.commit()
        self.db.refresh(about)

        return about
