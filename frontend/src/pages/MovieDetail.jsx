import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiPlay, FiPlus, FiCheck, FiStar, FiClock, FiArrowLeft } from 'react-icons/fi';
import { getMovieDetails, BACKDROP_BASE, IMAGE_BASE, PROFILE_BASE } from '../services/api';
import { useWatchlist } from '../context/WatchlistContext';
import WhereToWatch from '../components/WhereToWatch';
import MovieCard from '../components/MovieCard';
import LoadingSkeleton from '../components/LoadingSkeleton';
import VideoPlayer from '../components/VideoPlayer';

const MovieDetail = () => {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showTrailer, setShowTrailer] = useState(false);
    const [showPlayer, setShowPlayer] = useState(false);
    const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();

    useEffect(() => {
        const fetchMovie = async () => {
            try {
                setLoading(true);
                window.scrollTo(0, 0);
                const res = await getMovieDetails(id);
                setMovie(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchMovie();
    }, [id]);

    if (loading) return <LoadingSkeleton type="detail" />;
    if (!movie) return (
        <div className="pt-20 text-center text-white">Movie not found</div>
    );

    const trailer = movie.videos?.results?.find(
        v => v.type === 'Trailer' && v.site === 'YouTube'
    );
    const inList = isInWatchlist(movie.id);
    const hours = Math.floor(movie.runtime / 60);
    const mins = movie.runtime % 60;

    return (
        <div className="min-h-screen pb-16 md:pb-0">

            {/* ====== VIDEO PLAYER COMPONENT ====== */}
            {showPlayer && (
                <VideoPlayer
                    id={id}
                    title={movie.title}
                    type="movie"
                    onClose={() => setShowPlayer(false)}
                />
            )}

            {/* Backdrop */}
            <div className="relative h-screen">
                <img
                    src={`${BACKDROP_BASE}${movie.backdrop_path}`}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-dark via-dark/80 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-dark via-transparent to-black/30" />

                {/* Back Button */}
                <Link
                    to="/"
                    className="absolute top-24 left-6 flex items-center space-x-2 text-gray-300 hover:text-white transition-colors z-10"
                >
                    <FiArrowLeft size={20} />
                    <span>Back</span>
                </Link>

                {/* Content */}
                <div className="absolute inset-0 flex items-center pt-16">
                    <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 md:grid-cols-3 gap-8 items-center">

                        {/* Poster */}
                        <div className="hidden md:block">
                            <img
                                src={`${IMAGE_BASE}${movie.poster_path}`}
                                alt={movie.title}
                                className="w-64 rounded-2xl shadow-2xl mx-auto border-2 border-gray-700"
                            />
                        </div>

                        {/* Info */}
                        <div className="md:col-span-2">
                            <div className="flex flex-wrap gap-2 mb-4">
                                {movie.genres?.map(g => (
                                    <span
                                        key={g.id}
                                        className="bg-primary/20 border border-primary/50 text-primary px-3 py-1 rounded-full text-xs font-medium"
                                    >
                                        {g.name}
                                    </span>
                                ))}
                            </div>

                            <h1 className="text-4xl md:text-6xl font-black text-white mb-2">
                                {movie.title}
                            </h1>

                            {movie.tagline && (
                                <p className="text-gray-400 italic text-lg mb-4">
                                    "{movie.tagline}"
                                </p>
                            )}

                            <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-gray-300">
                                <span className="flex items-center space-x-1 text-yellow-400">
                                    <FiStar fill="currentColor" size={16} />
                                    <span className="text-white font-bold text-lg">
                                        {movie.vote_average?.toFixed(1)}
                                    </span>
                                    <span className="text-gray-400 text-sm">
                                        ({movie.vote_count?.toLocaleString()} votes)
                                    </span>
                                </span>
                                <span>•</span>
                                <span>{movie.release_date?.slice(0, 4)}</span>
                                <span>•</span>
                                <span className="flex items-center space-x-1">
                                    <FiClock size={14} />
                                    <span>{hours}h {mins}m</span>
                                </span>
                                {movie.adult && (
                                    <span className="bg-red-800 px-2 py-0.5 rounded text-xs font-bold">
                                        18+
                                    </span>
                                )}
                            </div>

                            <p className="text-gray-300 text-base md:text-lg leading-relaxed mb-8 max-w-2xl">
                                {movie.overview}
                            </p>

                            {/* Action Buttons */}
                            <div className="flex flex-wrap gap-4">

                                {/* Watch Now */}
                                <button
                                    onClick={() => setShowPlayer(true)}
                                    className="flex items-center space-x-2 bg-primary text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-red-700 transition-colors shadow-lg shadow-primary/30"
                                >
                                    <FiPlay size={22} fill="white" />
                                    <span>Watch Now</span>
                                </button>

                                {/* Trailer */}
                                {trailer && (
                                    <button
                                        onClick={() => setShowTrailer(true)}
                                        className="flex items-center space-x-2 bg-white text-black px-6 py-3 rounded-lg font-bold hover:bg-gray-200 transition-colors"
                                    >
                                        <FiPlay size={20} fill="black" />
                                        <span>Trailer</span>
                                    </button>
                                )}

                                {/* Watchlist */}
                                <button
                                    onClick={() =>
                                        inList
                                            ? removeFromWatchlist(movie.id)
                                            : addToWatchlist(movie)
                                    }
                                    className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-bold border transition-colors ${
                                        inList
                                            ? 'bg-green-600 border-green-600 text-white'
                                            : 'border-white text-white hover:bg-white hover:text-black'
                                    }`}
                                >
                                    {inList ? <FiCheck size={20} /> : <FiPlus size={20} />}
                                    <span>{inList ? 'In Watchlist' : 'Add to Watchlist'}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Details Section */}
            <div className="max-w-7xl mx-auto px-6 py-12">

                {/* Where to Watch */}
                <WhereToWatch providers={movie['watch/providers']} />

                {/* Cast */}
                {movie.credits?.cast?.length > 0 && (
                    <div className="mt-10">
                        <h2 className="text-2xl font-bold mb-6">
                            <span className="text-primary">|</span> Cast
                        </h2>
                        <div
                            className="flex space-x-4 overflow-x-auto pb-4"
                            style={{ scrollbarWidth: 'none' }}
                        >
                            {movie.credits.cast.slice(0, 15).map(person => (
                                <div key={person.id} className="flex-none w-28 text-center">
                                    <div className="w-20 h-20 mx-auto rounded-full overflow-hidden bg-gray-800 mb-2">
                                        {person.profile_path ? (
                                            <img
                                                src={`${PROFILE_BASE}${person.profile_path}`}
                                                alt={person.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-2xl">
                                                👤
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-white text-xs font-semibold">{person.name}</p>
                                    <p className="text-gray-500 text-xs">{person.character}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Movie Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
                    <div className="bg-gray-900 rounded-xl p-6">
                        <h3 className="text-lg font-bold mb-4">Movie Info</h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-400">Status</span>
                                <span className="text-green-400">{movie.status}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Language</span>
                                <span>{movie.original_language?.toUpperCase()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Budget</span>
                                <span>
                                    {movie.budget > 0
                                        ? `$${(movie.budget / 1e6).toFixed(1)}M`
                                        : 'N/A'}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Revenue</span>
                                <span>
                                    {movie.revenue > 0
                                        ? `$${(movie.revenue / 1e6).toFixed(1)}M`
                                        : 'N/A'}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Runtime</span>
                                <span>{hours}h {mins}m</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-900 rounded-xl p-6">
                        <h3 className="text-lg font-bold mb-4">Production</h3>
                        <div className="space-y-2">
                            {movie.production_companies?.slice(0, 4).map(company => (
                                <div key={company.id} className="flex items-center space-x-3">
                                    <span className="text-gray-400 text-sm">🏢</span>
                                    <span className="text-sm">{company.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Similar Movies */}
                {movie.similar?.results?.length > 0 && (
                    <div className="mt-12">
                        <h2 className="text-2xl font-bold mb-6">
                            <span className="text-primary">|</span> Similar Movies
                        </h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {movie.similar.results.slice(0, 12).map(m => (
                                <MovieCard key={m.id} movie={m} />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* ====== TRAILER MODAL ====== */}
            {showTrailer && trailer && (
                <div
                    className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
                    onClick={() => setShowTrailer(false)}
                >
                    <div
                        className="w-full max-w-4xl"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-white font-bold text-xl">
                                {movie.title} - Official Trailer
                            </h3>
                            <button
                                onClick={() => setShowTrailer(false)}
                                className="text-gray-400 hover:text-white text-3xl"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="aspect-video">
                            <iframe
                                src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1`}
                                className="w-full h-full rounded-xl"
                                allowFullScreen
                                allow="autoplay"
                                title="Trailer"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MovieDetail;