const express = require('express');
const cors = require('cors');
require('dotenv').config();

const streamRoutes = require('./routes/stream');

const app = express();

app.use(cors({
  origin: '*',
  credentials: true,
}));

app.use(express.json());

// Health routes
app.get('/', (req, res) => {
  res.json({
    status: '✅ CineVerse Backend Running',
    message: 'Streaming API is live'
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

// Stream routes
app.use('/api/stream', streamRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
});