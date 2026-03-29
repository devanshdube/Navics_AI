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
const {
  getRevenueByRegion,
  getRevenueByCountry,
  getRevenueTrend,
  getTargetVsRevenueByRegion,
  stats,
  chart,
  trend,
  topComments,
  comments,
  getSummary,
  getChart,
  getGeoTargetByRegion,
  getGeoByCountry,
  getTweetAnalytics,
  // sentimentChartByVideo,
  sentimentByVideo,
  getGeoByCity,
  getDashboardStats,
  getKPI,
  getTopPosts,
  getEngagement,
  getPostsOverTime,
  getPageComparison,
  getPosts,
  getPages,
  getInstaKPIs,
  getPostTypeBreakdown,
  getLikesOverTime,
  getAvgLikesByType,
  getCommentsTrend,
} = require("../Controller/controllerChart");
const {
  getAllCompanies,
  getCompanies,
  getCompanyUsers,
} = require("../Controller/controllerGet");
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
router.get("/getGeoTargetByRegion", getGeoTargetByRegion);
router.get("/getGeoByCountry", getGeoByCountry);
router.get("/getGeoByCity", getGeoByCity);
router.get("/getDashboardStats", getDashboardStats);
// Youtube Chart GET
router.get("/stats", stats);
router.get("/chart", chart);
router.get("/trend", trend);
router.get("/top-comments", topComments);
router.get("/comments", comments);
// router.get("/sentimentChartByVideo", sentimentChartByVideo);
router.get("/sentimentByVideo", sentimentByVideo);
// Twitter Chart GET
router.get("/summary", getSummary);
router.get("/getChart", getChart);
router.get("/getTweetAnalytics", getTweetAnalytics);
// Facebook Chart GET
router.get("/getKPI", getKPI); // -
router.get("/getTopPosts", getTopPosts); // -
router.get("/getEngagement", getEngagement); // -
router.get("/getPostsOverTime", getPostsOverTime); // -
router.get("/getPageComparison", getPageComparison); // -
router.get("/getPosts", getPosts);
router.get("/getPages", getPages);
// Instagram Chart GET
router.get("/getInstaKPIs", getInstaKPIs);
router.get("/getLikesOverTime", getLikesOverTime);
router.get("/getPostTypeBreakdown", getPostTypeBreakdown);
router.get("/getAvgLikesByType", getAvgLikesByType);
router.get("/getCommentsTrend", getCommentsTrend);

module.exports = router;
