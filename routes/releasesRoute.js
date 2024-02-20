const express = require("express");
const { getAllReleases } = require("../controller/releasesCtrl");



const router = express.Router();


router.get("/", getAllReleases);

module.exports = router;
