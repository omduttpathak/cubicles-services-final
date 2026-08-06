"""Create contacts table

Revision ID: b15457a35f91
Revises:
Create Date: 2026-07-19 17:13:54.138911
"""

from collections.abc import Sequence

from alembic import op
import sqlalchemy as sa


revision: str = "b15457a35f91"
down_revision: str | Sequence[str] | None = None
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.create_table(
        "contacts",
        sa.Column(
            "id",
            sa.Integer(),
            nullable=False,
        ),
        sa.Column(
            "full_name",
            sa.String(length=150),
            nullable=False,
        ),
        sa.Column(
            "email",
            sa.String(length=255),
            nullable=False,
        ),
        sa.Column(
            "company",
            sa.String(length=150),
            nullable=True,
        ),
        sa.Column(
            "phone",
            sa.String(length=30),
            nullable=True,
        ),
        sa.Column(
            "service",
            sa.String(length=100),
            nullable=True,
        ),
        sa.Column(
            "message",
            sa.Text(),
            nullable=False,
        ),
        sa.Column(
            "created_at",
            sa.DateTime(),
            server_default=sa.text("CURRENT_TIMESTAMP"),
            nullable=False,
        ),
        sa.PrimaryKeyConstraint("id"),
    )

    op.create_index(
        op.f("ix_contacts_id"),
        "contacts",
        ["id"],
        unique=False,
    )


def downgrade() -> None:
    op.drop_index(
        op.f("ix_contacts_id"),
        table_name="contacts",
    )

    op.drop_table("contacts")
