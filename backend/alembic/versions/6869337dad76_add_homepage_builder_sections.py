"""add homepage builder sections

Revision ID: 6869337dad76
Revises: 1a5b1f679d6a
Create Date: 2026-07-22 15:12:57.089382
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "6869337dad76"
down_revision: Union[str, Sequence[str], None] = (
    "1a5b1f679d6a"
)
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Add homepage builder JSON sections."""

    # First add nullable columns because the homepage
    # table already contains an existing row.
    op.add_column(
        "homepage",
        sa.Column(
            "stats",
            sa.JSON(),
            nullable=True,
        ),
    )

    op.add_column(
        "homepage",
        sa.Column(
            "why_choose_us",
            sa.JSON(),
            nullable=True,
        ),
    )

    op.add_column(
        "homepage",
        sa.Column(
            "industries",
            sa.JSON(),
            nullable=True,
        ),
    )

    op.add_column(
        "homepage",
        sa.Column(
            "testimonials",
            sa.JSON(),
            nullable=True,
        ),
    )

    op.add_column(
        "homepage",
        sa.Column(
            "faq",
            sa.JSON(),
            nullable=True,
        ),
    )

    # Populate existing homepage rows.
    op.execute(
        """
        UPDATE homepage
        SET
            stats = JSON_ARRAY(),
            why_choose_us = JSON_ARRAY(),
            industries = JSON_ARRAY(),
            testimonials = JSON_ARRAY(),
            faq = JSON_ARRAY()
        """
    )

    # After every row has a value, enforce NOT NULL.
    op.alter_column(
        "homepage",
        "stats",
        existing_type=sa.JSON(),
        nullable=False,
    )

    op.alter_column(
        "homepage",
        "why_choose_us",
        existing_type=sa.JSON(),
        nullable=False,
    )

    op.alter_column(
        "homepage",
        "industries",
        existing_type=sa.JSON(),
        nullable=False,
    )

    op.alter_column(
        "homepage",
        "testimonials",
        existing_type=sa.JSON(),
        nullable=False,
    )

    op.alter_column(
        "homepage",
        "faq",
        existing_type=sa.JSON(),
        nullable=False,
    )


def downgrade() -> None:
    """Remove homepage builder JSON sections."""

    op.drop_column("homepage", "faq")
    op.drop_column("homepage", "testimonials")
    op.drop_column("homepage", "industries")
    op.drop_column("homepage", "why_choose_us")
    op.drop_column("homepage", "stats")
