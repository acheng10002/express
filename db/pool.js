// load .env variables
require("dotenv").config();

const { Pool } = require("pg");

/* all the following properties should be read from environment variables 
hardcoding them here for simplicity */
module.exports = new Pool({
  /*
  host: "localhost",
  user: "amycheng",
  database: "top_users",
  password: "q",
  /* PostgreSQL database port, NOT Express server port, 
  this is the default port used to connect to PostgreSQL
  port: 5432,
  */
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
});

/* alternative for defining the connection information is through a 
Connection URI, used when I will connect with a hosted database service 
const { Pool } = require("pg");

// Again, this should be read from an environment variable
module.exports = new Pool({
  connectionString: "postgresql://amycheng:\q@localhost:5432/top_users"
});
*/
