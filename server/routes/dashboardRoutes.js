const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  getDashboardStats,
  getRecentUploads,
  getRecentItineraries,
} = require("../controllers/dashboardController");


// Protected Routes
router.get("/stats", protect, getDashboardStats);

router.get(
  "/recent-uploads",
  protect,
  getRecentUploads
);

router.get(
  "/recent-itineraries",
  protect,
  getRecentItineraries
);

module.exports = router;