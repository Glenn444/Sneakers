const express = require("express");
const {
  createUser,
  getallUser,
  getaUser,
  deleteaUser,
  updatedUser,
  handleRefreshToken,
  logout,
  updatePassword,
  forgotPasswordToken,
  resetPassword,
  loginAdmin,
  
} = require("../controller/userCtrl");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");
const router = express.Router();


router.post("/register", createUser);
router.post("/forgot-password-token", forgotPasswordToken);
router.put("/reset-password/:token", resetPassword);
router.put("/password", authMiddleware, updatePassword);

router.post("/admin-login", loginAdmin);



router.get("/all-users", getallUser);
router.get("/refresh", handleRefreshToken);
router.get("/logout", logout);

router.get("/:id", authMiddleware, isAdmin, getaUser);
router.delete("/:id",authMiddleware,isAdmin, deleteaUser);
router.put("/edit-user", authMiddleware, updatedUser);


module.exports = router;
