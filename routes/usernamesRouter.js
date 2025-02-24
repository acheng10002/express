const { Router } = require("express");

const usernamesRouter = Router();

const usernamesController = require("../controllers/usernamesController");

usernamesRouter.get("/", usernamesController.usernamesLogGet);

usernamesRouter.get("/new", usernamesController.usernamesInsertGet);

usernamesRouter.post("/new", usernamesController.usernamesInsertPost);

usernamesRouter.get("/delete", usernamesController.usernamesDeleteGet);

module.exports = usernamesRouter;
