const express = require("express");
const { requireUserSignIn } = require("../middleware/auth");
const Employee = require("../models/Employee");
const Hr = require("../models/Hr");
const router = express.Router();

// create a new ewmployee
// post request
// /exployee/create
router.post("/create", requireUserSignIn, async (req, res, next) => {
  try {
    const {
      first_name,
      last_name,
      email,
      phone,
      salary,
      gender,
      national_id,
      work_type,
      photoURL,
      job_title
    } = req.body;

    const user = req.user;
    const _hr = await Hr.findOne({ _id: user._id });

    if (!_hr) {
      return res.status({
        message: "Your account is not allowed to perfom such action",
      });
    }

    const logged_in_hr = _hr;

    if (!first_name) {
      return res.status(400).send({ message: "Please provide a first name" });
    }
    if (!last_name) {
      return res.status(400).send({ message: "Please provide a last name" });
    }
    if (!email) {
      return res.status(400).send({ message: "Please provide a email" });
    }
    if (!phone) {
      return res.status(400).send({ message: "Please provide a phone number" });
    }
    if (!last_name) {
      return res
        .status(400)
        .send({ message: "Please provide a employee salary" });
    }
    if (!national_id) {
      return res.status(400).send({ message: "Please provide a first name" });
    }
    if (!work_type) {
      return res.status(400).send({ message: "Please provide type of work" });
    }
    if (!job_title) {
      return res.status(400).send({ message: "Please provide job title" });
    }

    const newEmployee = new Employee({
      first_name,
      last_name,
      email,
      phone,
      role: "employee",
      salary,
      gender,
      national_id,
      work_type,
      company: logged_in_hr.company,
      hr: logged_in_hr._id,
      photoURL,
      job_title
    });

    const savedEmployee = await newEmployee.save();

    return res
      .status(200)
      .send({ message: "Exployee saved", employee: savedEmployee });
  } catch (error) {
    next(error);
  }
});

// get single employee
// get request
router.get("/get/:id", requireUserSignIn, async (req, res, next) => {
  try {
    const { id } = req.params;
    const employee = await Employee.findOne({ _id: id });
    if (!employee) {
      return res.status(404).send({ message: "Employee not found" });
    }
    return res.status(200).send({ message: "Employee found", employee });
  } catch (error) {
    next(error);
  }
});

// get all company employees
router.get("/all", requireUserSignIn, async (req, res, next) => {
  try {
    const _user = req.user;
    const _hr = await Hr.findOne({ _id: _user._id });

    // handling creator schema
    let query = [];

    query.push({
      $match: {
        company: _hr.company,
      },
    });

    // handling search queries
    if (req.query.keyword && req.query.keyword != "") {
      query.push({
        $match: {
          $or: [
            { first_name: { $regex: req.query.keyword, $options: "i" } },
            { last_name: { $regex: req.query.keyword, $options: "i" } },
            { email: { $regex: req.query.keyword, $options: "i" } },
            { phone: { $regex: req.query.keyword, $options: "i" } },
            { national_id: { $regex: req.query.keyword, $options: "i" } },
            { work_type: { $regex: req.query.keyword, $options: "i" } },
          ],
        },
      });
    }

    // handling sort
    if (req.query.sortBy && req.query.sortOrder) {
      var sort = {};
      sort[req.query.sortBy] = req.query.sortOrder == "asc" ? 1 : -1;
      query.push({
        $sort: sort,
      });
    } else {
      query.push({
        $sort: { createdAt: -1 },
      });
    }
    // handling pagination
    let total = await Employee.countDocuments(query);
    let page = req.query.page ? parseInt(req.query.page) : 1;
    let perPage = req.query.perPage ? parseInt(req.query.perPage) : 16;
    let skip = (page - 1) * perPage;

    query.push({
      $skip: skip,
    });
    query.push({
      $limit: perPage,
    });

    let employees = await Employee.aggregate(query);

    return res.status(200).send({
      message: "Employees fetched sucessfully",
      length: employees.length,
      meta: {
        total: total,
        currentPage: page,
        perPage: perPage,
        totalPages: Math.ceil(total / perPage),
      },
      employees: employees,
    });
  } catch (error) {
    next(error);
  }
});

// edit single employee
router.put("/edit/:id", requireUserSignIn, async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      first_name,
      last_name,
      email,
      phone,
      salary,
      gender,
      national_id,
      work_type,
      photoURL,
    } = req.body;

    const _user = req.user;
    const editor = Hr.findOne({ _id: _user._id });
    const employee = await Employee.findOne({ _id: id });
    if (editor.company !== employee.company) {
      return res
        .status(403)
        .send({ message: "Not allowed to edit from other company" });
    }
    employee.first_name = first_name;
    employee.last_name = last_name;
    employee.email = email;
    employee.salary = salary;
    employee.phone = phone;
    employee.salary = salary;
    employee.gender = gender;
    employee.national_id = national_id;
    employee.work_type = work_type;
    employee.photoURL = photoURL;

    await employee.save();
    return res.status(200).send({ message: "Employee Edited!" });
  } catch (error) {
    next(error);
  }
});

// delete an employee

module.exports = router;
