/* destructure the Express object to get a Router function, and use it to 
create my authorRouter */
const { Router } = require("express");
const { getAuthorById } = require("../controllers/authorController");

const authorRouter = Router();

/* .get or .post methods can be used on this router, and routes and middleware
functions can be scoped to this router 
this router will be usable only for paths that start with /authors 
route paths here extend the parent path, /authors/:authorId */
authorRouter.get("/", (req, res) => res.send("All authors"));
authorRouter.get(
  "/:authorId",
  getAuthorById
  /* controller at work here
(req, res) => { 
    const { authorId } = req.params;
    res.send(`Author ID: ${authorId}`); */
);

module.exports = authorRouter;
