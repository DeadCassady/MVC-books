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

  console.log(deletionDate);

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
