const mongoose = require("mongoose");

const uploadSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    filename: {
      type: String,
      required: true,
    },

    filepath: {
      type: String,
      required: true,
    },

    mimetype: {
      type: String,
      required: true,
    },

    size: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      default: "uploaded",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Upload", uploadSchema);