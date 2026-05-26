const Upload = require("../models/Upload");
const Itinerary = require("../models/Itinerary");


// Dashboard Stats
const getDashboardStats = async (req, res) => {

  try {

    const totalUploads = await Upload.countDocuments({
      userId: req.user._id,
    });

    const totalItineraries =
      await Itinerary.countDocuments({
        userId: req.user._id,
      });

    res.status(200).json({
      success: true,

      stats: {
        totalUploads,
        totalItineraries,
        sharedTrips: 0,
        aiProcessed: totalUploads,
      },
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};



// Recent Uploads
const getRecentUploads = async (req, res) => {

  try {

    const uploads = await Upload.find({
      userId: req.user._id,
    })
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      uploads,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};



// Recent Itineraries
const getRecentItineraries = async (req, res) => {

  try {

    const itineraries = await Itinerary.find({
      userId: req.user._id,
    })
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      itineraries,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};


module.exports = {
  getDashboardStats,
  getRecentUploads,
  getRecentItineraries,
};