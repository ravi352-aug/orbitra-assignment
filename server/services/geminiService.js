const { GoogleGenerativeAI } = require("@google/generative-ai");


// Initialize Gemini
const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY
);


// Use Gemini Model
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});



// Generate Text Response
const generateContent = async (prompt) => {

  try {

    const result = await model.generateContent(prompt);

    const response = result.response.text();

    if (!response) {
      throw new Error("Empty response from Gemini");
    }

    return response;

  } catch (error) {

    console.error("Gemini Error:", error.message);

    throw new Error(`AI extraction failed: ${error.message}`);

  }

};

module.exports = {
  generateContent,
};