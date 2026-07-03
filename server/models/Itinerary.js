const mongoose = require("mongoose");

const itinerarySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    uploadId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Upload",
    },

    title: {
      type: String,
      default: "Untitled Trip",
    },

    // Document type detection
    documentType: String, // "Hotel", "Flight", "Train", "Bus", "Cruise", "Tour", "Airbnb", "Visa", "Multi"
    
    // Location information
    destination: String,
    source: String,
    city: String,
    country: String,

    // Travel dates and times
    travelDate: String,
    checkInDate: String,
    checkOutDate: String,
    departureTime: String,
    arrivalTime: String,
    boardingTime: String,

    // Transport information
    transportType: String,
    airline: String,
    flightNumber: String,
    trainName: String,
    trainNumber: String,
    trainCoach: String,
    busOperator: String,
    busNumber: String,

    // Booking references
    pnr: String,
    bookingReference: String,
    boardingPassNumber: String,
    confirmationNumber: String,

    // Passenger/Guest information
    passengerName: String,
    guestName: String,
    numberOfGuests: Number,
    numberOfChildren: Number,
    numberOfAdults: Number,

    // Hotel specific
    hotel: String,
    hotelAddress: String,
    hotelCity: String,
    hotelCountry: String,
    roomType: String,
    roomNumber: String,
    numberOfRooms: Number,

    // Flight specific
    terminal: String,
    gate: String,
    seatNumber: String,

    // Train specific
    platform: String,
    seatCoach: String,

    // Bus specific
    boardingPoint: String,
    dropPoint: String,

    // Contact information
    contactPhone: String,
    contactEmail: String,

    // Additional details
    timings: String,
    notes: String,
    amenities: [String],

    // AI processing
    aiResponse: String,
    extractedText: String,
    extractedData: {
      type: Object,
      default: {},
    },

    itinerary: String,

    shareId: {
      type: String,
      unique: true,
    },

    isShared: {
      type: Boolean,
      default: false,
    },

    fallback: {
      type: Boolean,
      default: false,
    },

    warnings: {
      type: [String],
      default: [],
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