// import dependency
const { body, validationResult } = require("express-validator");

// import local module onto server
const usersStorage = require("../storages/usersStorage");

const alphaErr = "must only contain letters.";
const lengthErr = "must be between 1 and 10 characters.";

const validateUser = [
  body("firstName")
    .trim()
    .notEmpty()
    .isAlpha()
    .withMessage(`First name ${alphaErr}`)
    .isLength({ min: 1, max: 10 })
    .withMessage(`First name ${lengthErr}`),
  body("lastName")
    .trim()
    .notEmpty()
    .isAlpha()
    .withMessage(`Last name ${alphaErr}`)
    .isLength({ min: 1, max: 10 })
    .withMessage(`Last name ${lengthErr}`),
  body("email")
    .trim()
    .notEmpty()
    .isEmail()
    .withMessage("Invalid email format.")
    .normalizeEmail()
    // prevents HTML/JS injection
    .escape(),
  body("age").optional().trim(),
  body("bio").optional().trim(),
];

// route handler middleware for /create, listens for post request
exports.usersCreatePost = [
  // I can pass an entire array of middleware validations to  my controller
  validateUser,
  (req, res) => {
    /* validationResult(req) checks if validations rules have been violated,
    extracts validation errors from the req */
    const errors = validationResult(req);
    // if there are any failed validation checks/the errors array is not empty
    if (!errors.isEmpty()) {
      // server sends a 400 status code, renders indexTwo.ejs with an errors object
      return res.status(400).render("createUser", {
        // include title in locals object
        title: "Create user",
        // converts validation errors object to array, so frontend can display them
        errors: errors.array(),
      });
    }
    // destructures { firstName, lastName, email, age, bio } object from req.body
    const { firstName, lastName, email, age, bio } = req.body;
    // adds the values of that object to usersStorage
    usersStorage.addUser({ firstName, lastName, email, age, bio });
    // console.log(usersStorage);
    // redirects client to the root
    res.redirect("/");
  },
];

// route handler middleware for root, listens for get request
exports.usersListGet = (req, res) => {
  // renders indexTwo view template and sends it as a response
  res.render("indexTwo", {
    /* res.render locals object - object that stores data accessible in all templates/views
                           rendered during the req-res cycle
                           it's only available for the duration of the current request
    makes title and users available to indexTwo.ejs */
    title: "User list",
    users: usersStorage.getUsers(),
  });
};

// route handler middleware for /create, listens for get request
exports.usersCreateGet = (req, res) => {
  // renders createUser view template and sends it as a response
  res.render("createUser", {
    // res.render locals object makes title available to createUser.ejs
    title: "Create user",
  });
};

// route handler middleware for /:id/update, listens for get request
exports.usersUpdateGet = (req, res) => {
  // use the id route parameter to get user object associated with that id
  const user = usersStorage.getUser(req.params.id);
  // renders updateUser view template and sends it as a response
  res.render("updateUser", {
    // include title and user in locals object
    title: "Update user",
    user: user,
  });
};

// route handler middleware for /:id/update, listens for post request
exports.usersUpdatePost = [
  // I can pass an entire array of middleware validations to  my controller
  validateUser,
  (req, res) => {
    // uses the id route parameter to get user object associated with that id
    const user = usersStorage.getUser(req.params.id);
    /* validationResult(req) checks if validations rules have been violated,
    extracts validation errors from the req */
    const errors = validationResult(req);
    // if there are any failed validation checks/the errors array is not empty
    if (!errors.isEmpty()) {
      // server sends a 400 status code, renders updateUser.ejs with an errors object
      return res.status(400).render("updateUser", {
        // include title and user in locals object
        title: "Update user",
        user: user,
        // converts validation errors object to array, so frontend can display them
        errors: errors.array(),
      });
    }
    // destructures { firstName amd lastName } object from req.body
    const { firstName, lastName, email, age, bio } = req.body;
    // updates the values of that object to usersStorage
    usersStorage.updateUser(req.params.id, {
      firstName,
      lastName,
      email,
      age,
      bio,
    });
    // redirects client to the root
    res.redirect("/");
  },
];

// route handler middleware for /:id/delete, listens for post request
exports.usersDeletePost = (req, res) => {
  // uses the id route parameter to delete user object associated with that id
  usersStorage.deleteUser(req.params.id);
  res.redirect("/");
};

// route handler middleware for /search, listens for gett request
exports.usersSearchGet = (req, res) => {
  // gets an array with all user objects
  const usersInfo = usersStorage.getUsers();
  // gets array with only the names of all user objects
  const names = usersInfo.map(({ firstName, lastName }) => ({
    firstName,
    lastName,
  }));
  // destructures { nameSearch } object from req.query
  const { nameSearch } = req.query;
  // filters out user objects with firstName and/or lastName that match nameSearch
  const matches = names.filter(
    (name) => name.firstName === nameSearch || name.lastName
  );
  // renders search view template and sends it as a response
  res.render("search", {
    // include title and matches in locals object
    title: "Search results",
    matches: matches,
  });
};
