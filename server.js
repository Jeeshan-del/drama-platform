// ========================================
// IMPORTS
// ========================================
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const Drama = require("./models/Drama");
const User = require("./models/User");

// ========================================
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

// ========================================
// DATABASE CONNECTION
// ========================================
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ DB Error:", err));

// ========================================
// SEED SAMPLE DRAMAS
// ========================================
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
        description: "Historical romance drama."
      }
    ]);
    console.log("🌱 Sample dramas inserted");
  }
});

// ========================================
// AUTH ROUTES
// ========================================

// SIGNUP
app.post("/api/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashedPassword
    });

    res.json({ message: "User registered successfully" });

  } catch (error) {
    res.status(500).json({ message: "Signup failed" });
  }
});

// LOGIN
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "User not found" });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token });

  } catch (error) {
    res.status(500).json({ message: "Login failed" });
  }
});

// ========================================
// DRAMA ROUTES
// ========================================

app.get("/api/dramas", async (req, res) => {
  try {
    const search = req.query.search;

    if (search) {
      const dramas = await Drama.find({
        title: { $regex: search, $options: "i" }
      });
      return res.json(dramas);
    }

    const dramas = await Drama.find();
    res.json(dramas);

  } catch {
    res.status(500).json({ message: "Error fetching dramas" });
  }
});

app.get("/api/dramas/:id", async (req, res) => {
  try {
    const drama = await Drama.findById(req.params.id);
    res.json(drama);
  } catch {
    res.status(500).json({ message: "Error fetching drama" });
  }
});

// ========================================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});