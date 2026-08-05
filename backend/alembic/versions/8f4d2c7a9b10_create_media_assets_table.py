"""create media assets table

Revision ID: 8f4d2c7a9b10
Revises: 2874ffa7db34
Create Date: 2026-08-04 17:20:00.000000

"""

from collections.abc import Sequence

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql


revision: str = "8f4d2c7a9b10"
down_revision: str | Sequence[str] | None = "2874ffa7db34"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.create_table(
        "media_assets",
        sa.Column(
            "id",
            sa.BigInteger(),
            autoincrement=True,
            nullable=False,
        ),
        sa.Column(
            "public_id",
            sa.String(length=36),
            nullable=False,
        ),
        sa.Column(
            "filename",
            sa.String(length=255),
            nullable=False,
        ),
        sa.Column(
            "original_filename",
            sa.String(length=255),
            nullable=False,
        ),
        sa.Column(
            "mime_type",
            sa.String(length=100),
            nullable=False,
        ),
        sa.Column(
            "extension",
            sa.String(length=20),
            nullable=False,
        ),
        sa.Column(
            "file_size",
            sa.BigInteger(),
            nullable=False,
        ),
        sa.Column(
            "width",
            sa.Integer(),
            nullable=True,
        ),
        sa.Column(
            "height",
            sa.Integer(),
            nullable=True,
        ),
        sa.Column(
            "checksum",
            sa.String(length=64),
            nullable=False,
        ),
        sa.Column(
            "title",
            sa.String(length=255),
            nullable=True,
        ),
        sa.Column(
            "alt_text",
            sa.String(length=500),
            nullable=True,
        ),
        sa.Column(
            "description",
            sa.Text(),
            nullable=True,
        ),
        sa.Column(
            "file_data",
            mysql.LONGBLOB(),
            nullable=False,
        ),
        sa.Column(
            "created_at",
            sa.DateTime(),
            server_default=sa.text("CURRENT_TIMESTAMP"),
            nullable=False,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(),
            server_default=sa.text("CURRENT_TIMESTAMP"),
            nullable=False,
        ),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("public_id"),
    )

    op.create_index(
        op.f("ix_media_assets_id"),
        "media_assets",
        ["id"],
        unique=False,
    )

    op.create_index(
        op.f("ix_media_assets_public_id"),
        "media_assets",
        ["public_id"],
        unique=True,
    )

    op.create_index(
        op.f("ix_media_assets_mime_type"),
        "media_assets",
        ["mime_type"],
        unique=False,
    )

    op.create_index(
        op.f("ix_media_assets_checksum"),
        "media_assets",
        ["checksum"],
        unique=False,
    )


def downgrade() -> None:
    op.drop_index(
        op.f("ix_media_assets_checksum"),
        table_name="media_assets",
    )

    op.drop_index(
        op.f("ix_media_assets_mime_type"),
        table_name="media_assets",
    )

    op.drop_index(
        op.f("ix_media_assets_public_id"),
        table_name="media_assets",
    )

    op.drop_index(
        op.f("ix_media_assets_id"),
        table_name="media_assets",
    )

    op.drop_table("media_assets")
