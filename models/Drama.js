const mongoose = require("mongoose");

const dramaSchema = new mongoose.Schema({
  title: String,
  genre: String,
  year: Number,
  rating: Number,
  image: String,
  description: String
});

module.exports = mongoose.model("Drama", dramaSchema);