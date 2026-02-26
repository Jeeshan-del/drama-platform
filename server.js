// ===============================
// IMPORTS
// ===============================
const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

// ===============================
// APP SETUP
// ===============================
const app = express();

// ===============================
// MIDDLEWARE
// ===============================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Serve static files from public folder
app.use(express.static("public"));

// ===============================
// DATABASE CONNECTION
// ===============================
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected Successfully");
  })
  .catch((error) => {
    console.error("❌ MongoDB Connection Failed:", error.message);
  });

// ===============================
// API ROUTES
// ===============================

// Test API route
app.get("/api/test", (req, res) => {
  res.json({ message: "API is working correctly 🚀" });
});

// ===============================
// SERVER START
// ===============================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});