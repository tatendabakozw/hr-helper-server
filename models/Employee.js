const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    role: {
      type: String, // software developer
      default: "",
      required: true,
    },
    salary: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
    },
    national_id: {
      type: String,
      required: true,
    },
    work_type: {
      type: String,
      enum: ["remote", "office"],
    },
    company: {
      type: String,
      required: true,
      default: "",
    },
    hr: {
      type: String,
      required: true,
      default: "",
    },
    hr: {
      type: String,
      required: true,
      default: "",
    },
    photoURL: {
      type: String,
      default: "",
    },
    job_title: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Employee", employeeSchema);
