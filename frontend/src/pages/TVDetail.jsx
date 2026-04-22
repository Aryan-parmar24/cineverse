import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiPlay, FiPlus, FiCheck, FiStar, FiArrowLeft, FiSkipForward } from 'react-icons/fi';
import { getTVDetails, BACKDROP_BASE, IMAGE_BASE, PROFILE_BASE } from '../services/api';
import { useWatchlist } from '../context/WatchlistContext';
import WhereToWatch from '../components/WhereToWatch';
import MovieCard from '../components/MovieCard';
import VideoPlayer from '../components/VideoPlayer';

const TVDetail = () => {
    const { id } = useParams();
    const [show, setShow] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showTrailer, setShowTrailer] = useState(false);
    const [showPlayer, setShowPlayer] = useState(false);
    const [selectedSeason, setSelectedSeason] = useState(1);
    const [selectedEpisode, setSelectedEpisode] = useState(1);
    const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();

    // Fetch show data
    useEffect(() => {
        const fetchShow = async () => {
            setLoading(true);
            window.scrollTo(0, 0);
            try {
                const res = await getTVDetails(id);
                setShow(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchShow();
    }, [id]);

    if (loading) return (
        <div className="flex justify-center items-center h-screen">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
    );

    if (!show) return (
        <div className="pt-24 text-center text-white">Show not found</div>
    );

    const trailer = show.videos?.results?.find(
        v => v.type === 'Trailer' && v.site === 'YouTube'
    );
    const inList = isInWatchlist(show.id);
    const currentSeasonData = show.seasons?.find(
        s => s.season_number === selectedSeason
    );
    const totalEpisodes = currentSeasonData?.episode_count || 10;

    const handleNextEpisode = () => {
        if (selectedEpisode < totalEpisodes) {
            setSelectedEpisode(prev => prev + 1);
        } else {
            const nextSeason = show.seasons?.find(
                s => s.season_number === selectedSeason + 1
            );
            if (nextSeason) {
                setSelectedSeason(prev => prev + 1);
                setSelectedEpisode(1);
            }
        }
    };

    return (
        <div className="min-h-screen pb-16 md:pb-0">

            {/* ====== VIDEO PLAYER - Using VideoPlayer Component ====== */}
            {showPlayer && (
                <VideoPlayer
                    id={id}
                    title={show.name}
                    type="tv"
                    season={selectedSeason}
                    episode={selectedEpisode}
                    onClose={() => setShowPlayer(false)}
                />
            )}

            {/* Backdrop */}
            <div className="relative h-screen">
                <img
                    src={`${BACKDROP_BASE}${show.backdrop_path}`}
                    alt={show.name}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-dark via-dark/80 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-dark via-transparent to-black/30" />

                {/* Back Button */}
                <Link
                    to="/"
                    className="absolute top-24 left-6 flex items-center space-x-2 text-gray-300 hover:text-white z-10"
                >
                    <FiArrowLeft size={20} />
                    <span>Back</span>
                </Link>

                {/* Content */}
                <div className="absolute inset-0 flex items-center pt-16">
                    <div className="max-w-7xl mx-auto px-6 w-full grid md:grid-cols-3 gap-8 items-center">

                        {/* Poster */}
                        <div className="hidden md:block">
                            <img
                                src={`${IMAGE_BASE}${show.poster_path}`}
                                alt={show.name}
                                className="w-64 rounded-2xl shadow-2xl mx-auto border-2 border-gray-700"
                            />
                        </div>

                        {/* Info */}
                        <div className="md:col-span-2">
                            <div className="flex flex-wrap gap-2 mb-4">
                                {show.genres?.map(g => (
                                    <span
                                        key={g.id}
                                        className="bg-blue-600/30 border border-blue-500/50 text-blue-400 px-3 py-1 rounded-full text-xs"
                                    >
                                        {g.name}
                                    </span>
                                ))}
                            </div>

                            <h1 className="text-4xl md:text-6xl font-black text-white mb-2">
                                {show.name}
                            </h1>

                            <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-300">
                                <span className="flex items-center space-x-1 text-yellow-400">
                                    <FiStar fill="currentColor" size={16} />
                                    <span className="text-white font-bold text-lg">
                                        {show.vote_average?.toFixed(1)}
                                    </span>
                                </span>
                                <span>•</span>
                                <span>{show.first_air_date?.slice(0, 4)}</span>
                                <span>•</span>
                                <span className="text-green-400 font-medium">
                                    {show.number_of_seasons} Seasons
                                </span>
                                <span>•</span>
                                <span>{show.number_of_episodes} Episodes</span>
                            </div>

                            <p className="text-gray-300 text-lg mb-8 line-clamp-3 leading-relaxed">
                                {show.overview}
                            </p>

                            {/* Buttons */}
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
                                            ? removeFromWatchlist(show.id)
                                            : addToWatchlist(show)
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
                <WhereToWatch providers={show['watch/providers']} />

                {/* Episode Selector */}
                {show.seasons && (
                    <div className="mt-10">
                        <h2 className="text-2xl font-bold mb-6">
                            <span className="text-primary">|</span> Episodes
                        </h2>

                        {/* Season Tabs */}
                        <div className="flex flex-wrap gap-3 mb-6">
                            {show.seasons
                                .filter(s => s.season_number > 0)
                                .map(s => (
                                    <button
                                        key={s.id}
                                        onClick={() => {
                                            setSelectedSeason(s.season_number);
                                            setSelectedEpisode(1);
                                        }}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                            selectedSeason === s.season_number
                                                ? 'bg-primary text-white shadow-lg shadow-primary/30'
                                                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                        }`}
                                    >
                                        Season {s.season_number}
                                        <span className="ml-2 text-xs opacity-70">
                                            ({s.episode_count} ep)
                                        </span>
                                    </button>
                                ))}
                        </div>

                        {/* Episode Grid */}
                        <div className="bg-gray-900 rounded-xl p-6">
                            <p className="text-gray-400 text-sm mb-4">
                                Season {selectedSeason} — Click episode to watch:
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {Array.from(
                                    { length: totalEpisodes },
                                    (_, i) => i + 1
                                ).map(ep => (
                                    <button
                                        key={ep}
                                        onClick={() => {
                                            setSelectedEpisode(ep);
                                            setShowPlayer(true);
                                        }}
                                        className={`w-12 h-12 rounded-lg text-sm font-bold transition-all hover:scale-110 ${
                                            selectedEpisode === ep && showPlayer
                                                ? 'bg-primary text-white shadow-lg shadow-primary/30'
                                                : 'bg-gray-800 text-gray-300 hover:bg-primary hover:text-white'
                                        }`}
                                    >
                                        {ep}
                                    </button>
                                ))}
                            </div>

                            {/* Next/Prev Episode */}
                            <div className="flex items-center gap-3 mt-6 pt-4 border-t border-gray-800">
                                {selectedEpisode > 1 && (
                                    <button
                                        onClick={() => setSelectedEpisode(prev => prev - 1)}
                                        className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2"
                                    >
                                        <span>⏮</span>
                                        <span>Prev Episode</span>
                                    </button>
                                )}
                                <button
                                    onClick={() => {
                                        handleNextEpisode();
                                        setShowPlayer(true);
                                    }}
                                    className="bg-primary hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2"
                                >
                                    <span>Next Episode</span>
                                    <FiSkipForward size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Cast */}
                {show.credits?.cast?.length > 0 && (
                    <div className="mt-10">
                        <h2 className="text-2xl font-bold mb-6">
                            <span className="text-primary">|</span> Cast
                        </h2>
                        <div
                            className="flex space-x-4 overflow-x-auto pb-4"
                            style={{ scrollbarWidth: 'none' }}
                        >
                            {show.credits.cast.slice(0, 15).map(p => (
                                <div key={p.id} className="flex-none w-28 text-center">
                                    <div className="w-20 h-20 mx-auto rounded-full overflow-hidden bg-gray-800 mb-2">
                                        {p.profile_path ? (
                                            <img
                                                src={`${PROFILE_BASE}${p.profile_path}`}
                                                alt={p.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-2xl">
                                                👤
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-white text-xs font-semibold">{p.name}</p>
                                    <p className="text-gray-500 text-xs">{p.character}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Show Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
                    <div className="bg-gray-900 rounded-xl p-6">
                        <h3 className="text-lg font-bold mb-4">Show Info</h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-400">Status</span>
                                <span className={
                                    show.status === 'Returning Series'
                                        ? 'text-green-400'
                                        : 'text-yellow-400'
                                }>
                                    {show.status}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Language</span>
                                <span>{show.original_language?.toUpperCase()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">First Air Date</span>
                                <span>{show.first_air_date}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Seasons</span>
                                <span>{show.number_of_seasons}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-400">Episodes</span>
                                <span>{show.number_of_episodes}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-900 rounded-xl p-6">
                        <h3 className="text-lg font-bold mb-4">Networks</h3>
                        <div className="space-y-3">
                            {show.networks?.slice(0, 4).map(network => (
                                <div key={network.id} className="flex items-center space-x-3">
                                    {network.logo_path ? (
                                        <img
                                            src={`https://image.tmdb.org/t/p/w45${network.logo_path}`}
                                            alt={network.name}
                                            className="h-8 object-contain bg-white rounded px-1"
                                        />
                                    ) : (
                                        <span className="text-gray-400">📺</span>
                                    )}
                                    <span className="text-sm">{network.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Similar Shows */}
                {show.similar?.results?.length > 0 && (
                    <div className="mt-12">
                        <h2 className="text-2xl font-bold mb-6">
                            <span className="text-primary">|</span> Similar Shows
                        </h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                            {show.similar.results.slice(0, 12).map(s => (
                                <MovieCard
                                    key={s.id}
                                    movie={{ ...s, media_type: 'tv' }}
                                />
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
                                {show.name} - Official Trailer
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

export default TVDetail;