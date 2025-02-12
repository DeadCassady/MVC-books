import { Request, Response, NextFunction } from "express";
const { getBooks, setDeleted, addBookToDb } = require("../../database/db");

const listConfig = {
  start: 0,
  finish: 5,
};

exports.showPage = async (req: Request, res: Response) => {
  const books = await getBooks();
  const booksDisplayed = books.slice(listConfig.start, listConfig.finish);

  res.render("admin", {
    allBooks: booksDisplayed,
    pages: books.length / 5,
  });
};

exports.switchList = async (req: Request, res: Response) => {
  const { page } = req.body;

  listConfig.start = 5 * (page - 1);
  listConfig.finish = 5 * page;
  res.redirect("/admin");
};

exports.auth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Basic ")) {
    res.set("WWW-Authenticate", 'Basic realm="Restricted Area"');
    return res.status(401).send("Authentication required");
  }

  const base64Credentials = authHeader.split(" ")[1];
  const credentials = Buffer.from(base64Credentials, "base64").toString(
    "utf-8"
  );
  const [username, password] = credentials.split(":");

  if (username === "admin" && password === "pass") {
    next();
  } else {
    res.set("WWW-Authenticate", 'Basic realm="Restricted Area"');
    res.status(401).send("Invalid username or password");
  }
};

exports.softDel = async (req: Request, res: Response) => {
  try {
    const { deleteId } = req.body;
    const deleteStatus = await setDeleted(deleteId);

    if (deleteStatus) {
      res.status(200).json({ status: `Book ${deleteId} has been deleted` });
    } else {
      res.status(400).json({ status: `Book ${deleteId} wasn't found` });
    }
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.addBook = async (req: Request, res: Response) => {
  try {
    const { title, author, author2, author3, published, pages } = JSON.parse(
      req.body.metadata
    );
    const fileName = req.file?.originalname;
    const allAuthors = authorString(author, author2, author3);

    await addBookToDb(title, allAuthors, published, pages, fileName).catch(() =>
      res.status(404)
    );

    res.status(200).json({ status: "ok" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

function authorString(author: string, author2?: string, author3?: string) {
  if (author2 && author3) {
    return `${author}, ${author2}, ${author3}`;
  } else if (author2) {
    return `${author}, ${author2}`;
  } else if (author3) {
    return `${author}, ${author3}`;
  }
  return `${author}`;
}
