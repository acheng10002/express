// import dependency
const express = require("express");

// initialize Express to initialize app
const app = express();

// imports a local module onto my server
const usersRouterTwo = require("./routes/usersRouterTwo");

// defines the view engine app property, tells Express which templating engine to use
app.set("view engine", "ejs");

/* express.urlencoded() middlware handles form submissions, 
sets form's data to the req.body field 
extended is set to true to accept data other than a string or an array
(if a req is sent with a Content-Type other than "application/x-www-form-urlencoded",
Express won't parse the data, and req.body will be an empty object) */
app.use(express.urlencoded({ extended: true }));

// defines / route and registers usersRouterTwo middleware
app.use("/", usersRouterTwo);

/* tells  my server to listen for incoming requests on port 3000
use dynamic port for deployment */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Express app listening on port ${PORT}!`));
