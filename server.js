const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();

/* ===============================
   CORS FIX (VERY IMPORTANT)
================================= */
app.use(
  cors({
    origin: "*", // allow all origins (safe for development)
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

/* ===============================
   DATABASE CONNECTION
================================= */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch((err) => console.log("❌ DB Error:", err));

/* ===============================
   MODELS
================================= */

// Drama Model
const dramaSchema = new mongoose.Schema({
  title: String,
  genre: String,
  year: Number,
  rating: Number,
  image: String,
  description: String,
});

const Drama = mongoose.model("Drama", dramaSchema);

// User Model
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  watchlist: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Drama",
    },
  ],
});

const User = mongoose.model("User", userSchema);

/* ===============================
   AUTH MIDDLEWARE
================================= */
function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}

/* ===============================
   ROUTES
================================= */

// Test route
app.get("/", (req, res) => {
  res.send("🎬 Drama Platform API Running...");
});

/* ===============================
   DRAMA ROUTES
================================= */

// Get all dramas
app.get("/api/dramas", async (req, res) => {
  try {
    const dramas = await Drama.find();
    res.json(dramas);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get single drama
app.get("/api/dramas/:id", async (req, res) => {
  try {
    const drama = await Drama.findById(req.params.id);
    res.json(drama);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/* ===============================
   AUTH ROUTES
================================= */

// Signup
app.post("/api/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();

    res.json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Login
app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/* ===============================
   WATCHLIST ROUTES
================================= */

// Add to watchlist
app.post("/api/watchlist/:dramaId", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user.watchlist.includes(req.params.dramaId)) {
      user.watchlist.push(req.params.dramaId);
      await user.save();
    }

    res.json({ message: "Added to watchlist" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get watchlist
app.get("/api/watchlist", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("watchlist");
    res.json(user.watchlist);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/* ===============================
   START SERVER
================================= */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});