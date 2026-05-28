const express = require("express");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/authRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const geminiRoutes = require("./routes/geminiRoutes");
const itineraryRoutes = require("./routes/itineraryRoutes");

const errorHandler = require("./middleware/errorHandler");
const requestLogger = require("./middleware/requestLogger");

const app = express();




app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://orbitra-assignment.vercel.app",
    ],
    credentials: true,
  })
);




app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(requestLogger);



app.use(
  "/uploads",
  express.static(
    path.join(__dirname, "uploads")
  )
);


// API ROUTES

app.use("/api/auth", authRoutes);

app.use("/api/upload", uploadRoutes);

app.use(
  "/api/dashboard",
  dashboardRoutes
);

app.use(
  "/api/gemini",
  geminiRoutes
);

app.use(
  "/api/itinerary",
  itineraryRoutes
);



app.get("/", (req, res) => {

  res.status(200).json({
    success: true,
    message:
      "Orbitra AI Travel API Running 🚀",
  });

});


// 404 HANDLER

app.use((req, res) => {

  res.status(404).json({
    success: false,
    message: "Route not found",
  });

});


// GLOBAL ERROR HANDLER

app.use(errorHandler);


module.exports = app;