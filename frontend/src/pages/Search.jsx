import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiSearch, FiFilter } from 'react-icons/fi';
import { searchMulti, getMovieGenres } from '../services/api';
import MovieCard from '../components/MovieCard';

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [genres, setGenres] = useState([]);
  const [filters, setFilters] = useState({
    type: 'all',
    genre: '',
    year: '',
    minRating: ''
  });

  useEffect(() => {
    getMovieGenres().then(res => setGenres(res.data.genres));
  }, []);

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) {
      setQuery(q);
      performSearch(q);
    }
  }, [searchParams]);

  const performSearch = async (searchQuery) => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    try {
      const res = await searchMulti(searchQuery);
      setResults(res.data.results.filter(r => r.media_type !== 'person'));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchParams({ q: query });
    performSearch(query);
  };

  const filteredResults = results.filter(item => {
    if (filters.type === 'movie' && item.media_type === 'tv') return false;
    if (filters.type === 'tv' && item.media_type === 'movie') return false;
    if (filters.minRating && item.vote_average < parseFloat(filters.minRating)) return false;
    if (filters.year) {
      const itemYear = (item.release_date || item.first_air_date || '').slice(0, 4);
      if (itemYear !== filters.year) return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen pt-16 md:pt-24 px-4 md:px-8 max-w-7xl mx-auto pb-24 md:pb-10">
      
      {/* Search Bar */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-6">
          <span className="text-primary">|</span> Search
        </h1>
        <form onSubmit={handleSearch} className="flex items-center space-x-3">
          <div className="flex-1 relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search for movies, TV shows..."
              className="w-full bg-gray-900 border border-gray-700 text-white pl-12 pr-4 py-4 rounded-xl text-lg focus:outline-none focus:border-primary"
            />
          </div>
          <button
            type="submit"
            className="bg-primary text-white px-8 py-4 rounded-xl font-bold hover:bg-red-700 transition-colors"
          >
            Search
          </button>
        </form>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-8">
        <select
          value={filters.type}
          onChange={e => setFilters({...filters, type: e.target.value})}
          className="bg-gray-900 border border-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-primary"
        >
          <option value="all">All Types</option>
          <option value="movie">Movies Only</option>
          <option value="tv">TV Shows Only</option>
        </select>

        <select
          value={filters.minRating}
          onChange={e => setFilters({...filters, minRating: e.target.value})}
          className="bg-gray-900 border border-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-primary"
        >
          <option value="">Any Rating</option>
          <option value="9">9+ ⭐</option>
          <option value="8">8+ ⭐</option>
          <option value="7">7+ ⭐</option>
          <option value="6">6+ ⭐</option>
        </select>

        <input
          type="number"
          placeholder="Year (e.g. 2024)"
          value={filters.year}
          onChange={e => setFilters({...filters, year: e.target.value})}
          className="bg-gray-900 border border-gray-700 text-white px-4 py-2 rounded-lg w-40 focus:outline-none focus:border-primary"
        />
      </div>

      {/* Results */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredResults.length > 0 ? (
        <>
          <p className="text-gray-400 mb-6">
            Found <span className="text-white font-bold">{filteredResults.length}</span> results for{' '}
            <span className="text-primary">"{searchParams.get('q')}"</span>
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filteredResults.map(item => (
              <MovieCard key={item.id} movie={item} />
            ))}
          </div>
        </>
      ) : searchParams.get('q') ? (
        <div className="text-center py-20">
          <p className="text-6xl mb-4">🔍</p>
          <p className="text-gray-400 text-xl">No results found for "{searchParams.get('q')}"</p>
          <p className="text-gray-600 mt-2">Try different keywords</p>
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-6xl mb-4">🎬</p>
          <p className="text-gray-400 text-xl">Search for your favorite movies or shows</p>
        </div>
      )}
    </div>
  );
};

export default Search;