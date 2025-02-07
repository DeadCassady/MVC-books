const express = require("express");
import bodyParser from "body-parser";
const app = express();
const path = require("path");
const routes = require("../routes/routes");

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use("/admin", express.static(path.join(__dirname, "public")));
app.use("/book/:id", express.static(path.join(__dirname, "public")));

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", routes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
