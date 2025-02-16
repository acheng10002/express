const { Router } = require("express");
const { getBookById } = require("../controllers/bookController");

const bookRouter = Router();

bookRouter.get("/", (req, res) => res.send("All books"));
bookRouter.get(
  "/:bookId",
  getBookById
  /* (req, res) => {
  const { bookId } = req.params;
  res.send(`Book ID: ${bookId}`); */
);

bookRouter.get("/:bookId/reserve", (req, res) => {
  const { bookId } = req.params;
  res.send(`${bookId} Reserved`);
});

bookRouter.post("/:bookId/reserve", (req, res) => {
  const { bookId } = req.params;
  res.send(`Reserve ${bookId}`);
});

module.exports = bookRouter;
