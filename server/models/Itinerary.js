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

    transportType: {
      type: String,
    },

    trainName: {
      type: String,
    },

    trainNumber: {
      type: String,
    },

    pnr: {
      type: String,
    },

    departureTime: {
      type: String,
    },

    arrivalTime: {
      type: String,
    },

    passengerName: {
      type: String,
    },

    bookingReference: {
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

    // Parsed JSON extracted by AI
    extractedData: {
      type: Object,
      default: {},
    },

    itinerary: {
      type: String,
    },

    shareId: {
      type: String,
      unique: true,
    },
    isShared: {
      type: Boolean,
      default: true,
    },

    sharedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Itinerary", itinerarySchema);
