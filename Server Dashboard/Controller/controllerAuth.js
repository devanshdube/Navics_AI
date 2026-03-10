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

  const createdAt = moment().tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");

  if (!name || !email || !mobile || !password) {
    return res.status(400).json({
      status: "Failure",
      message: "All fields are required",
    });
  }

  try {
    db.query(
      "SELECT id FROM admins WHERE email = ? OR mobile = ?",
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
            message: "Admin already registered",
          });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        db.query(
          `INSERT INTO admins 
           (name, email, mobile, designation, status, password, created_at)
           VALUES (?, ?, ?, 'admin', 'active', ?, ?)`,
          [name, email, mobile, hashedPassword, createdAt],
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
                designation: "admin",
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

const registerStudent = async (req, res) => {
  const { name, email, mobile, course, college_name, password } = req.body;

  const createdAt = moment().tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");

  // Validation
  if (!name || !email || !mobile || !course || !college_name || !password) {
    return res.status(400).json({
      status: "Failure",
      message: "All fields are required",
    });
  }

  try {
    // ✅ Check in users table
    db.query(
      "SELECT id FROM users WHERE email = ? OR mobile = ?",
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
            message: "Student already registered",
          });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // ✅ Insert into users table
        db.query(
          `INSERT INTO users 
           (name, email, mobile, designation, course, college_name, password, status, created_at)
           VALUES (?, ?, ?, 'user', ?, ?, ?, 'inactive', ?)`,
          [
            name,
            email,
            mobile,
            course,
            college_name,
            hashedPassword,
            createdAt,
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
              message: "Student registered successfully",
              data: {
                id: result.insertId,
                name,
                email,
                mobile,
                designation: "user",
                course,
                college_name,
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

  const token = jwt.sign({ id: data.id, role }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  return res.status(200).json({
    status: "Success",
    token,
    role,
    user: {
      id: data.id,
      name: data.name,
      email: data.email,
      status: data.status,
      created_at: data.created_at,
      designation: data.designation,
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
    // 1️⃣ Check Admin
    db.query(
      "SELECT * FROM admins WHERE email = ? OR mobile = ?",
      [login, login],
      async (err, adminResult) => {
        if (err) return res.status(500).json({ status: "Failure" });

        if (adminResult.length > 0) {
          return handleAuth(adminResult[0], "admin", password, res);
        }

        // 2️⃣ Check User
        db.query(
          "SELECT * FROM users WHERE email = ? OR mobile = ?",
          [login, login],
          async (err, userResult) => {
            if (err) return res.status(500).json({ status: "Failure" });

            if (userResult.length === 0) {
              return res.status(401).json({
                status: "Failure",
                message: "Invalid credentials",
              });
            }

            return handleAuth(userResult[0], "user", password, res);
          }
        );
      }
    );
  } catch (error) {
    return res.status(500).json({ status: "Failure" });
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
    db.query(
      "SELECT *, 'admin' AS role FROM admins WHERE email = ? LIMIT 1",
      [email],
      (err, adminResult) => {
        if (err) return reject(err);

        if (adminResult.length > 0) {
          return resolve(adminResult[0]);
        }

        db.query(
          "SELECT *, 'user' AS role FROM users WHERE email = ? LIMIT 1",
          [email],
          (err, userResult) => {
            if (err) return reject(err);
            resolve(userResult.length > 0 ? userResult[0] : null);
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
        message: "Too many requests. Please try again later.",
      });
    }

    const genericResponse = () =>
      res.status(200).json({
        status: "Success",
        message:
          "If the account exists, an OTP has been sent to the registered email.",
      });

    const user = await findUserByEmail(emailLower);

    // ❗ Don't reveal existence
    if (!user) return genericResponse();

    if (user.status !== "active") {
      return res.status(403).json({
        status: "Failure",
        message: "Account inactive. Contact admin.",
      });
    }

    const otp = generateOtp();
    const otpHash = await bcrypt.hash(otp, 10);

    forgotOtpStore.set(emailLower, {
      otpHash,
      expiresAt: now + 5 * 60 * 1000,
      attempts: 0,
      role: user.role,
    });

    rate.sentCount += 1;
    rate.lastSentAt = now;
    otpRateLimitStore.set(emailLower, rate);

    await sendPasswordOtpEmail(user.email, otp);
    return genericResponse();
  } catch (error) {
    console.error("Forgot password error:", error);
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
        message: "Too many attempts. Request a new OTP.",
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

    const table = otpData.role === "admin" ? "admins" : "users";

    db.query(
      `UPDATE ${table} SET password = ? WHERE email = ?`,
      [hashedPassword, emailLower],
      (err) => {
        if (err) {
          console.error("Password update error:", err);
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
    console.error("Reset password error:", error);
    return res.status(500).json({
      status: "Failure",
      message: "Internal server error",
    });
  }
};

module.exports = {
  registerAdmin,
  registerStudent,
  login,
  forgotPassword,
  verifyOtpAndResetPassword,
};