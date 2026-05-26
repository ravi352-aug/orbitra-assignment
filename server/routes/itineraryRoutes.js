const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  generateItinerary,
} = require("../controllers/itineraryController");


// Protected Route
router.post(
  "/generate",
  protect,
  generateItinerary
);

module.exports = router;