const express = require("express");
const {
  createProduct,
  getaProduct,
  getAllProduct,
  updateProduct,
  deleteProduct,
} = require("../controller/productCtrl");
const { isAdmin, authMiddleware } = require("../middlewares/authMiddleware");
const { searchCtrl } = require("../controller/searchCtrl");
const router = express.Router();

router.post("/", authMiddleware, isAdmin, createProduct);

router.get("/search", searchCtrl);
router.get("/:id", getaProduct);


router.patch("/:id", authMiddleware, isAdmin, updateProduct);
router.delete("/:id", authMiddleware, isAdmin, deleteProduct);

router.get("/", getAllProduct);

module.exports = router;
