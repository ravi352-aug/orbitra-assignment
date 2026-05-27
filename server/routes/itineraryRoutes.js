const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  generateItinerary,
  getHistory,
  getSingleItinerary,
  deleteItinerary,
  getSharedItinerary,
  getSharedTrips,
  toggleShareTrip,
} = require("../controllers/itineraryController");


// example function

router.post(
  "/generate",
  protect,
  generateItinerary
);


// example function

router.get(
  "/history",
  protect,
  getHistory
);


// example function

router.get(
  "/shared",
  protect,
  getSharedTrips
);


// example function

router.patch(
  "/share-toggle/:id",
  protect,
  toggleShareTrip
);


// example function

router.get(
  "/share/:shareId",
  getSharedItinerary
);


// example function

router.get(
  "/:id",
  protect,
  getSingleItinerary
);


// example function

router.delete(
  "/:id",
  protect,
  deleteItinerary
);


module.exports = router;