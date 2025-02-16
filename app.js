/* Explore various response methods
- What are the common response methods and their use cases?
res.send - won't enforce JSON
           will only handle things as JSON when dealing with booleans and objects 
res.json - explicit way to response to a request with JSON
res.redirect - redirects client to a different URL
res.render - lets me render a view template and send the resulting HTML as the 
             response
*response methods above, end the req-res cycle, but they do not end the function execution
res.status - sets the status code manually, but it does not end the req-res cycle 

- What are the types of middleware? 
middleware functions - functions that operate between the incoming request and the final
                       indetended route handler
- takes 3 arguments: req (request object/HTTP request), res (response object/HTTP response),
  and next, which is optional (function that passes control to the next middleware function 
  in the chain)
application-level middleware
router-level middleware
error-handling middleware (can be either app-level or router-level) - handles all errors in
my app that come down from other middleware functions 
this error middleware function should be at the end of the application code to ensure it's 
the last middleware function executed and only handles errors bubbling down from preceding
middleware functions 

route middleware functions or a middleware functions with less than four paramters are 
considered request middleware functions, instead of error middleware

- How does a middleware get executed? In which order?
middleware functions get invoked during the req-res cycle in the order they are defined

Implement error handling middleware to catch and process errors gracefully
- What does calling the next function do? What if I pass error argument? 
next function passes control to the next middleware

- What are the other arguments I can pass to the next function?

- What is a controller?
controller - component of the MVC design approach
1. request hits the server
2. requested HTTP verb and path matches the route
3. router determines which controller should handle the request based on the defined middleware chain
5. appropriate controller takes over, performing necessary actions to fulfill the request
   - retrieves data from the model 
   - processes the data
   - makes decisions based on busines logic
   - updates the model with new data
6. once controller completes its tasks, it passes the processed data to the view 
7. view renders data into a format suitable sending back to the client 
- names of the controllers are based on the route they're attached to

- What is the difference between a controller and a middleware? 
middleware - core feature of Express that allows me to run code, modify requests, or end the
             cycle at specific points in the req-response cycle 
middleware in Express implement the Controller part of the MVC pattern

- What happens if I define a middleware function with four parameters?
I am declaring an error middleware function
app.use((err, req, res, next) => {...})
- What would I do to create a custom error? 

Describe common use cases for middleware, such as validation and authentication
- middleware functions can:
1. modify request or response objects
2. execute additional code
   validation - validate the request before going to main logic
   authentication 
3. call the next middleware function in the chain
4. end the req-res cycle, no further middleware functions are called, even if there
   are more in the chain 
*/
const express = require("express");

// calls express to initialize the app variable - this is my server
const app = express();

const authorRouter = require("./routes/authorRouter");
const bookRouter = require("./routes/bookRouter");
const indexRouter = require("./routes/indexRouter");

/* application-level middleware - bound to an instance of Express
use app.use, or app.METHOD
app-level middleware functions get executed for every req that mathces the specified path
if a path is not specified, Express defaults the path to /, matching every req 
app-level middleware are typically placed at the top of my app code to ensure they run first
frequently used app-level middleware:
body parsers - allow me to correctly parse the req body, so I can use it through req.body
               e.g. express.json, express.urlencoded
serving static files - serve static files like HTML, CSS, JS, and images
                       pass an argument to specify which directory to serve the static files
                       e.g. app.use(express.static('public'))

router-level middleware - bound to an instance of Express router
use router.use or router.METHOD
Express only executes router-level middleware when the request matches and goes through that router
               

app.use() - specifies middleware as the callback function
               here, treating the router itself as middleware
requests with paths starting with /authors get passed through authorRouter 
for route matching */
app.use("/authors", authorRouter);
/* requests with paths starting with /books get passed through bookRouter for 
route matching */
app.use("/books", bookRouter);
/* requests with paths that don't start with /authors or /books get passed 
through indexRouter for route matching */
app.use("/", indexRouter);

const PORTONE = 8080;

app.listen(PORTONE, () => {
  console.log(`My first Express app - listening on port ${PORTONE}!`);
});

