#!/bin/sh
set -eu

echo "Starting Cubicles Services backend container..."

python - <<'PY'
import os
import time
from sqlalchemy import create_engine, text
from sqlalchemy.exc import SQLAlchemyError

database_url = os.environ["DATABASE_URL"]
timeout_seconds = int(os.getenv("DATABASE_WAIT_TIMEOUT", "60"))
retry_interval = float(os.getenv("DATABASE_WAIT_INTERVAL", "2"))
engine = create_engine(database_url, pool_pre_ping=True)

deadline = time.monotonic() + timeout_seconds
last_error = None

while time.monotonic() < deadline:
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))
        print("Database connection is ready.")
        break
    except SQLAlchemyError as error:
        last_error = error
        print(f"Database is not ready; retrying in {retry_interval:g} second(s)...")
        time.sleep(retry_interval)
else:
    raise SystemExit(
        f"Database did not become ready within {timeout_seconds} seconds. "
        f"Last error: {last_error}"
    )
PY

if [ "${RUN_MIGRATIONS:-true}" = "true" ]; then
    echo "Applying Alembic migrations..."
    alembic upgrade head
fi

echo "Starting application server..."
exec "$@"
