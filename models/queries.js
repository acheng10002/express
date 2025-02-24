const pool = require("../db/pool");

/* with my pool initialized, I can use the query method */
async function getAllUsernames() {
  const { rows } = await pool.query("SELECT * FROM usernames");
  return rows;
}

async function insertUsername(username) {
  /* pg does query parameterization: 
  - 
  user entered  value, username, is passed as an array as the second argument,
  pg prevents SQL injection */
  await pool.query("INSERT INTO usernames (username) VALUES ($1)", [username]);
}

async function searchUsernames(searchValue) {
  const { rows } = await pool.query(
    "SELECT * FROM usernames WHERE username ILIKE ($1)",
    [searchValue]
  );
  return rows;
}

async function deleteUsernames() {
  await pool.query("DELETE FROM usernames");
  // for faster deletion and reset auto-increment (SERIAL) values
  // await pool.query("TRUNCATE TABLE usernames RESTART IDENTITY;");
}

module.exports = {
  getAllUsernames,
  insertUsername,
  searchUsernames,
  deleteUsernames,
};
