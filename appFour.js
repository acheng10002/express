/* How to set up EJS in an Express object
- How do I configure EJS for Express projects?
many of my uses cases will require views to be dynamic with respect to data
template engines - create viewd, template files in my codebase that get 
                   transformed into HTML when I respond to a server request
                   variables in my template files are replaced with actual data
                   I can inser conditional and/or loop logic into my template
                   file, e.g. render the user's username once they have logged in 
- What is the difference between "<%" and "<%=" tags?
in EJS, <% and %> tags let me use JS
<%= outputs a variable as a value */
const express = require("express");
const app = express();
/* lets my app know I intend to use EJS as template engine, and where to look 
for view files */
const path = require("node:path");

// my app needs to know where to serve assets from
const assetsPath = path.join(__dirname, "public");
/* express.static() is a middleware function that enables the use of static assets,
I tell it to look for assets with the public directory as the root */
app.use(express.static(assetsPath));

/* */
const links = [
  { href: "/", text: "Home" },
  { href: "about", text: "About" },
];

const users = ["Rose", "Cake", "Biff"];

// defines the views property, tells Express where to find views
app.set("views", path.join(__dirname, "views"));
// defines the view engine app property, tells Express which templating engine to use
app.set("view engine", "ejs");

// - How do I render a view in a controller callback? below...
// app.get("/", (req, res) => {
/* renders the index.ejs template file in the root route 
  when client goes to / route, line below sends back the response 
  first arg looks for a templated called index in views
  second arg is an object of variables that are to be made available to the first 
  arg template 
  EJS has access to any properties from the secnd arg. object 
  and any properties on Express's res.locals object 
  res.locals is useful for passing values to the view in one middle function, but
  not calling res.render until later in the middleware chain 
  EJS stores all these properties in an object called locals, which can be accessed in the view, index.ejs 
  locals object in EJS (local variable) is similar to the global window object in browsers */
// res.render("index", { message: "EJS rocks!" });
// });

app.get("/", (req, res) => {
  /* first arg looks for a templated called index in views
  second arg is an object of variables that are to be made available to the first 
  navbar.ejs expects the links variable, so it is being passed in as a locals variable */
  res.render("index", { links: links, users: users });
});

app.get("/about", (req, res) => {
  /* first arg looks for a templated called index in views
    second arg is an object of variables that are to be made available to the first 
    navbar.ejs expects the links variable, so it is being passed in as a locals variable */
  res.render("about", { links: links, user: users });
});

app.listen(8080);
