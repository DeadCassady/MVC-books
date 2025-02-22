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
router.get("/v1", getBookPage);
router.post("/v1", turnThePage);
router.get("/v1/book/:id", getPage);
router.post("/v1/book/:id", updateClicks);

//admin routes
router.get("/admin/v1", auth, showPage);
router.post("/admin/v1", switchList);
router.delete("/admin/v1", softDel);
router.post("/admin/v1/newBook", upload.single("image"), addBook);

const {
  getBookPageV2,
  turnThePageV2,
  getPageV2,
} = require("../controllers/v2/pagev2");
const {
  showPageV2,
  switchListV2,
  addBookV2,
} = require("../controllers/v2/adminv2");

//The library routes
router.get("/v2", getBookPageV2);
router.post("/v2", turnThePageV2);
router.get("/v2/book/:id", getPageV2);
router.post("/v2/book/:id", updateClicks);

//admin routes
router.get("/admin/v2", auth, showPageV2);
router.post("/admin/v2", switchListV2);
router.delete("/admin/v2", softDel);
router.post("/admin/v2/newBook", upload.single("image"), addBookV2);

module.exports = router;
