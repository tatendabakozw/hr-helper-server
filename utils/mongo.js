const mongoose = require("mongoose");
const consola = require("consola");

// mongodb url
const LOCAL_DB = process.env.DATABASE_URL;

// funciton to conenct db
const connectDB = () => {
  mongoose.connect(LOCAL_DB, {});
  mongoose.connection.once("open", (err) => {
    if (err) {
      consola.error("there was an error :- ", err);
    } else {
      consola.success(`Database Connected Successfully`);
    }
  });
};

// export databse funtoin to yse it in other files
module.exports = connectDB;
