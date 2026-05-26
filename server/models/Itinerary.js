const mongoose = require("mongoose");

const itinerarySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      default: "Untitled Trip",
    },

    destination: {
      type: String,
    },

    source: {
      type: String,
    },

    travelDate: {
      type: String,
    },

    airline: {
      type: String,
    },

    hotel: {
      type: String,
    },

    timings: {
      type: String,
    },

    uploadId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Upload",
    },

    aiResponse: {
      type: String,
    },

    extractedText: {
      type: String,
    },

    itinerary: {
      type: String,
    },

    shareId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Itinerary",
  itinerarySchema
);
