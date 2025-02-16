const express = require("express");

const app = express();

const authorRouter = require("./routes/authorRouter");
const bookRouter = require("./routes/bookRouter");
const indexRouter = require("./routes/indexRouter");

app.use("/authors", authorRouter);
app.use("/books", bookRouter);
app.use("/", indexRouter);

const PORTONE = 8080;

app.listen(PORTONE, () => {
  console.log(`My first Express app - listening on port ${PORTONE}!`);
});
