const { db } = require("./../connect");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const moment = require("moment-timezone");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const updateStudentProfile = async (req, res) => {
  const { id } = req.params;

  const {
    alt_mobile,
    degree,
    semester,
    complete_year,
    address,
    city,
    state,
    pincode,
    roll_no,
    profileImg,
  } = req.body;

  const updatedAt = moment()
    .tz("Asia/Kolkata")
    .format("YYYY-MM-DD HH:mm:ss");

  // 🛑 ID validation
  if (!id) {
    return res.status(400).json({
      status: "Failure",
      message: "Student ID is required",
    });
  }

  try {
    db.query(
      `UPDATE users SET
        alt_mobile = ?,
        degree = ?,
        semester = ?,
        complete_year = ?,
        address = ?,
        city = ?,
        state = ?,
        pincode = ?,
        roll_no = ?,
        profileImg = ?,
        document_status = 'active',
        updated_at = ?
       WHERE id = ? AND designation = 'user'`,
      [
        alt_mobile,
        degree,
        semester,
        complete_year,
        address,
        city,
        state,
        pincode,
        roll_no,
        profileImg,
        updatedAt,
        id,
      ],
      (err, result) => {
        if (err) {
          return res.status(500).json({
            status: "Failure",
            message: "Database error",
            error: err,
          });
        }

        if (result.affectedRows === 0) {
          return res.status(404).json({
            status: "Failure",
            message: "Student not found or not authorized",
          });
        }

        return res.status(200).json({
          status: "Success",
          message: "Student profile updated successfully",
        });
      }
    );
  } catch (error) {
    return res.status(500).json({
      status: "Failure",
      message: "Server error",
      error,
    });
  }
};


module.exports = {
updateStudentProfile
};