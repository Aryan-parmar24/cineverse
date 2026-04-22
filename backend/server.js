const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const watchlistRoutes = require('./routes/watchlist');
const streamRoutes = require('./routes/stream');

const app = express();

// ✅ Production CORS
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://cineverse-app.vercel.app',
    /\.vercel\.app$/,
    /\.netlify\.app$/,
  ],
  credentials: true
}));

app.use(express.json());

// Routes
app.use('/api/watchlist', watchlistRoutes);
app.use('/api/stream', streamRoutes);

// Health Check
app.get('/', (req, res) => {
  res.json({
    status: '✅ CineVerse API Running',
    version: '1.0.0',
    time: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// MongoDB (optional)
if (process.env.MONGO_URI) {
  mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB Connected'))
    .catch(err => console.log('⚠️ MongoDB:', err.message));
}