DB_USER=$(grep '^user' ~/.my.cnf | cut -d= -f2 | tr -d ' ')
DB_PASSWORD=$(grep '^password' ~/.my.cnf | cut -d= -f2 | tr -d ' ')
DB_NAME=$(grep '^database' ~/.my.cnf | cut -d= -f2 | tr -d ' ')

# Параметр X: видаляти записи, видалені більше 30 днів тому (налаштуйте за потребою)
X_DAYS=30

# Виконуємо SQL-запит через mysql CLI
mysql -u $DB_USER -p$DB_PASSWORD $DB_NAME <<EOF
BEGIN;

-- Видаляємо зв'язки книги з авторами (якщо книжка "видалена")
DELETE FROM books_authors 
WHERE book_id IN (
  SELECT id 
  FROM books 
  WHERE deleted_at <= NOW() - INTERVAL $X_DAYS DAY
);

-- Видаляємо самі книжки
DELETE FROM books 
WHERE deleted_at <= NOW() - INTERVAL $X_DAYS DAY;

-- Опціонально: видаляємо авторів, які більше не мають книжок
DELETE FROM authors 
WHERE id NOT IN (
  SELECT author_id 
  FROM books_authors
);

COMMIT;
EOF

echo "Soft deletions старші за $X_DAYS днів видалено!"