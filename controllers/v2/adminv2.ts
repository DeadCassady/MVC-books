import { Request, Response, NextFunction } from "express";
const {
  getBooks,
  setDeleted,
  getAuthors,
  getBooksAuthors,
  addBookToDbV2,
} = require("../../database/db");

type Book = {
  id: number;
};
type author = {
  id: number;
  name: string;
};
const listConfig = {
  start: 0,
  finish: 5,
};

const findAuthors = async (books: Book[]) => {
  const authors = await getAuthors();
  const booksAuthors = await getBooksAuthors();
  return books.map((book: Book) => {
    const authorId = booksAuthors[book.id].author_id;
    return authors[authorId];
  });
};
exports.showPageV2 = async (req: Request, res: Response) => {
  const books = await getBooks();
  const booksDisplayed = books.slice(listConfig.start, listConfig.finish);
  const authorsOnPage = await findAuthors(booksDisplayed);
  res.render("admin", {
    version: "v2",
    allBooks: booksDisplayed,
    pages: books.length / 5,
    authors: authorsOnPage,
  });
};

exports.switchListV2 = async (req: Request, res: Response) => {
  const { page } = req.body;

  listConfig.start = 5 * (page - 1);
  listConfig.finish = 5 * page;
  res.redirect("/admin/v2");
};

exports.addBookV2 = async (req: Request, res: Response) => {
  try {
    const { title, author, author2, author3, published, pages } = JSON.parse(
      req.body.metadata
    );
    const fileName = req.file?.originalname;

    await addBookToDbV2(
      title,
      [author, author2, author3],
      published,
      pages,
      fileName
    ).catch(() => res.status(404));

    res.status(200).json({ status: "ok" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
