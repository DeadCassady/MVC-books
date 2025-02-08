START TRANSACTION;

-- Create new tables with proper constraints
CREATE TABLE authors (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE books_authors (
    book_id INT NOT NULL,
    author_id INT NOT NULL,
    PRIMARY KEY (book_id, author_id),
    FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (author_id) REFERENCES authors(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Migrate existing authors
INSERT INTO authors (name)
SELECT DISTINCT author FROM books;

-- Create mapping relationships
INSERT INTO books_authors (book_id, author_id)
SELECT b.id, a.id
FROM books b
JOIN authors a ON b.author = a.name;

-- Remove old author column
-- ALTER TABLE books DROP COLUMN author;

COMMIT;