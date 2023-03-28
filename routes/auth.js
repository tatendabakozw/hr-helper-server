const express = require("express");
const router = express.Router();

// register user
router.post("/register", (req, res, next) => {
  try {
    console.log("all register login goes here");
  } catch (error) {
    next(error);
  }
});

module.exports = router;
