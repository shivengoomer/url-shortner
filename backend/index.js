const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
require("dotenv").config();
const port = process.env.PORT || 5000;
const urlRoute = require("./routes/urlRoutes");
const userRoutes = require("./routes/userRoutes");

const mongoose = require("mongoose");
const { isAuthenticated } = require("./controllers/authHelper");

// !important!
// you need to install the following libraries |express|[dotenv > if required]
// or run this command >> npm i express dotenv
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {});
    console.log("MongoDB is connected " + `${process.env.MONGO_URI}`);
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
};

connectDB();
app.use("/url", urlRoute);
app.use("/user", userRoutes);
app.get("/", (req, res) => {
  res.json({ message: "hello from simple server :)" });
});

app.listen(port, () =>
  console.log("> Server is up and running on port : " + port)
);
