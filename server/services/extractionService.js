const fs = require("fs");
const path = require("path");

const pdfParse = require("pdf-parse");
const Tesseract = require("tesseract.js");


// Extract text from uploaded file
const extractTextFromFile = async (filePath, mimetype) => {

  try {

    // Absolute path
    const fullPath = path.resolve(filePath);

    if (!fs.existsSync(fullPath)) {
      throw new Error(`File not found: ${fullPath}`);
    }

    // ================= PDF =================
    if (mimetype === "application/pdf") {

      try {
        const dataBuffer = fs.readFileSync(fullPath);

        const pdfData = await pdfParse(dataBuffer);

        const text = pdfData.text || "";

        if (!text || text.trim().length === 0) {
          throw new Error("No text found in PDF");
        }

        return text;
      } catch (pdfError) {
        console.error("PDF parse error:", pdfError.message);
        throw new Error(`PDF extraction failed: ${pdfError.message}`);
      }

    }

    // ================= IMAGE =================
    if (
      mimetype === "image/jpeg" ||
      mimetype === "image/png" ||
      mimetype === "image/jpg"
    ) {

      try {
        const result = await Tesseract.recognize(
          fullPath,
          "eng"
        );

        const text = result.data.text || "";

        if (!text || text.trim().length === 0) {
          throw new Error("No text found in image");
        }

        return text;
      } catch (ocrError) {
        console.error("OCR error:", ocrError.message);
        throw new Error(`Image extraction failed: ${ocrError.message}`);
      }

    }

    throw new Error(`Unsupported file type: ${mimetype}`);

  } catch (error) {

    console.error("Extraction Error:", error.message);

    throw new Error(`Failed to extract text: ${error.message}`);

  }

};

module.exports = {
  extractTextFromFile,
};