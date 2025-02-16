// I can create my own custom error by extending the Error object
class CustomNotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 404;
    // NotFoundError: message instead of  Error: message
    this.name = "NotFoundError";
  }
}

module.exports = CustomNotFoundError;
