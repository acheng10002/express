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
  res.render("index", {
    title: "Hey",
    message: "Hello there!",
    links: links,
    users: users,
  });
});

app.get("/about", (req, res) => {
  /* first arg looks for a templated called index in views
    second arg is an object of variables that are to be made available to the first 
    navbar.ejs expects the links variable, so it is being passed in as a locals variable */
  res.render("about", { links: links, user: users });
});

app.listen(8080);

/* Understand what a hosting provider is
- hosting provider - allow me to run, build, and operate web apps in the cloud
                     owns servers and rents space on them to customers, who can use the 
                     space to store websites and make them public 
- GitHub pages is great for hosting static web pages but won't work for hosting dynamic
  Node apps
  it cannot run Node.js apps and doesn't have database services I can use
  host providers like Netlify and Vercel, the former which I used with React, do not have 
  the same capabilitires to run my Node.js servers and databases 
Under the difference between static and dynamic sites
- static site - made up of pre-written HTML pages that look the same for all visitors
                built with up HTML, CSS, and JS
- dynamic site - websites that change content based on the visitor
                 built with HTML, CSS, JS, AND a server-side app and a database
the big, complex cloud providers - AWS, Google Cloud, and Microsoft Azure
Understand what a PaaS is and how they work
- beginner-friendly, platform as a service provider, Railway and Render
- What are the advantages of using a PaaS hosting provider?
- PaaS hosting providers manage many low-level details with underlying server infrastructure,
  I don't have to worry about configuring and managing the servers my apps run on
- PaaS give me easy access to a few resources that any Node app can't live without
- What is an instance?
- instance - a single instance of my app running at one time, e.g. one computer running my
             app like I do on Localhost
             virtual computer provided by PaaS providers, that runs my app
             multiple instances == several copies of my app running simultaneously, allows me
             to handle more traffic

databases - PaaS providers make it easy to spin up a new database for each app by doing all 
            setup and configuration for me
            some providers even set up automatic backups for my databases
many PaaS services come with SQL databases included
PaaS providers also give me a random domain name when I first deploy, unique on their platform
I'd want to link the unique domain name from the PaaS to my own custom domain
once I have my custom domain, I need to point it to my project
Know how to deploy to a PaaS provider
Know how to troubleshoot common deployment issues 
- What steps can I take to diagnose an issue that arises during deployment?
- check the build logs, the stream of output I'll see after kicking off a new deployment
- Google-fu it/Stack Overflow
- double-checking deployment guide
- What steps can I take to diagnose an issue that only appears after deployment?
- application logs 
- services like Sentry to track and monitor errors 
- backtrack to the last working version to figure out what changes I made and slowly 
  reintroduce the changes again if I need to */
