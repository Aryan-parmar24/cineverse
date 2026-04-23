import { useState, useEffect } from 'react';
import { getPopularSeries, getTopRatedSeries, getAiringToday } from '../services/api';
import MovieRow from '../components/MovieRow';
import MovieCard from '../components/MovieCard';

const TVSeries = () => {
    const [popular, setPopular] = useState([]);
    const [topRated, setTopRated] = useState([]);
    const [airing, setAiring] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [popRes, topRes, airRes] = await Promise.all([
                    getPopularSeries(),
                    getTopRatedSeries(),
                    getAiringToday()
                ]);
                setPopular(popRes.data.results);
                setTopRated(topRes.data.results);
                setAiring(airRes.data.results);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, []);

    return (
        <div className="min-h-screen pt-14 sm:pt-16 md:pt-24 pb-20 md:pb-10">
            <div className="max-w-7xl mx-auto px-4 mb-10">
                <h1 className="text-3xl font-bold">
                    <span className="text-primary">|</span> TV Series
                </h1>
            </div>

            {/* Featured */}
            {airing.length > 0 && (
                <div className="relative h-96 mb-12">
                    <img
                        src={`https://image.tmdb.org/t/p/original${airing[0]?.backdrop_path}`}
                        className="w-full h-full object-cover"
                        alt={airing[0]?.name}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-dark to-transparent" />
                    <div className="absolute inset-0 flex items-center px-8">
                        <div>
                            <span className="text-primary text-sm font-bold bg-primary/20 px-3 py-1 rounded-full">
                                📺 AIRING TODAY
                            </span>
                            <h2 className="text-4xl font-black mt-3 mb-2">{airing[0]?.name}</h2>
                            <p className="text-gray-300 max-w-lg line-clamp-2">{airing[0]?.overview}</p>
                        </div>
                    </div>
                </div>
            )}

            <MovieRow title="📺 Popular Series" movies={popular} loading={loading} />
            <MovieRow title="⭐ Airing Today" movies={airing} loading={loading} />
            <MovieRow title="🏆 Top Rated Series" movies={topRated} loading={loading} />
        </div>
    );
};

export default TVSeries;