const {
  generateContent,
} = require("../services/geminiService");


const testGemini = async (req, res) => {

  try {

    const prompt =
      "Generate a 2-day travel itinerary for Goa.";

    const response = await generateContent(prompt);

    res.status(200).json({
      success: true,
      response,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

module.exports = {
  testGemini,
};