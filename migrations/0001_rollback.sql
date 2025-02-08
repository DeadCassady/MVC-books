START TRANSACTION;

-- 1. Add the 'author' column back to the 'books' table
-- ALTER TABLE books ADD COLUMN author VARCHAR(255);

-- 2. Restore the original author data into the 'books' table
UPDATE books b
JOIN books_authors ba ON b.id = ba.book_id
JOIN authors a ON ba.author_id = a.id
SET b.author = a.name;

-- 3. Drop the intermediary table (books_authors)
DROP TABLE books_authors;

-- 4. Drop the new 'authors' table
DROP TABLE authors;

-- DROP TABLE migrations_history;

COMMIT;