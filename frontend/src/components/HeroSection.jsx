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
      <div className="h-screen bg-dark flex items-center justify-center">
        <div className="skeleton w-full h-full" />
      </div>
    );
  }

  const movie = movies[currentIndex];
  const isMovie = !movie.first_air_date;
  const path = isMovie ? `/movie/${movie.id}` : `/tv/${movie.id}`;
  const title = movie.title || movie.name;

  return (
    <div className="relative h-[70vh] md:h-screen overflow-hidden">

      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={`${BACKDROP_BASE}${movie.backdrop_path}`}
          alt={title}
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* Gradients */}
      <div className="absolute inset-0 hero-gradient" />
      <div className="absolute bottom-0 left-0 right-0 h-48 hero-bottom-gradient" />
      <div className="absolute inset-0 bg-black/30 md:bg-transparent" />

      {/* Content */}
      <div className="absolute inset-0 flex items-end md:items-center pb-16 md:pb-0">
        <div className="max-w-7xl mx-auto px-4 md:px-12 w-full">
          <div className="max-w-xl">

            {/* Badge */}
            <div className="flex items-center space-x-3 mb-3">
              <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">
                #{currentIndex + 1} TRENDING
              </span>
              <span className="text-gray-300 text-xs">
                {isMovie ? '🎬 Movie' : '📺 TV Series'}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-6xl font-black text-white mb-3 leading-tight">
              {title}
            </h1>

            {/* Meta */}
            <div className="flex items-center space-x-3 mb-3 text-sm text-gray-300">
              <span className="flex items-center space-x-1 text-yellow-400">
                <FiStar fill="currentColor" size={14} />
                <span className="text-white font-bold">
                  {movie.vote_average?.toFixed(1)}
                </span>
              </span>
              <span>•</span>
              <span>
                {(movie.release_date || movie.first_air_date || '').slice(0, 4)}
              </span>
            </div>

            {/* Description - Hidden on small mobile */}
            <p className="text-gray-300 text-sm md:text-base mb-6 line-clamp-2 md:line-clamp-3 leading-relaxed hidden sm:block">
              {movie.overview}
            </p>

            {/* Buttons */}
            <div className="flex items-center space-x-3">
              <Link
                to={path}
                className="flex items-center space-x-2 bg-white text-black px-5 md:px-8 py-2.5 md:py-3 rounded-lg font-bold text-sm md:text-lg hover:bg-gray-200 transition-colors"
              >
                <FiPlay size={18} fill="black" />
                <span>Watch Now</span>
              </Link>
              <Link
                to={path}
                className="flex items-center space-x-2 bg-gray-600/70 text-white px-5 md:px-8 py-2.5 md:py-3 rounded-lg font-bold text-sm md:text-lg hover:bg-gray-600 transition-colors"
              >
                <FiInfo size={18} />
                <span>More Info</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 md:bottom-32 left-1/2 -translate-x-1/2 flex space-x-2">
        {movies.slice(0, 5).map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`transition-all duration-300 rounded-full ${
              i === currentIndex
                ? 'bg-primary w-6 h-2'
                : 'bg-gray-600 w-2 h-2'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSection;