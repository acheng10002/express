/* Using express-validator for validation and sanitation
- How do I install and import express-validator in my project?
- install it at the root of my project */
const { body, validationResult } = require("express-validator");

/* - How do I validate and sanitize form input using express-validator?
express-validator comes with loads of functions for just about every 
form operation I could think of - here, sticking with body() and
validationResult() 
body() - lets me specify which fields in the req body should be 
          validated and sanitized and specify how to handle it */
[
  body("birthdate", "Must be a valid date.")
    /* marks the birthdate field as optional 
    { values: "falsy" } means values that aren't undefined, null, false,
     or 0 will still be validated */
    .optional({ values: "falsy" })
    // enforces a YYYY-MM-DD format
    .isISO8601(),
];

/* multiple validation methods may be chained together with unique error
messages if the checks fail */
[
  // ensures name is present, trimmed, and also contains alphabet letters
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name can not be empty.")
    .isAlpha()
    .withMessage("Name must only contain alphabet letters."),
];
/* - What is the difference between validation and sanitization?
Best practices for form design and data integrity 
- How do I handle validation errors in Express routes? */
