const express = require("express");
const {
  verifyIsLoggedIn,
  verifyIsAdmin,
} = require("../middleware/verifyAuthToken");
const getUserOrders = require("../controllers/orderController");

const router = express.Router();

// user routes
router.use(verifyIsLoggedIn);
router.get("/", getUserOrders);

// admin routes
router.use(verifyIsAdmin);

module.exports = router;
