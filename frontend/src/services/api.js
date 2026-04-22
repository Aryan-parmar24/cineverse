import axios from 'axios';

const API_KEY = 'b7d3b6691682ea71af5daee3b2bdd562';
const BASE_URL = 'https://api.themoviedb.org/3';

export const IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';
export const BACKDROP_BASE = 'https://image.tmdb.org/t/p/original';
export const PROFILE_BASE = 'https://image.tmdb.org/t/p/w185';

const tmdb = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
    language: 'en-US',
  },
});

// ==================== MOVIES ====================

export const getTrending = () =>
  tmdb.get('/trending/all/week');

export const getPopularMovies = () =>
  tmdb.get('/movie/popular');

export const getTopRated = () =>
  tmdb.get('/movie/top_rated');

export const getNowPlaying = () =>
  tmdb.get('/movie/now_playing');

export const getUpcoming = () =>
  tmdb.get('/movie/upcoming');

export const getMovieDetails = (id) =>
  tmdb.get(`/movie/${id}`, {
    params: { append_to_response: 'videos,credits,similar,watch/providers' }
  });

export const getMoviesByGenre = (genreId, page = 1) =>
  tmdb.get('/discover/movie', {
    params: { with_genres: genreId, page }
  });

export const getBollywoodMovies = () =>
  tmdb.get('/discover/movie', {
    params: { with_original_language: 'hi', sort_by: 'popularity.desc' }
  });

// ==================== TV SERIES ====================

export const getPopularSeries = () =>
  tmdb.get('/tv/popular');

export const getTopRatedSeries = () =>
  tmdb.get('/tv/top_rated');

export const getAiringToday = () =>
  tmdb.get('/tv/airing_today');

export const getTVDetails = (id) =>
  tmdb.get(`/tv/${id}`, {
    params: { append_to_response: 'videos,credits,similar,watch/providers' }
  });

export const getTVSeasonDetails = (id, season) =>
  tmdb.get(`/tv/${id}/season/${season}`);

// ==================== SEARCH ====================

export const searchMulti = (query, page = 1) =>
  tmdb.get('/search/multi', {
    params: { query, page }
  });

export const searchMovies = (query) =>
  tmdb.get('/search/movie', { params: { query } });

export const searchTV = (query) =>
  tmdb.get('/search/tv', { params: { query } });

// ==================== GENRES ====================

export const getMovieGenres = () =>
  tmdb.get('/genre/movie/list');

export const getTVGenres = () =>
  tmdb.get('/genre/tv/list');

// ==================== PERSON ====================

export const getPersonDetails = (id) =>
  tmdb.get(`/person/${id}`, {
    params: { append_to_response: 'movie_credits,tv_credits' }
  });


export const getIMDBId = (tmdbId, type = 'movie') =>
  tmdb.get(`/${type}/${tmdbId}/external_ids`);

export const getYouTubeSearch = async (query) => {
  try {
    const res = await fetch(
      `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}&sp=EgIQAQ%3D%3D`
    );
    return res.url;
  } catch (err) {
    return null;
  }
};

export default tmdb;