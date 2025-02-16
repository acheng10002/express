const express = require("express");

// makes a Router instance
const userRouter = express.Router();

const controller = require("../controllers/userController");

userRouter.get("/", controller.get);

module.exports = userRouter;
