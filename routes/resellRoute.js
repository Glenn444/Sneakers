const express = require("express");
const { getsneakerResells } = require("../controller/resellCtrl");


const router = express.Router();


router.get("/", getsneakerResells);

module.exports = router;
