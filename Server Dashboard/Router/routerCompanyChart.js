const express = require("express");
const {
  getRevenueByRegion,
  getRevenueByCountry,
  getRevenueTrend,
  getTargetVsRevenueByRegion,
  getGeoTargetByRegion,
  getGeoByCountry,
  getGeoByCity,
  getDashboardStats,
  stats,
  chart,
  trend,
  topComments,
  comments,
  sentimentByVideo,
  getSummary,
  getChart,
  getTweetAnalytics,
  getKPI,
  getTopPosts,
  getEngagement,
  getPostsOverTime,
  getPageComparison,
  getPosts,
  getPages,
  getInstaKPIs,
  getLikesOverTime,
  getPostTypeBreakdown,
  getAvgLikesByType,
  getCommentsTrend,
} = require("../Controller/controllerCompanyCharts");

const router = express.Router();

router.get("/getRevenueByRegion/:company_id", getRevenueByRegion);
router.get("/getRevenueByCountry/:company_id", getRevenueByCountry);
router.get("/getRevenueTrend/:company_id", getRevenueTrend);
router.get(
  "/getTargetVsRevenueByRegion/:company_id",
  getTargetVsRevenueByRegion,
);
router.get("/getGeoTargetByRegion/:company_id", getGeoTargetByRegion);
router.get("/getGeoByCountry/:company_id", getGeoByCountry);
router.get("/getGeoByCity/:company_id", getGeoByCity);
router.get("/getDashboardStats/:company_id", getDashboardStats);

// ----------------------------------------

router.get("/stats/:company_id", stats);
router.get("/chart/:company_id", chart);
router.get("/trend/:company_id", trend);
router.get("/top-comments/:company_id", topComments);
router.get("/comments/:company_id", comments);
router.get("/sentiment-by-video/:company_id", sentimentByVideo);

// ----------------------------------------

router.get("/getSummary/:company_id", getSummary);
router.get("/getChart/:company_id", getChart);
router.get("/getTweetAnalytics/:company_id", getTweetAnalytics);

// ----------------------------------------

router.get("/kpi/:company_id", getKPI);
router.get("/top-posts/:company_id", getTopPosts);
router.get("/engagement/:company_id", getEngagement);
router.get("/posts-over-time/:company_id", getPostsOverTime);
router.get("/page-comparison/:company_id", getPageComparison);
router.get("/posts/:company_id", getPosts);
router.get("/pages/:company_id", getPages);

// ----------------------------------------

router.get("/getInstaKPIs/:company_id", getInstaKPIs);
router.get("/likes-over-time/:company_id", getLikesOverTime);
router.get("/post-type-breakdown/:company_id", getPostTypeBreakdown);
router.get("/avg-likes-by-type/:company_id", getAvgLikesByType);
router.get("/comments-trend/:company_id", getCommentsTrend);

module.exports = router;