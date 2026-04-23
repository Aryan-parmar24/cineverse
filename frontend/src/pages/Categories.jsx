import { useState, useEffect } from 'react';
import { getMovieGenres, getMoviesByGenre } from '../services/api';
import MovieCard from '../components/MovieCard';

const GENRE_EMOJIS = {
    28: '💥', 12: '🌍', 16: '🎨', 35: '😂', 80: '🔫',
    99: '📽', 18: '🎭', 10751: '👨‍👩‍👧', 14: '🧙', 36: '📜',
    27: '👻', 10402: '🎵', 9648: '🔍', 10749: '❤️', 878: '🚀',
    10770: '📺', 53: '😱', 10752: '⚔️', 37: '🤠'
};

const Categories = () => {
    const [genres, setGenres] = useState([]);
    const [selectedGenre, setSelectedGenre] = useState(null);
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getMovieGenres().then(res => {
            setGenres(res.data.genres);
            setSelectedGenre(res.data.genres[0]);
        });
    }, []);

    useEffect(() => {
        if (selectedGenre) {
            setLoading(true);
            getMoviesByGenre(selectedGenre.id)
                .then(res => setMovies(res.data.results))
                .catch(console.error)
                .finally(() => setLoading(false));
        }
    }, [selectedGenre]);

    return (
        <div className="min-h-screen pt-14 sm:pt-16 md:pt-24 px-3 sm:px-4 md:px-8 max-w-7xl mx-auto pb-20 md:pb-10">
            <h1 className="text-3xl font-bold mb-8">
                <span className="text-primary">|</span> Browse by Category
            </h1>

            {/* Genre Buttons */}
            <div className="flex flex-wrap gap-3 mb-10">
                {genres.map(genre => (
                    <button
                        key={genre.id}
                        onClick={() => setSelectedGenre(genre)}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedGenre?.id === genre.id
                            ? 'bg-primary text-white shadow-lg shadow-primary/30 scale-105'
                            : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
                            }`}
                    >
                        <span>{GENRE_EMOJIS[genre.id] || '🎬'}</span>
                        <span>{genre.name}</span>
                    </button>
                ))}
            </div>

            {/* Movies Grid */}
            {selectedGenre && (
                <div>
                    <h2 className="text-xl font-bold mb-6 text-gray-300">
                        {GENRE_EMOJIS[selectedGenre.id]} {selectedGenre.name} Movies
                    </h2>
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                            {movies.map(movie => (
                                <MovieCard key={movie.id} movie={movie} />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Categories;