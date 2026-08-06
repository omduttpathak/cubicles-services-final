#!/usr/bin/env bash
set -Eeuo pipefail

PROJECT_ROOT="$(
  cd "$(dirname "${BASH_SOURCE[0]}")/.." &&
  pwd
)"

cd "$PROJECT_ROOT"

ENV_FILE="${ENV_FILE:-.env}"
OUTPUT_FILE="${1:-database/cubicles_services_complete_backup.sql.gz}"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "Error: $ENV_FILE was not found."
  echo "Create it from .env.example before running this script."
  exit 1
fi

set -a
# shellcheck disable=SC1090
source "$ENV_FILE"
set +a

MYSQL_DATABASE="${MYSQL_DATABASE:-cubicles_services}"

if ! docker inspect cubicles-mysql >/dev/null 2>&1; then
  echo "Error: cubicles-mysql container does not exist."
  echo "Start it with: docker compose up -d mysql"
  exit 1
fi

if [[ "$(docker inspect -f '{{.State.Running}}' cubicles-mysql)" != "true" ]]; then
  echo "Error: cubicles-mysql is not running."
  exit 1
fi

mkdir -p "$(dirname "$OUTPUT_FILE")"

TEMP_FILE="${OUTPUT_FILE}.tmp"

cleanup() {
  rm -f "$TEMP_FILE"
}

trap cleanup EXIT

echo "Creating complete database backup..."

docker exec cubicles-mysql sh -c '
  exec mysqldump \
    -uroot \
    -p"$MYSQL_ROOT_PASSWORD" \
    --databases "$MYSQL_DATABASE" \
    --single-transaction \
    --quick \
    --routines \
    --triggers \
    --events \
    --hex-blob \
    --no-tablespaces \
    --set-gtid-purged=OFF \
    --default-character-set=utf8mb4
' | gzip -9 > "$TEMP_FILE"

gzip -t "$TEMP_FILE"

mv "$TEMP_FILE" "$OUTPUT_FILE"
trap - EXIT

echo
echo "Database backup completed successfully:"
ls -lh "$OUTPUT_FILE"
