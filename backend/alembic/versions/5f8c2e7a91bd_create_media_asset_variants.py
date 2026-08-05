"""create media asset variants table

Revision ID: 5f8c2e7a91bd
Revises: 3b7e9a1c5d42
Create Date: 2026-08-05 18:10:00.000000
"""

from collections.abc import Sequence

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

revision: str = "5f8c2e7a91bd"
down_revision: str | Sequence[str] | None = "3b7e9a1c5d42"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.create_table(
        "media_asset_variants",
        sa.Column("id", sa.BigInteger(), autoincrement=True, nullable=False),
        sa.Column("media_asset_id", sa.BigInteger(), nullable=False),
        sa.Column("variant_name", sa.String(length=30), nullable=False),
        sa.Column("filename", sa.String(length=255), nullable=False),
        sa.Column("mime_type", sa.String(length=100), nullable=False),
        sa.Column("extension", sa.String(length=20), nullable=False),
        sa.Column("file_size", sa.BigInteger(), nullable=False),
        sa.Column("width", sa.Integer(), nullable=False),
        sa.Column("height", sa.Integer(), nullable=False),
        sa.Column("checksum", sa.String(length=64), nullable=False),
        sa.Column("file_data", mysql.LONGBLOB(), nullable=False),
        sa.Column(
            "created_at",
            sa.DateTime(),
            server_default=sa.text("CURRENT_TIMESTAMP"),
            nullable=False,
        ),
        sa.ForeignKeyConstraint(
            ["media_asset_id"],
            ["media_assets.id"],
            name="fk_media_asset_variants_media_asset_id",
            ondelete="CASCADE",
        ),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint(
            "media_asset_id",
            "variant_name",
            name="uq_media_asset_variants_asset_variant",
        ),
    )
    op.create_index(op.f("ix_media_asset_variants_id"), "media_asset_variants", ["id"], unique=False)
    op.create_index(op.f("ix_media_asset_variants_media_asset_id"), "media_asset_variants", ["media_asset_id"], unique=False)
    op.create_index(op.f("ix_media_asset_variants_variant_name"), "media_asset_variants", ["variant_name"], unique=False)
    op.create_index(op.f("ix_media_asset_variants_checksum"), "media_asset_variants", ["checksum"], unique=False)


def downgrade() -> None:
    op.drop_index(op.f("ix_media_asset_variants_checksum"), table_name="media_asset_variants")
    op.drop_index(op.f("ix_media_asset_variants_variant_name"), table_name="media_asset_variants")
    op.drop_index(op.f("ix_media_asset_variants_media_asset_id"), table_name="media_asset_variants")
    op.drop_index(op.f("ix_media_asset_variants_id"), table_name="media_asset_variants")
    op.drop_table("media_asset_variants")
