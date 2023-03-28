const express = require("express");
const consola = require("consola");
require("dotenv").config();
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const connectDB = require("./utils/mongo");

// intantiating app object
const app = express();

// definig default port
const PORT = process.env.PORT || 5500;

// app level middleware
app.use(morgan("common"));
app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// connect database
connectDB()

// get item on default route
app.get("/", (req, res) => {
  res.send({
    message: "Api for HR app",
  });
});

// user defined routes go here
app.use('/auth', require('./routes/auth'))

//not found handler
app.use((req, res, next) => {
  const error = new Error(`Not found - ${req.originalUrl}`);
  res.status(404);
  next(error);
});

//error handling middleware
app.use((error, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  console.log(error);
  res.send({
    message: error.message,
    stack:
      process.env.NODE_ENV === "production"
        ? "you are in production"
        : error.stack,
  });
});

// default listener
app.listen(PORT, (err) => {
  if (err) {
    consola.error("Error while starting server:- ", err);
    return;
  }
  return consola.success(`Server up on port ${PORT}`);
});
