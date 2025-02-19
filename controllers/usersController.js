/* once validation rules are applied, I can use validationResult to handle any 
validation errors 
checks for any failed validation checks 
this middleware/controller function handles form validation */
const controller = (req, res, next) => {
  /* validationResult(req) - checks if validations rules (applied via body(), 
                             check(), etc.) have been violated
                             extracts validation errors from the req */
  const errors = validationResult(req);
  // if there are any failed validation checks/the errors array is not empty
  if (!errors.isEmpty()) {
    // server sends a 400 status code, renders index.ejs with an errors object
    return res.status(400).render("index", {
      // converts errors object into an array of objects, so frontend can display them
      errors: errors.array(),
    });
  }

  // otherwise errors will be empty, redirect to the /success route in my router
  res.redirect("/success");
};

// my form needs somewhere to send the data to
exports.userUpdateGet = (req, res, next) => {};
exports.userUpdatePost = (req, res, next) => {};
