// Load environment variables FIRST
require('dotenv').config();

console.log("ENV TEST:", process.env.MONGO_URI);

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Create express app
const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// ==============================
// 🔥 Connect To MongoDB Atlas
// ==============================
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ MongoDB Connected Successfully');
    } catch (error) {
        console.error('❌ MongoDB Connection Failed:', error.message);
        process.exit(1);
    }
};

// Call DB connection
connectDB();

// ==============================
// Basic Test Route
// ==============================
app.get('/', (req, res) => {
    res.send('🎬 Drama Platform API Running...');
});

// ==============================
// Server Listen
// ==============================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});