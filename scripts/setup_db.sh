#!/bin/bash
DB_NAME=$(grep '^database' ~/.my.cnf | cut -d= -f2 | tr -d ' ')
DB_USER=$(grep '^user' ~/.my.cnf | cut -d= -f2 | tr -d ' ')
DB_PASS=$(grep '^password' ~/.my.cnf | cut -d= -f2 | tr -d ' ')


# Get list of migrations
SCRIPTS=$(ls migrations/setup/*.sql | sort)
ECHO SCRIPTS

for FILE in $SCRIPTS; do
    
    if [ -z "$EXISTS" ]; then
        echo "Running $FILE"
        if ! mysql -u $DB_USER -p$DB_PASS --default-character-set=utf8mb4 $DB_NAME < "$FILE"; then
            echo "Error applying $FILENAME"
            exit 1
        fi
        # Record migration
    fi
done

echo "All migrations applied successfully!"
