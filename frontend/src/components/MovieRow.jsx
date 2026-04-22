import { useRef } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import MovieCard from './MovieCard';
import LoadingSkeleton from './LoadingSkeleton';

const MovieRow = ({ title, movies, loading }) => {
  const rowRef = useRef(null);

  const scroll = (direction) => {
    if (rowRef.current) {
      const scrollAmount = direction === 'left' ? -400 : 400;
      rowRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="mb-8 md:mb-12">

      {/* Title */}
      <div className="flex items-center justify-between mb-3 md:mb-4 px-4 md:px-8">
        <h2 className="text-white text-lg md:text-2xl font-bold">
          <span className="text-primary">|</span> {title}
        </h2>
      </div>

      {/* Row */}
      <div className="relative group">

        {/* Left Arrow - Desktop Only */}
        <button
          onClick={() => scroll('left')}
          className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/80 hover:bg-black text-white p-2 rounded-r-lg opacity-0 group-hover:opacity-100 transition-opacity items-center justify-center"
        >
          <FiChevronLeft size={28} />
        </button>

        {/* Movies */}
        <div
          ref={rowRef}
          className="movie-row flex space-x-2 md:space-x-4 px-4 md:px-8 pb-4"
        >
          {loading ? (
            Array(8).fill(0).map((_, i) => (
              <div key={i} className="flex-none w-28 sm:w-36 md:w-44">
                <LoadingSkeleton type="card" />
              </div>
            ))
          ) : (
            movies?.map(movie => (
              <div key={movie.id} className="flex-none w-28 sm:w-36 md:w-44">
                <MovieCard movie={movie} />
              </div>
            ))
          )}
        </div>

        {/* Right Arrow - Desktop Only */}
        <button
          onClick={() => scroll('right')}
          className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/80 hover:bg-black text-white p-2 rounded-l-lg opacity-0 group-hover:opacity-100 transition-opacity items-center justify-center"
        >
          <FiChevronRight size={28} />
        </button>
      </div>
    </div>
  );
};

export default MovieRow;