import { Request, Response } from "express";
const {
  getBooks,
  getBook,
  searchBook,
  updateClicksInDb,
  updateViewsInDb,
  getAuthor,
  getAuthors,
} = require("../../database/db");

const pageParams = {
  page: 1,
  hideButton: "",
  offset: 20,
  maxPages: 2,
};

const pageConfig = {
  start: pageParams.offset * (pageParams.page - 1),
  finish: pageParams.offset * pageParams.page,
};

function updateConfig() {
  pageConfig.start = pageParams.offset * (pageParams.page - 1);
  pageConfig.finish = pageParams.offset * pageParams.page;
}

exports.getBookPageV2 = async (req: Request, res: Response) => {
  if (req.query.search) {
    displaySearched(req, res);
  } else {
    displayBooks(req, res);
  }
};

//The default get request
const displayBooks = async (req: Request, res: Response) => {
  try {
    const offset = parseInt(req.query.offset as string);
    const books = await getBooks();
    const authors = await getAuthors();
    if (offset && offset != pageParams.offset) {
      pageParams.page = 1;
      pageParams.offset = offset as number;
      pageParams.maxPages = Math.ceil(books.length / pageParams.offset);
    }
    updateConfig();
    const booksOnPage = books.slice(pageConfig.start, pageConfig.finish);
    pageParams.hideButton = "";

    if (pageParams.page <= 1) {
      pageParams.hideButton = "prev";
    } else if (pageParams.page >= pageParams.maxPages) {
      pageParams.hideButton = "next";
    }

    res.render("library", {
      version: "v2",
      books: booksOnPage,
      hide: pageParams.hideButton,
      authors: authors,
    });
  } catch {
    res.status(500);
  }
};

//This function replaces the default GET request
const displaySearched = async (req: Request, res: Response) => {
  try {
    const result = req.query.search;

    const bookSearched = await searchBook(result);
    const authors = await getAuthors();
    if (bookSearched) {
      res.render("library", {
        version: "v2",
        books: bookSearched,
        hide: "",
        authors: authors,
      });
    } else {
      res.status(400).send(`The ${result} wasn't found`);
    }
  } catch {
    res.status(500).send("Server error");
  }
};
exports.turnThePageV2 = async (req: Request, res: Response) => {
  const books = await getBooks();
  const authors = await getAuthors();
  const { result } = req.body;
  if (result == "prev" && pageParams.page > 1) {
    pageParams.page--;
  } else if (result == "next" && pageParams.page < pageParams.maxPages) {
    pageParams.page++;
  }
  updateConfig();

  const booksOnPage = books.slice(pageConfig.start, pageConfig.finish);
  pageParams.hideButton = "";

  if (pageParams.page <= 1) {
    pageParams.hideButton = "prev";
  } else if (pageParams.page >= pageParams.maxPages) {
    pageParams.hideButton = "next";
  }

  res.render("library", {
    version: "v2",
    books: booksOnPage,
    hide: pageParams.hideButton,
    authors: authors,
  });
};

//function to show the book clicked
exports.getPageV2 = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    await updateViewsInDb(id);

    const [book] = await getBook(id);
    const [author] = await getAuthor(book.id);
    if (book) {
      res.render("book", {
        bookId: book.id,
        title: book.title,
        authors: author.name,
        year: book.year,
        pages: book.pages,
      });
    } else {
      res.status(404).send("No such book");
    }
  } catch (Error) {
    res.status(500).send("Server error");
  }
};
