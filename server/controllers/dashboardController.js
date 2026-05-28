const Upload = require("../models/Upload");
const Itinerary = require("../models/Itinerary");


const getDashboardStats = async (req, res) => {
  try {
    const totalUploads = await Upload.countDocuments({
      userId: req.user._id,
    });

    const totalItineraries = await Itinerary.countDocuments({
      userId: req.user._id,
    });

    const sharedTrips = await Itinerary.countDocuments({
      userId: req.user._id,
      isShared: true,
    });

    const transportCounts = await Itinerary.aggregate([
      { $match: { userId: req.user._id } },
      {
        $group: {
          _id: {
            $ifNull: ["$transportType", "Unknown"],
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 1 },
    ]);

    const mostUsedTransport =
      transportCounts[0]?._id || "Unknown";

    res.status(200).json({
      success: true,
      stats: {
        totalUploads,
        totalItineraries,
        sharedTrips,
        aiProcessed: totalItineraries,
        mostUsedTransport,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getDashboardAnalytics = async (req, res) => {
  try {
    const userId = req.user._id;
    const now = new Date();

    const sixWeeksAgo = new Date(now);
    sixWeeksAgo.setDate(now.getDate() - 42);

    const sixMonthsAgo = new Date(now);
    sixMonthsAgo.setMonth(now.getMonth() - 5);
    sixMonthsAgo.setDate(1);

    const uploads = await Upload.find({
      userId,
      createdAt: { $gte: sixWeeksAgo },
    }).sort({ createdAt: 1 });

    const itineraries = await Itinerary.find({
      userId,
      createdAt: { $gte: sixMonthsAgo },
    }).sort({ createdAt: 1 });

    const activityItems = [];

    uploads.forEach((upload) => {
      activityItems.push({
        id: `upload-${upload._id}`,
        type: "upload",
        title: `Uploaded ${upload.filename}`,
        description: "Document received for AI extraction",
        timestamp: upload.createdAt,
      });
    });

    itineraries.forEach((itinerary) => {
      activityItems.push({
        id: `itinerary-${itinerary._id}`,
        type: "itinerary",
        title: `Generated ${itinerary.destination || "trip"} itinerary`,
        description: "AI travel plan was created",
        timestamp: itinerary.createdAt,
      });

      if (itinerary.isShared && itinerary.sharedAt) {
        activityItems.push({
          id: `shared-${itinerary._id}`,
          type: "shared",
          title: `Shared ${itinerary.destination || "trip"}`,
          description: "Shareable itinerary link available",
          timestamp: itinerary.sharedAt,
        });
      }
    });

    if (req.user.updatedAt && req.user.updatedAt > req.user.createdAt) {
      activityItems.push({
        id: "profile-update",
        type: "profile",
        title: "Updated profile settings",
        description: "Your account preferences were saved",
        timestamp: req.user.updatedAt,
      });
    }

    const activities = activityItems
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 12);

    const uploadsPerWeek = [];
    for (let week = 0; week < 6; week += 1) {
      const start = new Date(sixWeeksAgo);
      start.setDate(sixWeeksAgo.getDate() + week * 7);
      const end = new Date(start);
      end.setDate(start.getDate() + 7);

      const label = `${start.toLocaleDateString("en-US", {
        month: "short",
      })} ${start.getDate()}`;
      uploadsPerWeek.push({
        week: label,
        count: uploads.filter(
          (upload) => upload.createdAt >= start && upload.createdAt < end,
        ).length,
      });
    }

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const itinerariesPerMonth = [];
    for (let monthOffset = 0; monthOffset < 6; monthOffset += 1) {
      const month = new Date(now.getFullYear(), now.getMonth() - 5 + monthOffset, 1);
      const nextMonth = new Date(month.getFullYear(), month.getMonth() + 1, 1);
      itinerariesPerMonth.push({
        month: `${monthNames[month.getMonth()]} ${month.getFullYear()}`,
        count: itineraries.filter(
          (itinerary) => itinerary.createdAt >= month && itinerary.createdAt < nextMonth,
        ).length,
      });
    }

    const transportDistribution = await Itinerary.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: { $ifNull: ["$transportType", "Unknown"] },
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    const formattedTransportDistribution = transportDistribution.map((item) => ({
      transportType: item._id,
      count: item.count,
    }));

    res.status(200).json({
      success: true,
      analytics: {
        uploadsPerWeek,
        itinerariesPerMonth,
        transportDistribution: formattedTransportDistribution,
        recentActivities: activities,
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

    const itineraryMap = await Itinerary.find({
      userId: req.user._id,
      uploadId: { $in: uploads.map((upload) => upload._id) },
    }).select("uploadId _id");

    const itineraryByUpload = itineraryMap.reduce((acc, itinerary) => {
      acc[itinerary.uploadId.toString()] = itinerary._id;
      return acc;
    }, {});

    const normalizedUploads = uploads.map((upload) => ({
      ...upload.toObject(),
      itineraryId: itineraryByUpload[upload._id.toString()] || upload.itineraryId || null,
      status: itineraryByUpload[upload._id.toString()] ? "processed" : upload.status,
    }));

    res.status(200).json({
      success: true,
      uploads: normalizedUploads,
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
  getDashboardAnalytics,
  getRecentUploads,
  getRecentItineraries,
};