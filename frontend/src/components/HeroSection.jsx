import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPlay, FiInfo, FiStar } from 'react-icons/fi';
import { BACKDROP_BASE } from '../services/api';

const HeroSection = ({ movies }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!movies || movies.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % Math.min(movies.length, 5));
    }, 6000);
    return () => clearInterval(interval);
  }, [movies]);

  if (!movies || movies.length === 0) {
    return (
      <div className="h-[55vh] sm:h-[65vh] md:h-[80vh] lg:h-screen bg-dark flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const movie = movies[currentIndex];
  const isMovie = !movie.first_air_date;
  const path = isMovie ? `/movie/${movie.id}` : `/tv/${movie.id}`;
  const title = movie.title || movie.name;

  return (
    <div className="relative w-full h-[55vh] sm:h-[65vh] md:h-[80vh] lg:h-screen overflow-hidden">

      {/* Background */}
      <img
        src={`${BACKDROP_BASE}${movie.backdrop_path}`}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ objectPosition: 'center 20%' }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/45" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-24 sm:h-32 bg-gradient-to-t from-dark to-transparent" />

      {/* Content */}
      <div className="absolute inset-0 flex items-end">
        <div className="w-full px-4 sm:px-6 md:px-10 lg:px-14 pb-6 sm:pb-10 md:pb-16">
          <div className="max-w-[90%] sm:max-w-md md:max-w-xl">

            {/* Badge */}
            <div className="flex items-center space-x-2 mb-2">
              <span className="bg-primary text-white text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full">
                #{currentIndex + 1} TRENDING
              </span>
              <span className="text-gray-300 text-[10px] sm:text-xs">
                {isMovie ? '🎬 Movie' : '📺 TV Series'}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-xl sm:text-3xl md:text-5xl font-black text-white leading-tight mb-2">
              {title}
            </h1>

            {/* Meta */}
            <div className="flex items-center space-x-2 mb-2 text-[11px] sm:text-sm text-gray-300">
              <span className="flex items-center space-x-1 text-yellow-400">
                <FiStar fill="currentColor" size={10} />
                <span className="text-white font-bold">
                  {movie.vote_average?.toFixed(1)}
                </span>
              </span>
              <span className="text-gray-500">•</span>
              <span>
                {(movie.release_date || movie.first_air_date || '').slice(0, 4)}
              </span>
            </div>

            {/* Description */}
            <p className="text-gray-300 text-[11px] sm:text-sm mb-4 line-clamp-2 sm:line-clamp-3 leading-relaxed max-w-[95%] sm:max-w-lg">
              {movie.overview}
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <Link
                to={path}
                className="flex items-center space-x-1 bg-white text-black px-3 sm:px-5 py-2 sm:py-2.5 rounded-md sm:rounded-lg font-bold text-[11px] sm:text-sm active:scale-95 transition-transform"
              >
                <FiPlay size={13} fill="black" />
                <span>Watch Now</span>
              </Link>

              <Link
                to={path}
                className="flex items-center space-x-1 bg-gray-500/40 text-white px-3 sm:px-5 py-2 sm:py-2.5 rounded-md sm:rounded-lg font-bold text-[11px] sm:text-sm active:scale-95 transition-transform"
              >
                <FiInfo size={13} />
                <span>More Info</span>
              </Link>
            </div>

            {/* Dots */}
            <div className="flex items-center space-x-1 mt-3 sm:mt-5 md:mt-6">
              {movies.slice(0, 5).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`rounded-full transition-all duration-300 ${i === currentIndex
                      ? 'bg-primary w-4 h-1'
                      : 'bg-gray-600 w-1 h-1'
                    }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;