const express = require("express");
const { getCompanyFeatures, updateCompanyFeatures } = require("./../Controller/controllerCompanies");

const router = express.Router();

router.get("/getCompanyFeatures/:company_id", getCompanyFeatures);
router.put("/updateCompanyFeatures/:company_id", updateCompanyFeatures);

module.exports = router;