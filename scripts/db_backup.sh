#!/bin/bash
set -e

# Конфігурація

DB_USER=$(grep '^user' ~/.my.cnf | cut -d= -f2 | tr -d ' ')
DB_PASSWORD=$(grep '^password' ~/.my.cnf | cut -d= -f2 | tr -d ' ')
DB_NAME=$(grep '^database' ~/.my.cnf | cut -d= -f2 | tr -d ' ')
BACKUP_DIR="./books_backups"
DATE=$(date +"%Y-%m-%d_%H-%M-%S")

# Створюємо папку для бекапу, якщо її немає
mkdir -p $BACKUP_DIR

# Робимо бекап з mysqldump
if ! mysqldump -u "$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" > "$BACKUP_DIR/backup_$DATE.sql"; then
  echo "❌ Помилка при створенні бекапу!"
  exit 1
fi

gzip "$BACKUP_DIR/backup_$DATE.sql"
find "$BACKUP_DIR" -name "backup_*.sql.gz" -mtime +7 -delete

echo "✅ Бекап $BACKUP_DIR/backup_$DATE.sql.gz створено успішно!"