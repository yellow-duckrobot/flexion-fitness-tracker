#!/bin/bash
# Flexion automated MongoDB backup — run daily via cron:
#   0 3 * * * /path/to/backend/backup.sh
BACKUP_DIR="$HOME/flexion-backups"
DB_NAME="flexion"
mkdir -p "$BACKUP_DIR"
mongodump --db "$DB_NAME" --out "$BACKUP_DIR/backup-$(date +%Y%m%d-%H%M)"
echo "Backup complete: $BACKUP_DIR"