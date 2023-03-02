const express = require("express");
const {
  getUsers,
  registerUser,
  loginUser,
  updateUserProfile,
} = require("../controllers/userController");
const {
  verifyIsLoggedIn,
  verifyIsAdmin,
} = require("../middleware/verifyAuthToken");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

// user logged in routes:
router.use(verifyIsLoggedIn);
router.put("/profile", updateUserProfile);

// admin routes:
router.use(verifyIsAdmin);
router.get("/", getUsers);

module.exports = router;
