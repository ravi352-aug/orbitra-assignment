const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY
);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
});

const generateContent = async (prompt) => {

  try {

    const result = await model.generateContent(
      prompt
    );

    const response = result.response;

    return response.text();

  } catch (error) {

    console.error(
      "Gemini Full Error:",
      error.message
    );

    throw new Error(
      `AI extraction failed: ${error.message}`
    );

  }

};

module.exports = {
  generateContent,
};