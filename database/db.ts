const mysql = require("mysql2");
const config = require("../config");

const dbUsed = "books";
const authorsDb = "books_authors";

const pool = mysql
  .createPool({
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database,
  })
  .promise();

exports.getBooks = async function () {
  const [row] = await pool.query(
    `
    SELECT * 
    FROM ${dbUsed}
    `
  );
  return row;
};

exports.getBook = async function (id: number) {
  const [row] = await pool.query(
    `
    SELECT * 
    FROM ${dbUsed}
    WHERE id = ? 
    `,
    [id]
  );
  return row;
};

exports.searchBook = async function (str: string) {
  const [row] = await pool.query(
    `
    SELECT *
    FROM ${dbUsed}
    WHERE title LIKE ? 
    `,
    ["%" + str + "%"]
  );
  return row;
};

exports.updateViewsInDb = async function (id: number) {
  await pool.query(
    `
        UPDATE ${dbUsed}
        SET views = views+1
        WHERE id = ?
    `,
    [id]
  );
};

exports.updateClicksInDb = async function (id: number) {
  await pool.query(
    `
        UPDATE ${dbUsed}
        SET clicks = clicks+1
        WHERE id = ?
    `,
    [id]
  );
};

exports.setDeleted = async (id: number) => {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
  const hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
  const minutes =
    date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
  const seconds =
    date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();

  const deletionDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  await pool.query(
    `
        UPDATE ${dbUsed}
        SET deleted_at = ?
        WHERE id = ?
    `,
    [deletionDate, id]
  );

  return "ok";
};

exports.addBookToDb = async (
  title: string,
  author: string,
  year: number,
  pages: number,
  fileName: string
) => {
  await pool.query(
    `
        INSERT INTO ${dbUsed}
        (title, author, year, pages, cover_name)
        VALUES ( ?, ?, ?, ?, ?)
    `,
    [title, author, year, pages, fileName]
  );
};

//v2

exports.getAuthor = async (id: number) => {
  const [authorId] = await pool.query(
    `
      SELECT * FROM books_authors
      WHERE book_id = ?
    
    `,
    [id]
  );
  const [author] = await pool.query(
    `
    SELECT * FROM authors 
    WHERE author_id = ?
    `,
    [authorId.author_id]
  );

  return author;
};

exports.getAuthors = async () => {
  const [authors] = await pool.query(
    `
    SELECT * FROM authors 
  
  `
  );
  return authors;
};

exports.getBooksAuthors = async () => {
  const [row] = await pool.query(
    `
    SELECT * FROM books_authors
    `
  );
  return row;
};

exports.getRespectiveAuthors = async (bookId: number) => {
  const [[row]] = await pool.query(
    `SELECT * FROM books_authors
    WHERE book_id = ?`,
    [bookId]
  );
  const [[author]] = await pool.query(
    `SELECT * FROM authors
    WHERE id =?`,
    [row.author_id]
  );

  // console.log(
  //   `BookId: ${bookId},
  //   AuthorId: ${row.author_id},
  //   author:${author.id},
  //   name:${author.name}`
  // );

  return author;
};

exports.addBookToDbV2 = async (
  title: string,
  authors: string[],
  year: number,
  pages: number,
  fileName: string
) => {
  await pool.query(
    `
        INSERT INTO ${dbUsed}
        (title, year, pages, cover_name)
        VALUES ( ?, ?, ?, ?)
    `,
    [title, year, pages, fileName]
  );
};
