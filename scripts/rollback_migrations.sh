
#!/bin/bash
DB_NAME=$(grep '^database' ~/.my.cnf | cut -d= -f2 | tr -d ' ')
DB_USER=$(grep '^user' ~/.my.cnf | cut -d= -f2 | tr -d ' ')
DB_PASS=$(grep '^password' ~/.my.cnf | cut -d= -f2 | tr -d ' ')
FILE='./migrations/0001_rollback.sql'

# Create history table if not exists
mysql -u $DB_USER -p$DB_PASS $DB_NAME < migrations/_migrations_history.sql

# Get list of migrations
MIGRATIONS=$(ls migrations/*.sql | grep -v _migrations_history.sql | sort)

    # Check if migration already ran
EXISTS=$(mysql -u $DB_USER -p$DB_PASS $DB_NAME -sN -e "SELECT 1 FROM migration_history WHERE migration_name='$FILE' LIMIT 1")

if [ -z "$EXISTS" ]; then
    echo "Running $FILE"
    if ! mysql -u $DB_USER -p$DB_PASS --default-character-set=utf8mb4 $DB_NAME < "$FILE"; then
        echo "Error applying $FILE"
        exit 1
    fi
    # Record migration
    mysql -u $DB_USER -p$DB_PASS $DB_NAME -e "INSERT INTO migration_history (migration_name) VALUES ('$FILE')"
fi

echo "All migrations applied successfully!"