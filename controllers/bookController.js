const db = require("../db");
const CustomNotFoundError = require("../errors/CustomNotFoundError");

const asyncHandler = require("express-async-handler");

const getBookById = asyncHandler(async (req, res) => {
  const { bookId } = req.params;

  const book = await db.getBookById(Number(bookId));

  if (!book) {
    throw new CustomNotFoundError("Book not found");
  }

  res.send(`Book Name: ${book.name}`);
});
module.exports = { getBookById };
