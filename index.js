const express = require("express");

const app = express();

const userRouter = require("./routes/userRouter");

// user.js will be accessible through local host 3005/user
app.use("/user", userRouter);

app.listen(3005, () => {
  console.log("Server running on port 3005");
});

/* controllers - where I execute operations on the data (in models) 
where I manage data - make the request to database in models and manipulate the 
data through controllers */
