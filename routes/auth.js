const express = require("express");
const router = express.Router();
const { registerHr, loginHr } = require("../controllers/authController");

// register user
// post request
router.post("/register", registerHr);

// login as hr
// post request
router.post("/login", loginHr);

module.exports = router;