// this is a route
/* Describe how routes are defined
routing - how an app's endpoints (URIs) respond to client requests 
- How can I define a route that will only match a specific HTTP verb?
each HTTP verb has its own Express route method
- the route method comes from one of the HTTP method, and it's attached to an instance of the 
express class 
app.get (retrieves data from the server only), app.post (sends data to the server e.g. forms), 
etc.
with REST APIs, will also see verbs like PUT and DELETE  
- How can I define a route that will match all HTTP verbs?
path - URL pattern that Express app listeners for, define the endpoints at which requests can be made
       it can be a string, string pattern, or regex
       *query strings are not part of the route path
route - a combination of a path and an HTTP method 
app.all() - routing method used to load middleware functions at a route that matches all verbs, 
handles all HTTP methods 

handler here is executed for requests to the route, "/secret" whether using GET, POST, PUT, DELETE,
ot any other HTTP request method */

app.all("/secret", (req, res, next) => {
  console.log("Accessing the secret section...");
  // passes control to the next handler
  next();
});
/* route paths based on strings
route path matching requests to the root route / */
app.get("/", (req, res) => {
  /* res.send - general-purpose response method
                flexible with what data I can send
                automatically sets the Content-Type header based on what data I pass it
                ex. pass it an object, it stringifies the object as JSON and set Content-Type: application/json */
  res.send("root");
});
// route path matching requests to /about
app.get("/about", (req, res) => {
  res.send("about");
});
// route path matching requests to /random.text
app.get("/about", (req, res) => {
  res.send("about");
});

/* route paths based on string patterns 
route path matching requests to acd and abcd */
app.get("/ab?cd", (req, res) => {
  res.send("ab?cd");
});
// route path matching requests to abcd, abbcd, abbccd, etc.
app.get("/ab+cd", (req, res) => {
  res.send("ab+cd");
});

// route path matching requests to abcd, abxcd, abRANDOMcd, ab123cd, etc.
app.get("/ab*cd", (req, res) => {
  res.send("ab*cd");
});

// route path matching requests to /abe and /abcde
app.get("/ab(cd)?e", (req, res) => {
  res.send("ab(cd)?e");
});

/* route paths based on regex
route path matching requests to anything an a in it */
app.get(/a/, (req, res) => {
  res.send("/a/");
});

// route path matching requests to butterfly, dragonfly, but not butterflyman, dragonflyman
app.get(/.*fly$/, (req, res) => {
  res.send("/.*fly$/");
});

/* - How can I define path patterns for my routes to match?
defining a route parameter starts a segment with a : followed by the name of the parameter 
route parameter can only consist of case-sensitive alphanumeric characters or _  */
/* GET /theodinproject79687378/messages would instead log
{ username: 'theodinproject79687378' } */
app.get("/:username/messages", (req, res) => {
  console.log(req.params);
  res.end();
});

/* GET /odin/messages/79687378 will have this log
  { username: "odin", messageId: "79687378" } */
app.get("/:username/messages/:messageId", (req, res) => {
  console.log(req.params);
  res.end();
});
/* Explain route parameters and query parameters
- What object gets populated with route parameters? req.params object 
like React Router, I can use route parameters, and a path can contain as many of these 
parameters as I need 
route parameters - named URL seguments that are used to capture values specified at their
                   position in the URL
Express automatically populates req.params object in any of the middleware functions with 
whatever captured value the path passed into the parameter, using parameter name as its key 

Route path: /users/:userId/books/:bookId
Request URL: http://localhost:3000/users/34/books/8989
req.params: { "userId": "34", "bookId": "8989" } 

Route path: /plantae/:genus.:species
Request URL: http://localhost:3000/plantae/Prunus.persica
req.params: { "genus": "Prunus", "species": "persica" } */

// defines route with route parameters in the path of the route
app.get("users/:userId/book/:bookId", (req, res) => {
  res.send(req.params);
});

/* hyphen and dot can be used along with route parameters for useful purposes  
Route path: /flights/:from-:to
Request URL: http://localhost:3000/flights/LAX-SFO
req.params: { "from": "LAX", "to": "SFO" } */

