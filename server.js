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
// JWT MIDDLEWARE
// ========================================
function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
}

// ========================================
// SEED SAMPLE DRAMAS (ONLY IF EMPTY)
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
        description: "A historical romance drama."
      },
      {
        title: "City of Secrets",
        genre: "Thriller • Crime",
        year: 2021,
        rating: 9.2,
        image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=800",
        description: "A crime thriller."
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

    await User.create({
      username,
      email,
      password: hashedPassword
    });

    res.json({ message: "User registered successfully" });

  } catch {
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

    const valid = await bcrypt.compare(password, user.password);
    if (!valid)
      return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token });

  } catch {
    res.status(500).json({ message: "Login failed" });
  }
});

// ========================================
// DRAMA ROUTES
// ========================================

// GET ALL (WITH SEARCH)
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

// GET SINGLE
app.get("/api/dramas/:id", async (req, res) => {
  try {
    const drama = await Drama.findById(req.params.id);
    res.json(drama);
  } catch {
    res.status(500).json({ message: "Error fetching drama" });
  }
});

// ========================================
// WATCHLIST ROUTES
// ========================================

// ADD TO WATCHLIST
app.post("/api/watchlist/:dramaId", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user.watchlist.includes(req.params.dramaId)) {
      user.watchlist.push(req.params.dramaId);
      await user.save();
    }

    res.json({ message: "Added to watchlist" });

  } catch {
    res.status(500).json({ message: "Error adding to watchlist" });
  }
});

// GET WATCHLIST
app.get("/api/watchlist", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate("watchlist");
    res.json(user.watchlist);
  } catch {
    res.status(500).json({ message: "Error fetching watchlist" });
  }
});

// ========================================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});