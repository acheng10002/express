/* const getUser = (req, res) => {
  res.send("User: Kai Ludlow");
};

module.exports = { getUser }; */
module.exports = {
  get: (req, res) => {
    res.send("User: Kai Ludlow");
  },
};
