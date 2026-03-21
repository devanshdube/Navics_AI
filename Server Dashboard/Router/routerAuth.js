const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const {
  registerAdmin,
  registerMember,
  registerClientCompany,
  registerCompanyUser,
  login,
  forgotPassword,
  verifyOtpAndResetPassword,
} = require("../Controller/controllerAuth");
const { getRevenueByRegion, getRevenueByCountry, getRevenueTrend, getTargetVsRevenueByRegion } = require("../Controller/controllerChart");
const { getAllCompanies, getCompanies, getCompanyUsers } = require("../Controller/controllerGet");
// const { updateStudentProfile } = require("../Controller/controllerUpdate");
// const { getAllStudent } = require("../Controller/controllerGet");

const router = express.Router();

router.post("/registerAdmin", registerAdmin);
router.post("/registerMember", registerMember);
router.post("/registerClientCompany", registerClientCompany);
router.post("/registerCompanyUser", registerCompanyUser);
router.post("/login", login);
router.post("/forgotPassword", forgotPassword);
router.post("/verifyOtpAndResetPassword", verifyOtpAndResetPassword);

// // UPDATE API's
// router.put("/updateStudentProfile/:id", updateStudentProfile);

// // GET API's
router.get("/getAllCompanies", getAllCompanies);
router.get("/getCompanies", getCompanies);
router.get("/company-users/:company_id", getCompanyUsers);
// Chart GET
router.get("/getRevenueByRegion", getRevenueByRegion);
router.get("/getRevenueByCountry", getRevenueByCountry);
router.get("/getRevenueTrend", getRevenueTrend);
router.get("/getTargetVsRevenueByRegion", getTargetVsRevenueByRegion);

module.exports = router;
