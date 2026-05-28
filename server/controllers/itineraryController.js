const Upload = require("../models/Upload");
const Itinerary = require("../models/Itinerary");

const { v4: uuidv4 } = require("uuid");

const {
  extractTextFromFile,
} = require("../services/extractionService");

const {
  generateContent,
} = require("../services/geminiService");


// example function

const parseGeminiJson = (raw) => {

  if (!raw) return null;

  try {

    const cleaned = String(raw)
      .replace(/^```json/i, "")
      .replace(/^```/i, "")
      .replace(/```$/i, "")
      .trim();

    return JSON.parse(cleaned);

  } catch {

    try {

      const match =
        String(raw).match(/\{[\s\S]*\}/);

      if (!match) return null;

      return JSON.parse(match[0]);

    } catch {

      return null;

    }

  }

};


// example function

const fallbackExtraction = (text) => {

  const clean = text.replace(/\s+/g, " ");

  return {

    transportType: "Train",

    source:
      clean.match(/From\s+([A-Z\s()]+)/i)?.[1]?.trim() ||
      null,

    destination:
      clean.match(/To\s+([A-Z\s()]+)/i)?.[1]?.trim() ||
      null,

    travelDate:
      clean.match(/\d{2}-[A-Za-z]{3}-\d{4}/)?.[0] ||
      null,

    trainNumber:
      clean.match(/\b\d{5}\b/)?.[0] ||
      null,

    pnr:
      clean.match(/\b\d{10}\b/)?.[0] ||
      null,

    passengerName:
      clean.match(/([A-Z\s]+)\s+\d+\s+[MF]/i)?.[1]?.trim() ||
      null,

    departureTime:
      clean.match(/\b\d{2}:\d{2}\b/)?.[0] ||
      null,

    arrivalTime:
      clean.match(/\b\d{2}:\d{2}\b/g)?.[1] ||
      null,

    trainName:
      clean.match(/\/\s([A-Z\s]+)\s(SPL|EXPRESS|MAIL)/i)?.[0] ||
      null,

    airline: null,
    hotel: null,
    bookingReference: null,

  };

};


// example function

const buildFallbackItinerary = (data) => {

  return `
Day 1
- Departure from ${data.source || "source"}
- Begin your journey to ${data.destination || "destination"}

Day 2
- Arrive at destination
- Local exploration and relaxation

Day 3
- Continue trip or prepare return journey
`;

};


// example function

const generateItinerary = async (req, res) => {
  try {

    const { uploadId } = req.body;

    if (!uploadId) {

      return res.status(400).json({
        success: false,
        message: "uploadId is required",
      });

    }

    // Find upload
    const upload = await Upload.findById(uploadId);

    if (!upload) {
      return res.status(404).json({
        success: false,
        message: "Upload not found",
      });
    }

    // If an itinerary already exists for this upload, return it instead of creating a duplicate
    const existingItinerary = await Itinerary.findOne({
      uploadId,
      userId: req.user._id,
    });

    if (existingItinerary) {
      await Upload.findByIdAndUpdate(uploadId, {
        status: "processed",
        itineraryId: existingItinerary._id,
      });

      return res.status(200).json({
        success: true,
        itinerary: existingItinerary,
        existing: true,
      });
    }

    // Mark upload as processing while the extraction begins
    await Upload.findByIdAndUpdate(uploadId, {
      status: "processing",
    });

    const extractedText = await extractTextFromFile(
      upload.filepath,
      upload.mimetype,
    );

    const cleanedText =
      extractedText
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 4000);

    let parsedData = {};
    let aiResponse = "";
    let usedFallback = false;

    // example function

    try {

      const extractionPrompt = `
You are an intelligent travel document parser.

Extract ONLY real information from the text.

DO NOT hallucinate.
DO NOT invent hotels, flights, or cities.

Return ONLY valid JSON.

{
  "transportType": null,
  "source": null,
  "destination": null,
  "travelDate": null,
  "departureTime": null,
  "arrivalTime": null,
  "trainName": null,
  "trainNumber": null,
  "airline": null,
  "hotel": null,
  "passengerName": null,
  "pnr": null,
  "bookingReference": null
}

TEXT:
${cleanedText}
`;

      aiResponse =
        await generateContent(
          extractionPrompt
        );

      parsedData =
        parseGeminiJson(aiResponse);

      if (!parsedData) {
        throw new Error(
          "Failed to parse Gemini JSON"
        );
      }

    } catch (aiError) {

      console.log(
        "Gemini failed. Using fallback extraction..."
      );

      usedFallback = true;

      parsedData =
        fallbackExtraction(cleanedText);

      aiResponse =
        aiError.message;

    }

    // example function

    const normalize = (value) => {

      if (
        value === undefined ||
        value === null
      ) {
        return null;
      }

      const trimmed =
        String(value).trim();

      return trimmed.length
        ? trimmed
        : null;

    };

    const normalizedParsed = {

      transportType:
        normalize(parsedData.transportType),

      source:
        normalize(parsedData.source),

      destination:
        normalize(parsedData.destination),

      travelDate:
        normalize(parsedData.travelDate),

      departureTime:
        normalize(parsedData.departureTime),

      arrivalTime:
        normalize(parsedData.arrivalTime),

      trainName:
        normalize(parsedData.trainName),

      trainNumber:
        normalize(parsedData.trainNumber),

      airline:
        normalize(parsedData.airline),

      hotel:
        normalize(parsedData.hotel),

      passengerName:
        normalize(parsedData.passengerName),

      pnr:
        normalize(parsedData.pnr),

      bookingReference:
        normalize(parsedData.bookingReference),

    };

    // example function

    let generatedItinerary = "";

    if (!usedFallback) {

      try {

        const itineraryPrompt = `
Generate a concise factual itinerary.

Travel Details:
${JSON.stringify(normalizedParsed, null, 2)}

Rules:
- No hallucinations
- No fake data
- Use only real extracted information
`;

        generatedItinerary =
          await generateContent(
            itineraryPrompt
          );

      } catch {

        generatedItinerary =
          buildFallbackItinerary(
            normalizedParsed
          );

      }

    } else {

      generatedItinerary =
        buildFallbackItinerary(
          normalizedParsed
        );

    }

    // example function

    const itinerary = await Itinerary.create({
      userId: req.user._id,
      uploadId,
      title:
        normalizedParsed.destination &&
        normalizedParsed.travelDate
          ? `${normalizedParsed.destination} • ${normalizedParsed.travelDate}`
          : "Untitled Trip",
      extractedText,
      aiResponse,
      extractedData: normalizedParsed,
      destination: normalizedParsed.destination || "",
      source: normalizedParsed.source || "",
      travelDate: normalizedParsed.travelDate || "",
      transportType: normalizedParsed.transportType || "",
      trainName: normalizedParsed.trainName || "",
      trainNumber: normalizedParsed.trainNumber || "",
      pnr: normalizedParsed.pnr || "",
      departureTime: normalizedParsed.departureTime || "",
      arrivalTime: normalizedParsed.arrivalTime || "",
      passengerName: normalizedParsed.passengerName || "",
      airline: normalizedParsed.airline || "",
      hotel: normalizedParsed.hotel || "",
      bookingReference: normalizedParsed.bookingReference || "",
      itinerary: generatedItinerary,
      shareId: uuidv4(),
    });

    await Upload.findByIdAndUpdate(uploadId, {
      status: "processed",
      itineraryId: itinerary._id,
    });

    res.status(200).json({
      success: true,
      fallback: usedFallback,
      itinerary,
    });

  } catch (error) {
    console.error(
      "Generate Itinerary Error:",
      error
    );

    if (uploadId) {
      await Upload.findByIdAndUpdate(uploadId, {
        status: "failed",
      });
    }

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }

};


// example function

const getHistory = async (req, res) => {

  try {

    const itineraries =
      await Itinerary.find({
        userId: req.user._id,
      }).sort({
        createdAt: -1,
      });

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


// example function

const getSingleItinerary =
  async (req, res) => {

    try {

      const itinerary =
        await Itinerary.findById(
          req.params.id
        );

      if (!itinerary) {

        return res.status(404).json({
          success: false,
          message:
            "Itinerary not found",
        });

      }

      res.status(200).json({
        success: true,
        itinerary,
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message: error.message,
      });

    }

  };


// example function

const deleteItinerary =
  async (req, res) => {

    try {

      const itinerary =
        await Itinerary.findById(
          req.params.id
        );

      if (!itinerary) {

        return res.status(404).json({
          success: false,
          message:
            "Itinerary not found",
        });

      }

      await itinerary.deleteOne();

      res.status(200).json({
        success: true,
        message:
          "Itinerary deleted successfully",
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message: error.message,
      });

    }

  };


// example function

const getSharedItinerary =
  async (req, res) => {

    try {

      const itinerary =
        await Itinerary.findOne({
          shareId:
            req.params.shareId,
        });

      if (!itinerary) {

        return res.status(404).json({
          success: false,
          message:
            "Shared itinerary not found",
        });

      }

      res.status(200).json({
        success: true,
        itinerary,
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message: error.message,
      });

    }

  };


  const getSharedTrips =
  async (req, res) => {

    try {

      const itineraries =
        await Itinerary.find({

          userId: req.user._id,

          isShared: true,

        }).sort({
          createdAt: -1,
        });

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

  const toggleShareTrip =
  async (req, res) => {

    try {

      const itinerary =
        await Itinerary.findById(
          req.params.id
        );

      if (!itinerary) {

        return res.status(404).json({
          success: false,
          message:
            "Itinerary not found",
        });

      }

      itinerary.isShared =
        !itinerary.isShared;

      await itinerary.save();

      res.status(200).json({
        success: true,
        isShared:
          itinerary.isShared,
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message: error.message,
      });

    }

  };

module.exports = {
  generateItinerary,
  getHistory,
  getSingleItinerary,
  deleteItinerary,
  getSharedItinerary,
  getSharedTrips,
  toggleShareTrip,
};