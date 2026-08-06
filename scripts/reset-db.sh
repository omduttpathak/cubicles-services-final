#!/usr/bin/env bash
set -Eeuo pipefail

PROJECT_ROOT="$(
  cd "$(dirname "${BASH_SOURCE[0]}")/.." &&
  pwd
)"

cd "$PROJECT_ROOT"

BACKUP_FILE="${1:-database/cubicles_services_complete_backup.sql.gz}"

if [[ ! -f "$BACKUP_FILE" ]]; then
  echo "Error: database dump was not found:"
  echo "  $BACKUP_FILE"
  exit 1
fi

echo "WARNING: This will permanently delete the current Docker database volume."
echo "The database will then be restored from:"
echo "  $BACKUP_FILE"
echo

read -r -p "Type RESET to continue: " CONFIRMATION

if [[ "$CONFIRMATION" != "RESET" ]]; then
  echo "Database reset cancelled."
  exit 0
fi

echo "Stopping the application..."
docker compose down

VOLUME_NAME="$(
  docker compose config --format json |
  python3 -c '
import json
import sys

config = json.load(sys.stdin)
volume = config["volumes"]["mysql_data"]
print(volume.get("name", ""))
'
)"

if [[ -z "$VOLUME_NAME" ]]; then
  echo "Error: unable to determine the MySQL volume name."
  exit 1
fi

if docker volume inspect "$VOLUME_NAME" >/dev/null 2>&1; then
  echo "Removing database volume: $VOLUME_NAME"
  docker volume rm "$VOLUME_NAME"
else
  echo "Database volume does not exist yet: $VOLUME_NAME"
fi

"$PROJECT_ROOT/scripts/restore-db.sh" "$BACKUP_FILE"

echo "Starting backend and frontend..."
docker compose up -d backend frontend

echo
docker compose ps
