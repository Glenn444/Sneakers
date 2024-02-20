const express = require("express");

const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const { createfashionModel, updatefashionModel, deletefashionModel, getfashionModel, getallFashionModels } = require("../controller/fashionModel");
const router = express.Router();

router.post("/", authMiddleware, isAdmin, createfashionModel);
router.put("/:id", authMiddleware, isAdmin, updatefashionModel);
router.delete("/:id", authMiddleware, isAdmin, deletefashionModel);
router.get("/:id", getfashionModel);
router.get("/", getallFashionModels);

module.exports = router;
