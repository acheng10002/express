// import dependency
const { Router } = require("express");

/* instantiation of Router, usersRouterTwo is a mini Express app that
handles user-related routes */
const usersRouterTwo = Router();

// import local module onto the server
const usersControllerTwo = require("../controllers/usersControllerTwo");

/* route handler for "/" path and get request, calls usersListGet middleware 
list all existing users at http://localhost:3000/ */
usersRouterTwo.get("/", usersControllerTwo.usersListGet);
/* route handler for "/create" path and get request, calls usersCreateGet middleware 
browser/client makes get request to page containing form
response is rendering of empty default form */
usersRouterTwo.get("/create", usersControllerTwo.usersCreateGet);
/* route handler for "/" path and get request, usersListGet middleware 
can add new users at http://localhost:3000/create */
usersRouterTwo.post("/create", usersControllerTwo.usersCreatePost);
// defines routes for updating users, with :id
usersRouterTwo.get("/:id/update", usersControllerTwo.usersUpdateGet);
/* browser/client populates/updates form and makes post request with form data
request with form data gets validated
actions may be performed on validated data, 
redirect browser to success URL */
usersRouterTwo.post("/:id/update", usersControllerTwo.usersUpdatePost);
// defines route for deleting users, with :id
usersRouterTwo.post("/:id/delete", usersControllerTwo.usersDeletePost);

usersRouterTwo.get("/search", usersControllerTwo.usersSearchGet);

module.exports = usersRouterTwo;
