const express = require("express");

const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const {
  createtargetAudience,
  updatetargetAudience,
  deletetargetAudience,
  gettargetAudience,
  getalltargetAudiences,
} = require("../controller/targetAudience");

const router = express.Router();

router.post("/", authMiddleware, isAdmin, createtargetAudience);
router.put("/:id", authMiddleware, isAdmin, updatetargetAudience);
router.delete("/:id", authMiddleware, isAdmin, deletetargetAudience);
router.get("/:id", gettargetAudience);
router.get("/", getalltargetAudiences);

module.exports = router;
