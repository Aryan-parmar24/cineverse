import { Link } from 'react-router-dom';
import { FiTrash2 } from 'react-icons/fi';
import { useWatchlist } from '../context/WatchlistContext';
import { IMAGE_BASE } from '../services/api';

const Watchlist = () => {
  const { watchlist, removeFromWatchlist } = useWatchlist();

  return (
    <div className="min-h-screen pt-14 sm:pt-16 md:pt-24 px-3 sm:px-4 md:px-8 max-w-7xl mx-auto pb-20 md:pb-10">
      <h1 className="text-3xl font-bold mb-8">
        <span className="text-primary">|</span> My Watchlist
        <span className="ml-3 text-lg text-gray-400">({watchlist.length} items)</span>
      </h1>

      {watchlist.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-6xl mb-4">📋</p>
          <p className="text-gray-400 text-xl mb-4">Your watchlist is empty</p>
          <Link to="/" className="bg-primary text-white px-6 py-3 rounded-lg font-bold hover:bg-red-700">
            Discover Movies
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {watchlist.map(movie => {
            const title = movie.title || movie.name;
            const year = (movie.release_date || movie.first_air_date || '').slice(0, 4);
            const isMovie = !movie.first_air_date;
            const path = isMovie ? `/movie/${movie.id}` : `/tv/${movie.id}`;

            return (
              <div key={movie.id} className="bg-gray-900 rounded-xl flex items-center space-x-4 p-4 hover:bg-gray-800 transition-colors">
                <Link to={path}>
                  <img
                    src={`${IMAGE_BASE}${movie.poster_path}`}
                    alt={title}
                    className="w-16 h-24 object-cover rounded-lg"
                  />
                </Link>
                <div className="flex-1">
                  <Link to={path} className="hover:text-primary transition-colors">
                    <h3 className="font-bold text-lg">{title}</h3>
                  </Link>
                  <p className="text-gray-400 text-sm">{year} • ⭐ {movie.vote_average?.toFixed(1)}</p>
                  <p className="text-gray-500 text-sm line-clamp-2 mt-1">{movie.overview}</p>
                </div>
                <button
                  onClick={() => removeFromWatchlist(movie.id)}
                  className="text-red-500 hover:text-red-400 p-2 rounded-lg hover:bg-red-500/10 transition-colors"
                >
                  <FiTrash2 size={20} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Watchlist;