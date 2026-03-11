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

const registerAdmin = async (req, res) => {
  const { name, email, mobile, password } = req.body;

  const createdAt = moment()
    .tz("Asia/Kolkata")
    .format("YYYY-MM-DD HH:mm:ss");

  if (!name || !email || !mobile || !password) {
    return res.status(400).json({
      status: "Failure",
      message: "All fields are required",
    });
  }

  try {

    db.query(
      "SELECT id FROM navics_member WHERE email = ? OR mobile = ?",
      [email, mobile],
      async (err, results) => {

        if (err) {
          return res.status(500).json({
            status: "Failure",
            message: "Database error",
            error: err,
          });
        }

        if (results.length > 0) {
          return res.status(409).json({
            status: "Failure",
            message: "Admin already exists",
          });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const insertQuery = `
          INSERT INTO navics_member
          (name, email, mobile, role, status, password, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        db.query(
          insertQuery,
          [name, email, mobile, "admin", "active", hashedPassword, createdAt],
          (err, result) => {

            if (err) {
              return res.status(500).json({
                status: "Failure",
                message: "Database insert error",
                error: err,
              });
            }

            return res.status(201).json({
              status: "Success",
              message: "Admin registered successfully",
              data: {
                id: result.insertId,
                name,
                email,
                mobile,
                role: "admin",
                status: "active",
              },
            });

          }
        );

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

const registerMember = async (req, res) => {
  const { name, email, mobile, password } = req.body;

  const createdAt = moment()
    .tz("Asia/Kolkata")
    .format("YYYY-MM-DD HH:mm:ss");

  if (!name || !email || !mobile || !password) {
    return res.status(400).json({
      status: "Failure",
      message: "All fields are required",
    });
  }

  try {
    db.query(
      "SELECT id FROM navics_member WHERE email = ? OR mobile = ?",
      [email, mobile],
      async (err, results) => {

        if (err) {
          return res.status(500).json({
            status: "Failure",
            message: "Database error",
            error: err,
          });
        }

        if (results.length > 0) {
          return res.status(409).json({
            status: "Failure",
            message: "Member already registered",
          });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const insertQuery = `
          INSERT INTO navics_member
          (name, email, mobile, role, status, password, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        db.query(
          insertQuery,
          [name, email, mobile, "member", "active", hashedPassword, createdAt],
          (err, result) => {

            if (err) {
              return res.status(500).json({
                status: "Failure",
                message: "Database insert error",
                error: err,
              });
            }

            return res.status(201).json({
              status: "Success",
              message: "Member registered successfully",
              data: {
                id: result.insertId,
                name,
                email,
                mobile,
                role: "member",
                status: "active",
              },
            });

          }
        );

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

const registerClientCompany = async (req, res) => {

  const { company_name, email, mobile, total_user_count, details } = req.body;

  const createdAt = moment()
    .tz("Asia/Kolkata")
    .format("YYYY-MM-DD HH:mm:ss");

  if (!company_name) {
    return res.status(400).json({
      status: "Failure",
      message: "Company name is required",
    });
  }

  try {

    db.query(
      "SELECT id FROM navics_client_company WHERE email = ? OR mobile = ?",
      [email, mobile],
      (err, results) => {

        if (err) {
          return res.status(500).json({
            status: "Failure",
            message: "Database error",
            error: err,
          });
        }

        if (results.length > 0) {
          return res.status(409).json({
            status: "Failure",
            message: "Company already exists",
          });
        }

        const insertQuery = `
        INSERT INTO navics_client_company
        (company_name, email, mobile, total_user_count, details, status, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        db.query(
          insertQuery,
          [company_name, email, mobile, total_user_count, details, "active", createdAt],
          (err, result) => {

            if (err) {
              return res.status(500).json({
                status: "Failure",
                message: "Database insert error",
                error: err,
              });
            }

            return res.status(201).json({
              status: "Success",
              message: "Company registered successfully",
              data: {
                id: result.insertId,
                company_name,
                email,
                mobile,
                total_user_count,
                status: "active",
              },
            });
          }
        );
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

const registerCompanyUser = async (req, res) => {

  const {
    company_id,
    employee_id,
    user_name,
    email,
    mobile,
    role,
    password,
    details
  } = req.body;

  const createdAt = moment()
    .tz("Asia/Kolkata")
    .format("YYYY-MM-DD HH:mm:ss");

  if (!company_id || !employee_id || !user_name || !role || !password) {
    return res.status(400).json({
      status: "Failure",
      message: "Required fields missing",
    });
  }

  try {

    db.query(
      "SELECT id FROM navics_company_users WHERE email = ? OR mobile = ?",
      [email, mobile],
      async (err, results) => {

        if (err) {
          return res.status(500).json({
            status: "Failure",
            message: "Database error",
            error: err,
          });
        }

        if (results.length > 0) {
          return res.status(409).json({
            status: "Failure",
            message: "User already exists",
          });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const insertQuery = `
        INSERT INTO navics_company_users
        (company_id, employee_id, user_name, email, mobile, role, password, details, status, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        db.query(
          insertQuery,
          [
            company_id,
            employee_id,
            user_name,
            email,
            mobile,
            role,
            hashedPassword,
            details,
            "active",
            createdAt
          ],
          (err, result) => {

            if (err) {
              return res.status(500).json({
                status: "Failure",
                message: "Database insert error",
                error: err,
              });
            }

            return res.status(201).json({
              status: "Success",
              message: "Company user registered successfully",
              data: {
                id: result.insertId,
                company_id,
                employee_id,
                user_name,
                role,
                status: "active",
              },
            });

          }
        );

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

const handleAuth = async (data, role, password, res) => {

  if (data.status !== "active") {
    return res.status(403).json({
      status: "Failure",
      message: "Account inactive",
    });
  }

  const isMatch = await bcrypt.compare(password, data.password);

  if (!isMatch) {
    return res.status(401).json({
      status: "Failure",
      message: "Invalid credentials",
    });
  }

  const token = jwt.sign(
    { id: data.id, role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  return res.status(200).json({
    status: "Success",
    token,
    role,
    user: {
      id: data.id,
      name: data.name || data.user_name,
      email: data.email,
      mobile: data.mobile,
      status: data.status,
      created_at: data.created_at,
    },
  });

};

const login = async (req, res) => {

  const { login, password } = req.body;

  if (!login || !password) {
    return res.status(400).json({
      status: "Failure",
      message: "Login and password required",
    });
  }

  try {

    // 1️⃣ Check Admin / Member
    db.query(
      "SELECT * FROM navics_member WHERE email = ? OR mobile = ? LIMIT 1",
      [login, login],
      async (err, memberResult) => {

        if (err) return res.status(500).json({ status: "Failure" });

        if (memberResult.length > 0) {
          return handleAuth(
            memberResult[0],
            memberResult[0].role, // admin / member
            password,
            res
          );
        }

        // 2️⃣ Check Company Users
        db.query(
          "SELECT * FROM navics_company_users WHERE email = ? OR mobile = ? LIMIT 1",
          [login, login],
          async (err, companyUserResult) => {

            if (err) return res.status(500).json({ status: "Failure" });

            if (companyUserResult.length > 0) {
              return handleAuth(
                companyUserResult[0],
                companyUserResult[0].role,
                password,
                res
              );
            }

            return res.status(401).json({
              status: "Failure",
              message: "Invalid credentials",
            });

          }
        );

      }
    );

  } catch (error) {
    return res.status(500).json({
      status: "Failure",
      message: "Server error",
    });
  }

};

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAILSENDER,
    pass: process.env.EMAILPASSWORD,
  },
});

const forgotOtpStore = new Map();
const otpRateLimitStore = new Map();

const sendPasswordOtpEmail = async (email, otp) => {
  const mailOptions = {
    from: `"Your Password OTP" <${process.env.EMAILSENDER}>`,
    to: email,
    subject: "Password Reset OTP",
    text: `Your password reset OTP code is: ${otp}`,
    html: `<b>Your password reset OTP code is: ${otp}</b>`,
  };

  const info = await transporter.sendMail(mailOptions);
  return info;
};

const generateOtp = () => {
  const n = crypto.randomInt(0, 1000000);
  return n.toString().padStart(6, "0");
};

const findUserByEmail = (email) => {
  return new Promise((resolve, reject) => {

    // Check navics_member (admin + member)
    db.query(
      "SELECT *, role FROM navics_member WHERE email = ? LIMIT 1",
      [email],
      (err, memberResult) => {

        if (err) return reject(err);

        if (memberResult.length > 0) {
          return resolve({
            ...memberResult[0],
            table: "navics_member",
          });
        }

        // Check company users
        db.query(
          "SELECT *, role FROM navics_company_users WHERE email = ? LIMIT 1",
          [email],
          (err, companyUserResult) => {

            if (err) return reject(err);

            if (companyUserResult.length > 0) {
              return resolve({
                ...companyUserResult[0],
                table: "navics_company_users",
              });
            }

            resolve(null);

          }
        );

      }
    );

  });
};

const forgotPassword = async (req, res) => {
  try {

    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        status: "Failure",
        message: "Email is required",
      });
    }

    const emailLower = email.trim().toLowerCase();
    const now = Date.now();

    const rate = otpRateLimitStore.get(emailLower) || {
      lastSentAt: 0,
      sentCount: 0,
    };

    if (now - rate.lastSentAt > 15 * 60 * 1000) {
      rate.sentCount = 0;
    }

    if (rate.sentCount >= 3) {
      return res.status(429).json({
        status: "Failure",
        message: "Too many requests. Try later.",
      });
    }

    const genericResponse = () =>
      res.status(200).json({
        status: "Success",
        message:
          "If the account exists, an OTP has been sent to the registered email.",
      });

    const user = await findUserByEmail(emailLower);

    if (!user) return genericResponse();

    if (user.status !== "active") {
      return res.status(403).json({
        status: "Failure",
        message: "Account inactive",
      });
    }

    const otp = generateOtp();
    const otpHash = await bcrypt.hash(otp, 10);

    forgotOtpStore.set(emailLower, {
      otpHash,
      expiresAt: now + 5 * 60 * 1000,
      attempts: 0,
      role: user.role,
      table: user.table,
    });

    rate.sentCount += 1;
    rate.lastSentAt = now;
    otpRateLimitStore.set(emailLower, rate);

    await sendPasswordOtpEmail(user.email, otp);

    return genericResponse();

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      status: "Failure",
      message: "Internal server error",
    });

  }
};

const verifyOtpAndResetPassword = async (req, res) => {

  try {

    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        status: "Failure",
        message: "Email, OTP and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        status: "Failure",
        message: "Password must be at least 6 characters",
      });
    }

    const emailLower = email.trim().toLowerCase();

    const otpData = forgotOtpStore.get(emailLower);

    if (!otpData || Date.now() > otpData.expiresAt) {

      forgotOtpStore.delete(emailLower);

      return res.status(400).json({
        status: "Failure",
        message: "OTP expired or invalid",
      });

    }

    otpData.attempts += 1;

    if (otpData.attempts > 5) {

      forgotOtpStore.delete(emailLower);

      return res.status(429).json({
        status: "Failure",
        message: "Too many attempts",
      });

    }

    const isValidOtp = await bcrypt.compare(String(otp), otpData.otpHash);

    if (!isValidOtp) {

      return res.status(400).json({
        status: "Failure",
        message: "Invalid OTP",
      });

    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    db.query(
      `UPDATE ${otpData.table} SET password = ? WHERE email = ?`,
      [hashedPassword, emailLower],
      (err) => {

        if (err) {

          console.error(err);

          return res.status(500).json({
            status: "Failure",
            message: "Failed to reset password",
          });

        }

        forgotOtpStore.delete(emailLower);

        return res.status(200).json({
          status: "Success",
          message: "Password reset successful",
        });

      }
    );

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      status: "Failure",
      message: "Internal server error",
    });

  }

};

module.exports = {
  registerAdmin,
  registerMember,
  registerClientCompany,
  registerCompanyUser,
  login,
  forgotPassword,
  verifyOtpAndResetPassword,
};