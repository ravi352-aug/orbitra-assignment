const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const upload = require("../middleware/uploadMiddleware");

const {
  uploadFile,
} = require("../controllers/uploadController");

// Error handler for multer errors - must be applied after upload middleware
const handleMulterError = (err, req, res, next) => {
  if (err) {
    // Multer error
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "File size must be 10MB or less",
      });
    }
    if (err.code === "LIMIT_FILE_COUNT") {
      return res.status(400).json({
        success: false,
        message: "Only one file allowed per upload",
      });
    }
    return res.status(400).json({
      success: false,
      message: err.message || "File upload error",
    });
  }
  next();
};


// Protected Upload Route
router.post(
  "/",
  protect,
  upload.single("file"),
  handleMulterError,
  uploadFile
);

module.exports = router;
