const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const geminiRoutes = require("./routes/geminiRoutes");
const itineraryRoutes = require("./routes/itineraryRoutes");
const errorHandler = require("./middleware/errorHandler");
const requestLogger = require("./middleware/requestLogger");

const app = express();

app.use(cors());
app.use(express.json());
app.use(requestLogger);


// Static Upload Folder
app.use("/uploads", express.static("uploads"));
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/gemini", geminiRoutes);
app.use("/api/itinerary", itineraryRoutes);


app.get("/", (req, res) => {
  res.send("API is running...");
});


// Routes
app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);

app.use(errorHandler);

module.exports = app;
