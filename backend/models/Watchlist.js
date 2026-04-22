const mongoose = require('mongoose');

const watchlistSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  movies: [{
    movieId: Number,
    title: String,
    poster: String,
    rating: Number,
    year: String,
    type: String
  }]
});

module.exports = mongoose.model('Watchlist', watchlistSchema);