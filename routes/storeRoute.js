const express = require('express');
const router = express.Router();
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const { createStore, getallStores, getStore, deleteStore, updateStore } = require('../controller/storeCtrl');


router.post("/", authMiddleware, isAdmin, createStore);
router.get("/",  getallStores);

router.get("/:id",  getStore);
router.delete("/:id", authMiddleware, isAdmin, deleteStore);
router.put("/:id", authMiddleware, isAdmin, updateStore);

module.exports = router;