"""Remove redundant media public_id index.

Revision ID: fdaeeedf259a
Revises: 5062da617f74
"""

from collections.abc import Sequence

from alembic import op
import sqlalchemy as sa
from sqlalchemy.engine import Connection


revision: str = "fdaeeedf259a"
down_revision: str | Sequence[str] | None = "5062da617f74"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def _index_exists(
    connection: Connection,
    table_name: str,
    index_name: str,
) -> bool:
    inspector = sa.inspect(connection)

    return any(
        index["name"] == index_name
        for index in inspector.get_indexes(table_name)
    )


def upgrade() -> None:
    connection = op.get_bind()

    if _index_exists(
        connection,
        "media_assets",
        "public_id",
    ):
        op.drop_index(
            "public_id",
            table_name="media_assets",
        )


def downgrade() -> None:
    # The removed index duplicated the existing unique index
    # ix_media_assets_public_id, so recreating it is unnecessary.
    pass
