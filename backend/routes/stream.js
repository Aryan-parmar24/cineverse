const express = require('express');
const fetch = require('node-fetch');
const router = express.Router();

// Get movie streams - Multiple sources
router.get('/movie/:tmdbId', async (req, res) => {
  try {
    const { tmdbId } = req.params;
    console.log('Fetching movie streams for TMDB ID:', tmdbId);

    const results = {
      tmdbId,
      embedLinks: [],
      directLinks: []
    };

    // Source 1 - VidSrc
    results.embedLinks.push({
      provider: 'VidSrc',
      url: `https://vidsrc.cc/v2/embed/movie/${tmdbId}`,
      quality: 'HD'
    });

    // Source 2 - SuperEmbed  
    results.embedLinks.push({
      provider: 'SuperEmbed',
      url: `https://multiembed.mov/directstream.php?video_id=${tmdbId}&tmdb=1`,
      quality: 'HD'
    });

    // Source 3 - SmashyStream
    results.embedLinks.push({
      provider: 'SmashyStream',
      url: `https://player.smashy.stream/movie/${tmdbId}`,
      quality: 'HD'
    });

    // Source 4 - NontonGo
    results.embedLinks.push({
      provider: 'NontonGo',
      url: `https://www.NontonGo.net/embed/movie/${tmdbId}`,
      quality: 'HD'
    });

    // Source 5 - 111movies
    results.embedLinks.push({
      provider: '111Movies',
      url: `https://111movies.com/movie/${tmdbId}`,
      quality: 'HD'
    });

    res.json(results);

  } catch (err) {
    console.error('Stream error:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get TV streams
router.get('/tv/:tmdbId/:season/:episode', async (req, res) => {
  try {
    const { tmdbId, season, episode } = req.params;
    console.log('Fetching TV streams:', tmdbId, season, episode);

    const results = {
      tmdbId,
      season,
      episode,
      embedLinks: [],
    };

    // Source 1 - VidSrc
    results.embedLinks.push({
      provider: 'VidSrc',
      url: `https://vidsrc.cc/v2/embed/tv/${tmdbId}?season=${season}&episode=${episode}`,
      quality: 'HD'
    });

    // Source 2 - SuperEmbed
    results.embedLinks.push({
      provider: 'SuperEmbed',
      url: `https://multiembed.mov/directstream.php?video_id=${tmdbId}&tmdb=1&s=${season}&e=${episode}`,
      quality: 'HD'
    });

    // Source 3 - SmashyStream
    results.embedLinks.push({
      provider: 'SmashyStream',
      url: `https://player.smashy.stream/tv/${tmdbId}?s=${season}&e=${episode}`,
      quality: 'HD'
    });

    // Source 4
    results.embedLinks.push({
      provider: 'EmbedSu',
      url: `https://embed.su/embed/tv/${tmdbId}/${season}/${episode}`,
      quality: 'HD'
    });

    res.json(results);

  } catch (err) {
    console.error('Stream error:', err);
    res.status(500).json({ error: err.message });
  }
});

//https://cineverse-backend-q8ud.onrender.com
module.exports = router;