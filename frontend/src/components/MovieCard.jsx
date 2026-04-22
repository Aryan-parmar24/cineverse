import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiCheck, FiStar, FiPlay } from 'react-icons/fi';
import { IMAGE_BASE } from '../services/api';
import { useWatchlist } from '../context/WatchlistContext';

const MovieCard = ({ movie }) => {
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();
  const navigate = useNavigate();

  const isMovie = movie.media_type !== 'tv' && !movie.first_air_date;
  const path = isMovie ? `/movie/${movie.id}` : `/tv/${movie.id}`;
  const title = movie.title || movie.name;
  const year = (movie.release_date || movie.first_air_date || '').slice(0, 4);
  const rating = movie.vote_average?.toFixed(1);
  const inList = isInWatchlist(movie.id);

  const handleWatchlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (inList) {
      removeFromWatchlist(movie.id);
    } else {
      addToWatchlist(movie);
    }
  };

  const handleClick = () => {
    navigate(path);
  };

  return (
    <div
      className="relative cursor-pointer rounded-lg overflow-hidden bg-card"
      style={{
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        transform: isHovered ? 'scale(1.08)' : 'scale(1)',
        boxShadow: isHovered ? '0 20px 40px rgba(0,0,0,0.8)' : 'none',
        zIndex: isHovered ? 20 : 1,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      {/* Poster Image */}
      <div className="relative aspect-[2/3] overflow-hidden">
        {!imageError && movie.poster_path ? (
          <img
            src={`${IMAGE_BASE}${movie.poster_path}`}
            alt={title}
            className="w-full h-full object-cover"
            style={{
              transition: 'transform 0.5s ease',
              transform: isHovered ? 'scale(1.1)' : 'scale(1)',
            }}
            onError={() => setImageError(true)}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gray-800 flex items-center justify-center">
            <span className="text-gray-500 text-4xl">🎬</span>
          </div>
        )}

        {/* Overlay - Only shows on THIS card hover */}
        {isHovered && (
          <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center space-y-3 animate-fadeIn">
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(path);
              }}
              className="flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-red-700 transition-colors"
            >
              <FiPlay size={16} fill="white" />
              <span>View Details</span>
            </button>
            <button
              onClick={handleWatchlist}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                inList
                  ? 'bg-green-600 border-green-600 text-white'
                  : 'border-white text-white hover:bg-white hover:text-black'
              }`}
            >
              {inList ? <FiCheck size={16} /> : <FiPlus size={16} />}
              <span>{inList ? 'In Watchlist' : 'Watchlist'}</span>
            </button>
          </div>
        )}

        {/* Rating Badge */}
        {rating && (
          <div className="absolute top-2 left-2 bg-black/80 text-yellow-400 px-2 py-1 rounded text-xs flex items-center space-x-1">
            <FiStar size={10} fill="currentColor" />
            <span>{rating}</span>
          </div>
        )}

        {/* Type Badge */}
        <div className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-bold ${
          isMovie ? 'bg-primary' : 'bg-blue-600'
        }`}>
          {isMovie ? 'MOVIE' : 'TV'}
        </div>
      </div>

      {/* Card Info */}
      <div className="p-3">
        <h3 className="text-white text-sm font-semibold truncate">{title}</h3>
        <div className="flex items-center justify-between mt-1">
          <span className="text-gray-400 text-xs">{year}</span>
          <div className="flex items-center space-x-1 text-yellow-400 text-xs">
            <FiStar size={10} fill="currentColor" />
            <span>{rating || 'N/A'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;