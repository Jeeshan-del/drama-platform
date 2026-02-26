const express = require("express");
const router = express.Router();
const Drama = require("../models/Drama");

// GET all dramas
router.get("/", async (req, res) => {
  try {
    const dramas = await Drama.find();
    res.json(dramas);
  } catch (error) {
    res.status(500).json({ message: "Error fetching dramas" });
  }
});

module.exports = router;