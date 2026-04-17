const express = require("express");
const { getCompanyFeatures, updateCompanyFeatures, accessCompanyFeatures, getContacts, toggleCompanyStatus } = require("./../Controller/controllerCompanies");

const router = express.Router();

router.get("/getCompanyFeatures/:company_id", getCompanyFeatures);
router.put("/updateCompanyFeatures/:company_id", updateCompanyFeatures);
router.get("/accessCompanyFeatures/:company_id", accessCompanyFeatures);
router.get("/getContacts", getContacts);
router.patch("/toggleCompanyStatus/:company_id", toggleCompanyStatus);

module.exports = router;