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
