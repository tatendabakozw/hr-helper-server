const express = require("express");
const Hr = require("../models/Hr");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// regular express to verify email format
const emailRegexp = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

// register user
// post request
exports.registerHr = async (req, res, next) => {
    try {
      const { name, email, password, company } = req.body;
      // validate email
      if (!email) {
        return res.status(500).send({ message: "Please enter your email!" });
      }
      if (!emailRegexp.test(email)) {
        return res.status(401).send({ message: "Please enter a valid email" });
      }
  
      //validate password
      if (!password) {
        return res.status(500).send({ message: "Please enter your password!" });
      }
      if (password.length < 6) {
        return res.status(500).send({ message: "Password is too short!" });
      }
  
      // check is user already exists in database
      let _user = await Hr.findOne({ email: email });
  
      //create new user object
      const newHR = new Hr({
        email: email,
        password: bcrypt.hashSync(password, 12),
        name: name,
        company: company,
      });
  
      if (_user) {
        return res.status(500).send({ message: "Hr already exists" });
      }
  
      await newHR.save(); // save user into database
      return res.status(200).send({ message: "Account Created" }); //send back response to client
    } catch (error) {
      next(error);
    }
  }

  exports.loginHr = async (req, res, next) => {
    try {
      // fields from request
      const { email, password } = req.body;
  
      const _hr = await Hr.findOne({ email: email });
  
      if (!_hr) {
        return res.status(404).send({ message: "Account does not exist" });
      }
  
      const password_correct = await bcrypt.compare(password, _hr.password);
      if (password_correct) {
        const token = await jwt.sign(
          {
            name: _hr.name,
            email: _hr.email,
            _id: _hr._id,
            company: _hr.company,
            photoURL: _hr.photoURL,
          },
          process.env.JWT_SECRET
        );
        if (token) {
          const hr = {
            name: _hr.name,
            email: _hr.email,
            _id: _hr._id,
            company: _hr.company,
            token: token,
          };
  
          return res.send({ ...hr, message: "logged in sucessfully" });
        } else {
          return res
            .status(422)
            .send({ message: "Failed to login, Wrong details!" });
        }
      }
    } catch (error) {
      next(error);
    }
  }