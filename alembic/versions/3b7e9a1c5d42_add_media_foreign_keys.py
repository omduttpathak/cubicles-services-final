"""add media foreign keys to content tables

Revision ID: 3b7e9a1c5d42
Revises: 8f4d2c7a9b10
"""
from collections.abc import Sequence
from alembic import op
import sqlalchemy as sa
revision: str = "3b7e9a1c5d42"
down_revision: str | Sequence[str] | None = "8f4d2c7a9b10"
branch_labels = None
depends_on = None

def upgrade() -> None:
    op.add_column("site_settings", sa.Column("logo_media_id", sa.BigInteger(), nullable=True))
    op.add_column("site_settings", sa.Column("favicon_media_id", sa.BigInteger(), nullable=True))
    op.create_index(op.f("ix_site_settings_logo_media_id"), "site_settings", ["logo_media_id"], unique=False)
    op.create_index(op.f("ix_site_settings_favicon_media_id"), "site_settings", ["favicon_media_id"], unique=False)
    op.create_foreign_key("fk_site_settings_logo_media_id_media_assets", "site_settings", "media_assets", ["logo_media_id"], ["id"], ondelete="SET NULL")
    op.create_foreign_key("fk_site_settings_favicon_media_id_media_assets", "site_settings", "media_assets", ["favicon_media_id"], ["id"], ondelete="SET NULL")
    op.add_column("blogs", sa.Column("image_media_id", sa.BigInteger(), nullable=True))
    op.create_index(op.f("ix_blogs_image_media_id"), "blogs", ["image_media_id"], unique=False)
    op.create_foreign_key("fk_blogs_image_media_id_media_assets", "blogs", "media_assets", ["image_media_id"], ["id"], ondelete="SET NULL")
    op.add_column("case_studies", sa.Column("image_media_id", sa.BigInteger(), nullable=True))
    op.create_index(op.f("ix_case_studies_image_media_id"), "case_studies", ["image_media_id"], unique=False)
    op.create_foreign_key("fk_case_studies_image_media_id_media_assets", "case_studies", "media_assets", ["image_media_id"], ["id"], ondelete="SET NULL")
    op.add_column("technologies", sa.Column("logo_media_id", sa.BigInteger(), nullable=True))
    op.create_index(op.f("ix_technologies_logo_media_id"), "technologies", ["logo_media_id"], unique=False)
    op.create_foreign_key("fk_technologies_logo_media_id_media_assets", "technologies", "media_assets", ["logo_media_id"], ["id"], ondelete="SET NULL")

def downgrade() -> None:
    op.drop_constraint("fk_technologies_logo_media_id_media_assets", "technologies", type_="foreignkey")
    op.drop_index(op.f("ix_technologies_logo_media_id"), table_name="technologies")
    op.drop_column("technologies", "logo_media_id")
    op.drop_constraint("fk_case_studies_image_media_id_media_assets", "case_studies", type_="foreignkey")
    op.drop_index(op.f("ix_case_studies_image_media_id"), table_name="case_studies")
    op.drop_column("case_studies", "image_media_id")
    op.drop_constraint("fk_blogs_image_media_id_media_assets", "blogs", type_="foreignkey")
    op.drop_index(op.f("ix_blogs_image_media_id"), table_name="blogs")
    op.drop_column("blogs", "image_media_id")
    op.drop_constraint("fk_site_settings_favicon_media_id_media_assets", "site_settings", type_="foreignkey")
    op.drop_constraint("fk_site_settings_logo_media_id_media_assets", "site_settings", type_="foreignkey")
    op.drop_index(op.f("ix_site_settings_favicon_media_id"), table_name="site_settings")
    op.drop_index(op.f("ix_site_settings_logo_media_id"), table_name="site_settings")
    op.drop_column("site_settings", "favicon_media_id")
    op.drop_column("site_settings", "logo_media_id")
