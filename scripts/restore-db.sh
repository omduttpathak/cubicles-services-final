#!/usr/bin/env bash
set -Eeuo pipefail

PROJECT_ROOT="$(
  cd "$(dirname "${BASH_SOURCE[0]}")/.." &&
  pwd
)"

cd "$PROJECT_ROOT"

ENV_FILE="${ENV_FILE:-.env}"
BACKUP_FILE="${1:-database/cubicles_services_complete_backup.sql.gz}"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "Error: $ENV_FILE was not found."
  echo "Create it from .env.example before running this script."
  exit 1
fi

if [[ ! -f "$BACKUP_FILE" ]]; then
  echo "Error: database dump was not found:"
  echo "  $BACKUP_FILE"
  exit 1
fi

gzip -t "$BACKUP_FILE"

set -a
# shellcheck disable=SC1090
source "$ENV_FILE"
set +a

MYSQL_DATABASE="${MYSQL_DATABASE:-cubicles_services}"

echo "Starting MySQL..."
docker compose up -d mysql

echo "Waiting for MySQL to become healthy..."

for attempt in $(seq 1 60); do
  STATUS="$(
    docker inspect \
      --format='{{if .State.Health}}{{.State.Health.Status}}{{else}}{{.State.Status}}{{end}}' \
      cubicles-mysql \
      2>/dev/null ||
    true
  )"

  if [[ "$STATUS" == "healthy" ]]; then
    break
  fi

  if [[ "$attempt" -eq 60 ]]; then
    echo "Error: MySQL did not become healthy in time."
    docker compose logs mysql --tail=100
    exit 1
  fi

  sleep 2
done

echo "Restoring database from:"
echo "  $BACKUP_FILE"

gzip -dc "$BACKUP_FILE" |
  docker exec -i cubicles-mysql \
    mysql \
      -uroot \
      -p"$MYSQL_ROOT_PASSWORD" \
      --default-character-set=utf8mb4

echo "Database restore completed successfully."

docker exec cubicles-mysql \
  mysql \
    -N \
    -uroot \
    -p"$MYSQL_ROOT_PASSWORD" \
    -e "
      SELECT CONCAT(
        'Database: ',
        '${MYSQL_DATABASE}',
        ' | Tables: ',
        COUNT(*)
      )
      FROM information_schema.tables
      WHERE table_schema = '${MYSQL_DATABASE}';
    "
