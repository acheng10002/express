const { Router } = require("express");
const indexRouter = Router();

indexRouter.get("/", (req, res) => res.send("Homepage"));
indexRouter.get("/about", (req, res) => res.send("About Page"));
indexRouter.get("/contact", (req, res) => res.send("Contact Page"));

indexRouter.post("/contact", (req, res) => res.send("Contact the Library"));

module.exports = indexRouter;