// more than one callback function can be in a route handler
// app-level middleware function with 3 arguments
function myMiddleware(req, res, next) {
  // performs an operation
  console.log("the response will be sent by the next function...");
  // modifies the req object
  // req.customProperty = "Hello from this middleware"
  // calls the next middleware/route handler
  next();
}

app.get(
  "/example/b",
  myMiddleware,
  /* middleware functions following myMiddleware can now access 
  req.customProperty */
  (req, res) => {
    res.send("Hello from B!");
  }
);

// an array of callbacks can be in a route handler
const cb0 = function (req, res, next) {
  console.log("CB0");
  next();
};

const cb1 = function (req, res, next) {
  console.log("CB1");
  next();
};

const cb2 = function (req, res) {
  res.send("Hello from C!");
};

app.get("/example/c", [cb0, cb1, cb2]);

// a combination of independent functions and arrays of functions can be in a route handler
const cb3 = function (req, res, next) {
  console.log("CB3");
  next();
};

const cb4 = function (req, res, next) {
  console.log("CB4");
  next();
};

app.get(
  "/example/d",
  [cb3, cb4],
  (req, res, next) => {
    console.log("the response will be sent by the next function ...");
    next();
  },
  (req, res) => {
    res.send("Hello from D!");
  }
);

/* - How do I access query parameters within routes? 
query parameters - unique and optional part of a URL that appear at the end
                   ? denotes the start of the query parameters, with each query being a key-
                   value pair with the format key=value, and each query separated by an &
                   they're not part of the path, more like arguments passed in to a given path
I access query parameters from the req.query object which Express populates with key-value pairs
it finds after parsing any query parameters in a request 
- if any keys are repeated, Express puts all values for that key into an array */
/* GET /odin/messages?sort=date&sort=likes&direction=ascending will log
Params: { username: "odin" }
Query: { sort: ["date", "likes"], direction: "ascending" } */
app.get("/:username/messages", (req, res) => {
  console.log("Params:", req.params);
  console.log("Query:", req.query);
  res.end();
});

/* on youtube, appending ?v=xm3YgoEiEDc&t=424s will request /watch from YouTube for the 
xm3YgoEiEDc video starting 424 seconds in.

Set up new routers on a path
in a real app with lots of routes, I'd want to organize my routes into groups
and extract each group out to their own file
ex. library app, pages that deal with books and pages that deal with authors
and misc pages like about or contact 
- I might want my server to handle these rotues:
GET /
GET /about
GET /contact
POST /contact

GET /books
GET /books/:bookId
GET /books/:bookId/reserve
POST /books/:bookId/reserve

GET /authors
GET /authors/:authorId

- How do I extract routes to an individual router?
router gets placed in routes folder
*/
/* - I have a router for paths starting with /users. Inside that router, what path should
a GET route have to match a GET request to the /users/delete path?

1. navigating to http://localhost:3000/ tells the browser to send a GET request to the
/ path of whatever server is listening at port 3000 on my localhost, which is my 
Express server and display in the window whatever it receives in response 
- the / path matches the route I have here 

2. when my Express server receives my GET request, Express stores the request in a 
request object 

3. this request gets passed through middleware functions
middleware functions - functions that tell Express framework to respond to the request 

in other words...
if a GET request comes through the / path, pass the request through the following chain
of middleware functions (only one middleware function here) 

if I had defined multiple routes, Express would pass the request through the first route that 
matches the requested HTTP verb (GET) and path (/) 

Express takes the callback (req, res) => and passes the request object into the first 
parameter and a response object into the second parameter 

the callback tells the response object to respond to the request by sending (via res.send) 
the string "Hello, world!" 
the function then returns, Express was told to respond to the request, so it ends the 
request-response cycle 
the browser receives my server's response, and displays it on the screen 


routes - match a request's HTTP verb (GET or POST)/HTTP method and URL path to the appropriate 
set of middleware functions (the controllers/functions that tell Express to respond to the request),
the middleware functions are callbacks/handlers that get called when the app receives a request
to the specified route/endpoint and HTTP method 

this route will match any GET requests that go through the app router (which is my whole 
server) to the / path 
the app "listens" for requests that match the route and method, and when it detects a match, 
it calls the specified callback 
routing methods can have more than one callback as arguments
- with multiple callbacks, next should be provided as an argument to the callback, and then
next() gets called to hand off control to the next callback */
app.get("/", (req, res) => res.send("Hello, world!"));

