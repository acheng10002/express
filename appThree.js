const express = require("express");
const app = express();
const router = express.Router();

// middleware that logs requests
router.use((req, res, next) => {
  console.log(`Request to ${req.path}`);
  next();
});

function middleware1(req, res, next) {
  console.log("Middleware 1");
  /* passes control to the next middleware 
            without next(), request would stop and hangs indefinitely until it times out,
            no response would be sent to the client
            the server does not crash, but the request does not complete */
  next();

  /* 
  1. no argument next() - passes control to the next middleware function
  2. next(newError(...)) - passes control directly to the error middleware function
  3. next('route') - passes control to the next route handler with the same matching
     path (if there is one)
     this only works for app.METHOD or router.METHOD
     can be the same as just calling next with no argument
  4. next('router') - skips all middleware functions attached to the specific router
     instance and passes control back out of the router instance 
     exit the router and go back to the parent router, e.g. app
  */
}

// route handler for /hello
router.get("/hello", (req, res) => {
  res.send("Hello from Router!");
});

// attach router to app
app.use("/api", router);
/* above is internally equivalent to:
app.use("/api", (req, res, next) => {
    // handle function loops through all middleware and routes inside the router
    // calls each layer's handle() function if the path matches
    // skips the next matching layer when next() is called
    router.handle(req, res, next); 
}); */

function middleware2(req, res, next) {
  console.log("Middleware 2");
  res.send("Response from Middleware 2");
  // req-res cycle ends here
}

function middleware3(req, res, next) {
  console.log("Middleware 3");
  res.send("Response from Middleware 3");
}

app.use(middleware1); // "Middleware 1"
app.use(middleware2); // "Middleware 2"
/* response sent in middleware2, and req-res cycle ended 
          middleware 3 won't run */
app.use(middleware3);

app.listen(3000, () => console.log("Server running on port 3000"));

/* .use():
- used for registering routers, middlewares, routes & error handlers
- can be used with or without a path as first param
- both an App and a Router have a .use() method 

App == Router
- every Express app is essentially a root level Router
- every Router is like a mini-app in itself
- a router has two things:
1. handle() function - function that processes all the requests received by the router
2. layer-stack - stack of layers registered on the router
   every layer has a path and its own handle function
   calling .use on an Express app or Router, basically creates a new Layer in the Router's stack

Layers
- a layer can be one of these things:
1. middleware - function with signature func(req, res, next)
   usually runs some code, optionally modifies the request or response 
   at the end, either sends the response or calls the next layer
   can call next() to continue req processing
   example tasks: logging, authentication, parsing JSON, adding custom request properties
2. route - actual request handlers for processing one or more HTTP types
   route method's handler has the same signature as middleware
   typically contains the business logic to process the request and send a response
   in case of an error, it can throw the error or call the next() function by passing 
   the error as its first param
   does not call next(), usually ends the req-res cycle with res.send()
   example tasks: fetching data, performing database operations, sending responses 
3. error handlers - functions responsible for handling errors thrown by any previous layer
   or sent by a previous Layer using next() method 
   they have a signature of func(error, req, res, next), FOUR params is how the app 
   differentiates between errorHandlers and other middlewares 
4. another router - a router will usually be registered on the main Express app using a path
   it is both contained in a layer and has its own stack of Layers 
   this nested structure of Routers allow me to create modular mini apps within an Express app 
   create another Router by invoking Router() method on the express object

Request Handling 

// create app
// A. user makes an HTTP get request by concatenating the path of Route's API and the path
//    of all its parent Routers i.e. GET /admin/users
// B. app receives the request and passes it to the root Router's handle method
const app = express();

// register app middlewares
// C. Root router will first pass Request through app-level middlewares
app.use(helmet());
app.use(compression());

// create Router
const adminRouter = express.Router();

/* 1. Iterating the Layer stack
      every express.Router() instance has an internal handle(req, res, next) method 
      when it receives a new request, it starts processing the request by looping through 
      the Layer stack 
      - handle function is actually called by another wrapper function, handle_request or
        handle_error
      - while iterating through a Layer-stack, Router keeps track of a LayerError variable,
        that is initializes as null 
      - if any Layer throws an Error, or pass any some object via next function like 
        next(someObject), LayerError will store that error/object and Request is not
        considered to be in errored state
   2. Path Matching 
      Router will loop through the Layers and call the handle function on every Layer with
      a matching path in .use(path, handler) to the request URL
      - when no path is provided in the .use() method, Layer defaults to the root path for
        the Router, i.e. Layer will match all the requests passing through the Router

// register Router as a Layer on path /admin in root Router
// creates a new Layer on app's roote Router
// D. request will try to match the adminRouter's path /admin
      since it matches, it will go inside the Layer stack of adminRouter
app.use('/admin', adminRouter); 

// register Router middleware 
// E. request runs through this middleware to verify if the client requesting is indeed an admin
//    if admin, calls next() without any param
//    if not admin, send a 404 or 403 error response, and ends req-res cycle here 
//    or cycle can be continued by throwing an error or passing an error via next(error)
//    the error passed is stored in LayerError
adminRouter.use(verifyAdminMiddleWare) 

// register APIs on Router
// middlewares and routes registered on adminRouter create a new Layer inside Layer-stack of 
// the adminRouters
// F. if no LayerError, app invokes getUsers()
//    getUsers() fetches user details and sends it to the client with a 200 OK response,
//    ending the req-res cycle here 
// G. API handler, getUsers() gets bypassed if there is a LayerError
adminRouter.get('/users', function getUsers(req, res) { 
  // only an admin can make this request
  //...get users
  return res.send(users);
})

// error handlers
// are part of the same stack as the middlewares, routers, & routes
// H. if any of the previous steps passed down a LayerError, next Layer, error handler will 
//    be invoked
//    notifyErrorHandler logs the error and sends alerts, optionally passes error by calling
//   next(error)
adminRouter.use(notifyErrorHandler);
// I. globalErrorHandler gets called if there was an error passed from the previous middlewares
//    and error handlers
//    will send a response to the client, if not already sent 
adminRouter.use(globalErrorHandler);

as long as request is in a non-error-ed stated, the Router will keep calling the handle_request
method for all Layers
- if underlying Layer is an error handler, its handle method will not be called
when a request is in a error-ed state, the Router switches to calling handle_error method, which
will only call the underlying handle method of the Layer provided it is an error handler
*/
