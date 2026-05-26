const Upload = require("../models/Upload");

const {
  extractTextFromFile,
} = require("../services/extractionService");

const {
  generateContent,
} = require("../services/geminiService");


// Generate itinerary
const generateItinerary = async (req, res) => {

  try {

    const { uploadId } = req.body;

    // Find uploaded file
    const upload = await Upload.findById(uploadId);

    if (!upload) {

      return res.status(404).json({
        success: false,
        message: "Upload not found",
      });

    }

    // Extract raw text
    const extractedText = await extractTextFromFile(
      upload.filepath,
      upload.mimetype
    );

    // Gemini Prompt
    const prompt = `
Extract travel information from this document.

Document Text:
${extractedText}

Return ONLY valid JSON format:

{
  "source": "",
  "destination": "",
  "travelDate": "",
  "airline": "",
  "hotel": "",
  "timings": ""
}
`;

    // AI Extraction
    const aiResponse = await generateContent(prompt);

    // Save itinerary to database
    const Itinerary = require("../models/Itinerary");
    const itinerary = await Itinerary.create({
      userId: req.user._id,
      uploadId: uploadId,
      extractedText: extractedText,
      aiResponse: aiResponse,
      destination: "",
      source: "",
      travelDate: "",
      airline: "",
      hotel: "",
      timings: "",
    });

    res.status(200).json({
      success: true,
      extractedText,
      aiResponse,
      itinerary,
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
};