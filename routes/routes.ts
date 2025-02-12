const express = require("express");
const path = require("path");
import { Request } from "express";
import multer, { StorageEngine } from "multer";

const storage: StorageEngine = multer.diskStorage({
  destination: path.join(__dirname, "../src/public/books-page"),
  filename: (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void
  ) => {
    const name = file.originalname;
    cb(null, `${name}`);
  },
});

const upload = multer({ storage });

const {
  getBookPage,
  turnThePage,
  getPage,
  updateClicks,
} = require("../controllers/v1/pageController");
const {
  showPage,
  switchList,
  auth,
  softDel,
  addBook,
} = require("../controllers/v1/adminController");

const router = express.Router();

//The library routes
router.get("/", getBookPage);
router.post("/", turnThePage);
router.get("/book/:id", getPage);
router.post("/book/:id", updateClicks);

//admin routes
router.get("/admin", auth, showPage);
router.post("/admin", switchList);
router.delete("/admin", softDel);
router.post("/admin/newBook", upload.single("image"), addBook);

module.exports = router;
