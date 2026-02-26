// ===============================
// IMPORTS
// ===============================
const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const Drama = require("./models/Drama");

// ===============================
// APP SETUP
// ===============================
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend
app.use(express.static("public"));

// ===============================
// DATABASE CONNECTION
// ===============================
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => console.error("❌ MongoDB Connection Failed:", err));

// ===============================
// SEED SAMPLE DATA (RUNS ONCE)
// ===============================
mongoose.connection.once("open", async () => {
  const count = await Drama.countDocuments();

  if (count === 0) {
    await Drama.insertMany([
      {
        title: "Moonlight Lovers",
        genre: "Romance • Historical",
        year: 2019,
        rating: 8.9,
        image: "https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?q=80&w=800",
        description: "A historical romance drama set in ancient times."
      },
      {
        title: "City of Secrets",
        genre: "Thriller • Crime",
        year: 2021,
        rating: 9.2,
        image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=800",
        description: "A crime thriller full of mystery and suspense."
      },
      {
        title: "Hidden Truth",
        genre: "Mystery • Drama",
        year: 2020,
        rating: 8.5,
        image: "https://images.unsplash.com/photo-1542204165-65bf26472b9b?q=80&w=800",
        description: "A drama uncovering hidden family secrets."
      },
      {
        title: "Eternal Promise",
        genre: "Fantasy • Romance",
        year: 2022,
        rating: 9.0,
        image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=800",
        description: "A fantasy love story across dimensions."
      }
    ]);

    console.log("🌱 Sample dramas inserted");
  }
});

// ===============================
// API ROUTE
// ===============================
app.get("/api/dramas", async (req, res) => {
  try {
    const dramas = await Drama.find();
    res.json(dramas);
  } catch (error) {
    res.status(500).json({ message: "Error fetching dramas" });
  }
});

// ===============================
// SERVER START
// ===============================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});