/* this route will match any POST requests that go through the app router to the /messages path 
if I send a GET request to the /messages path, it would not match this route 
each HTTP verb has its own Express route method
app.all() makes a route match all verbs 

first argument passed to the route is the path to match - can be a string or regex */
app.post("/messages", (req, res) =>
  res.send("This is where I can see any messages.")
);

/* - How does the order of my routes affect which routes get matched?
routes get set up in my server in the order they are defined 
the second route needs to defined first for my GET /messages request to match the /messages route */
app.get("*", (req, res) => {
  res.send(
    "* is a great way to catch all otherwise unmatched paths, e.g. for custom 404 error handling."
  );
});

app.get("/messages", (req, res) => {
  res.send(
    "This route will not be reached because the previous route's path matches first."
  );
});

// ? makes a character optional
// The following path matches both /message and /messages
// "/messages?"

// () groups characters together, allowing symbols to act on the group
// The following path matches both / and /messages
// "/(messages)?"

// * is a wildcard matching any number of any characters
// The following path can match /foo/barbar and even /foo-FOO/bar3sdjsdfbar
// "/foo*/bar*bar"

/* navigating to https://theodinproject.com/paths via the address bar, tells the browser
 to send a GET request to the /paths path at https://theodinproject.com and display what
it receives in response */

/* usually the port number comes from a environment variable with a fallback value in
case the environment variable does not exist */
const PORT = process.env.PORT || 3000;

/* tells my app server to listen for incoming requests on the port via localhost
port 3000 is the default choice, but I can use any unused port */
app.listen(PORT, () => {
  console.log(`My first Express app - listening on port ${PORT}!`);
});

/* Node's watch mode will watch app.js for changes, and watch any of the files it depends on
when Node detects a change, it will automatically restart the server like with Webpack and
Vite's dev servers */

/* response methods - methods on the res object can send a response to the client and terminate
                      the request-response cycle 
                      one of these have to called from a route handler, otherwise the client 
                      request will be left hanging 
res.download(), res.end(), res.json(), res.jsonp(), res.redirect(), res.render(), res.send(), 
res.sendFile(), res.sendStatus() 

app.route() - a route path can have chainable route handlers */
app
  .route("/book")
  .get((req, res) => {
    res.send("Get a random book");
  })
  .post((req, res) => {
    res.send("Add a book");
  })
  .put((req, res) => {
    res.send("Update the book");
  });

/* express.Router() - class that creates modular, mountable route handlers
Router instance is a complete middleware and routing system, often called a "mini-app" */

// creates a router as a module
const router = express.Router();

/* loads a middleware function that is specific to this router 
middleware function pre-process requests before reading a route or response 
it runs before routes, handles all HTTP methods, calls next() 
middleware function also does not stop request flow, instead continues to the next middleware */
const timeLog = (req, res, next) => {
  console.log("Time: ", Date.now());
  next();
};

router.use(timeLog);

/* if parent route /birds has path parameters, it will not be accessible from the sub-routes 
mergeParams option needs to be passed to the Router constructor reference to make the parent route 
accessible */
/* defines the home page route, handle requests to /birds 
route handler handles requests and sends responses
it runs only if the route/path matches, it does not handle all HTTP methods, it does not call next() and
typically sends a response 
route handlers do stop request flow, sends response and terminates req-res cycle */
router.get("/", (req, res) => {
  res.send("Birds home page");
});

// defines the about route, handles requests to /birds/about
router.get("/about", (req, res) => {
  res.send("About birds");
});

/* middleware functions run before route handlers and do not send a final response
route handlers match a specific path and terminate the request with res.send() */
module.exports = router;
