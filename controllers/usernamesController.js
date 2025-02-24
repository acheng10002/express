// imports local module with queries
const db = require("../models/queries");

/*
exports.usernamesLogGet = (req, res) => {
  console.log("usernames will be logged here - wip");
};
*/

// controller function that gets all usernames in the db
async function usernamesLogGet(req, res) {
  // gets all usernames/rows as an array of objects
  const usernames = await db.getAllUsernames();
  if (Object.keys(req.query).length > 0) {
    const searchValue = Object.values(req.query)[0];
    const searchValueSQL = `%${searchValue}%`;
    const searchResults = await db.searchUsernames(searchValueSQL);
    return res.send(
      "Search results: " +
        searchResults.map((searchResult) => searchResult.username).join(", ")
    );
  }
  console.log("Usernames: ", usernames);
  /* sends response, maps over the usernames array of object, accesses username 
  property of each object, anc concatenates the username property values with join */
  res.send("Usernames: " + usernames.map((user) => user.username).join(", "));
}

/*
exports.usernamesInsertGet = (req, res) => {
  res.render("formTwo");
};
*/

async function usernamesInsertGet(req, res) {
  res.render("formTwo");
}

/*
exports.usernamesInsertPost = (req, res) => {
  console.log("username to be saved: ", req.body.username);
};
*/

async function usernamesInsertPost(req, res) {
  // destructures username from req.body
  const { username } = req.body;
  await db.insertUsername(username);
  res.redirect("/");
}

async function usernamesDeleteGet(req, res) {
  await db.deleteUsernames();
  res.redirect("/");
}

module.exports = {
  usernamesLogGet,
  usernamesInsertGet,
  usernamesInsertPost,
  usernamesDeleteGet,
};
