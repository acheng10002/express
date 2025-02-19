const { Router } = require("express");
const usersRouter = Router();
const usersController = require("../controllers/usersController");

// assigns routes which correspond to the controller's functions; user updates routes
usersRouter.get("/:id/update", usersController.userUpdateGet);
usersRouter.post("/:id/update", usersController.userUpdatePost);

module.exports = usersRouter;
