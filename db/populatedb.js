#! /usr/bin/env node
/* shebang #! - tells OS that this file is a script and specifies the
                interpreter 
/usr/bin/env - system utility that locates the node binary in user's
               environment 
               ensures the script runs with the correct node executable 
env - makes Node.js more portable, this path dynamically finds node in 
      the user's path 
      
automates creating a table and populating it with data 
pg (node-postgres) - library that I'll use to interface with PostgreSQL db
                     in my Express app 
                     
Client class - used for connecting to a PostgreSQL database in Node.js
               single-use connection to a PostgreSQL database
               unlike Pool, which manages multiple connections
               requires manual connection and disconnection */
const { Client } = require("pg");

const SQL = `
CREATE TABLE IF NOT EXISTS usernames (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    username VARCHAR ( 255 )
);

INSERT INTO usernames (username)
VALUES
    ('Bryan'),
    ('Odin'),
    ('Damon');
`;

// handles async database operations
async function main() {
  // log indicates the process is starting
  console.log("seeding...");
  // creates a PostgreSQL client instance
  const client = new Client({
    /* database connection URI 
    amycheng - db username
    q - db password 
    localhost - the database runs on the local machine
    5432 - default PostgreSQL port */
    connectionString: "postgresql://amycheng:q@localhost:5432/top_users",
  });

  // connects to the database asynchronously
  await client.connect();
  /* runs SQL script stored in SQL,
  creates the table if it doesn't exist
  inserts three users into usernames */
  await client.query(SQL);
  // closes the connection after executing the queries
  await client.end();
  // log indeicates the script finished executing
  console.log("done");
}

main();

/* instead of hardcoding the database connection string in the script or 
modifying the .env files, I can pass the database connection as a command-line
argument
process.argv[2]
process.argv[0] → Path to the Node.js executable.
process.argv[1] → Path to the executed script.
process.argv[2] → The first argument passed after the script name.

# populating local db 
node db/populatedb.js <local-db-url>

# populating production db
# run it from your machine once after deployment of your app & db
node db/populatedb.js <production-db-url>
*/
