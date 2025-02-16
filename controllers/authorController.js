const db = require("../db");
const CustomNotFoundError = require("../errors/CustomNotFoundError");

/*
// controller function that retrieves an author by their ID
async function getAuthorById(req, res) {
  /* 1. route path contains route parameter (/authors/:authorId)  
        extracts authorId from req.params 
  const { authorId } = req.params;

  /* I need to provide meaningful error responses to the client, and
  prevent my app from crashing unexpectedly
  errors do occur during async operations 
  - address with by wrapping the controller in a try/catch block 
  try {
    /* 2. authorId comes from the request, and invokes the mock database 
          query function to retrieve the author based on the authorId 
    const author = await db.getAuthorById(Number(authorId));

    // 3. if controller doesn't find the author...
    if (!author) {
      // controller sends a 404 status code response and message
      res.status(404).send("Author not found");
      // returns from the controller and does not invoke any other logic
      return;
    }
    /* 4. if controller finds the author, it sends a response with a 200 
          status code with the text showing the author name using res.send(...) 
    res.send(`Author Name: ${author.name}`);
  } catch (error) {
    console.error("Error retrieving author:", error);
    res.status(500).send("Internal Server Error");

    /* or I can call next(error) instead of sending a response
    `next(error)` though will only render an error page in express' default view
    and respond with the whole html to the client 
    I will need to create a special type of middleware function if I want a
    different response 
  }
} 
problem above, I'd have to add the same try/catch block to all controllers 

const asyncUtil = fn =>
  // wraps an async function, fn/getAuthorById, inside another function, asyncUtilWrap
  function asyncUtilWrap(...args) {
    // executes the original async function
    const fnReturn = fn(...args);
    // extracts next
    const next = args[args.length - 1];
    // wraps the original async function in Promise.resolve() to handle both sync
    // and async errors
    // if fn throws an error, catch(next) automatically forwards it to Express' 
    // error middleware, Express does not crash because the error is handled properly
    return Promise.resolve(fnReturn).catch(next);
};

when the error is forwarded to Express error-handling middleware (next(error)) 
without manually calling next()

express-async-handler automatically catches async errors and prevents Express from crashing 

// Every thrown error in the application or the previous middleware function calling `next` 
// with an error as an argument will eventually go to this middleware function
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send(err);
});
*/
const asyncHandler = require("express-async-handler");

const getAuthorById = asyncHandler(async (req, res) => {
  const { authorId } = req.params;

  const author = await db.getAuthorById(Number(authorId));

  if (!author) {
    // res.status(404).send("Author not found");
    // return;
    /* with express-async-handler, I don't need to send an error response,
    I just need to throw an error 
    asyncHandler automatically catches the thrown error and calls next(),
    passing in the caught error as an argument, which passes control to 
    my custom error handler */
    throw new CustomNotFoundError("Author not found");
  }

  res.send(`Author Name: ${author.name}`);
});
module.exports = { getAuthorById };
