const Upload = require("../models/Upload");

const uploadFile = async (req, res) => {

  try {

    if (!req.file) {

      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });

    }

    if (!req.user) {

      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });

    }

    // Save upload in MongoDB
    const upload = await Upload.create({

      userId: req.user._id,

      filename: req.file.filename,

      filepath: req.file.path,

      mimetype: req.file.mimetype,

      size: req.file.size,

      status: "uploaded",

    });

    res.status(200).json({
      success: true,
      message: "File uploaded successfully",
      upload,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

module.exports = {
  uploadFile,
};