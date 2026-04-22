const express = require('express');
const Watchlist = require('../models/Watchlist');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    let list = await Watchlist.findOne({ user: req.userId });
    if (!list) list = { movies: [] };
    res.json(list.movies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/add', auth, async (req, res) => {
  try {
    let list = await Watchlist.findOne({ user: req.userId });
    if (!list) list = await Watchlist.create({ user: req.userId, movies: [] });

    const exists = list.movies.find(m => m.movieId === req.body.movieId);
    if (!exists) {
      list.movies.push(req.body);
      await list.save();
    }
    res.json({ message: 'Added to watchlist' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/remove/:movieId', auth, async (req, res) => {
  try {
    const list = await Watchlist.findOne({ user: req.userId });
    if (list) {
      list.movies = list.movies.filter(m => m.movieId !== parseInt(req.params.movieId));
      await list.save();
    }
    res.json({ message: 'Removed from watchlist' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;