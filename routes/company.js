const express = require("express");
const { requireUserSignIn } = require("../middleware/auth");
const Employee = require("../models/Employee");
const router = express.Router();

// get user info for a certain compant
router.get("/", requireUserSignIn, async (req, res, next) => {
  try {
    let remote = [];
    let office = [];
    const _user = req.user;
    // console.log("user info ---- ", _user);
    const all_employees = await Employee.find({ company: _user.company });
    for (let i = 0; i < all_employees.length; i++) {
      if (all_employees[i].work_type === "remote") {
        remote.push(all_employees[i]);
      } else if (all_employees[i].work_type === "office") {
        office.push(all_employees[i]);
      }
    }
    console.log(remote);
    return res.status(200).send({
      message: "company info found",
      employees: all_employees,
      remote: remote,
      office: office,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
