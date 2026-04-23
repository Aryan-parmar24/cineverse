import { useState, useEffect } from 'react';
import HeroSection from '../components/HeroSection';
import MovieRow from '../components/MovieRow';
import {
    getTrending,
    getPopularMovies,
    getTopRated,
    getNowPlaying,
    getPopularSeries,
    getUpcoming,
    getBollywoodMovies
} from '../services/api';

const Home = () => {
    const [trending, setTrending] = useState([]);
    const [popular, setPopular] = useState([]);
    const [topRated, setTopRated] = useState([]);
    const [nowPlaying, setNowPlaying] = useState([]);
    const [series, setSeries] = useState([]);
    const [upcoming, setUpcoming] = useState([]);
    const [bollywood, setBollywood] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAll = async () => {
            try {
                setLoading(true);
                const [
                    trendingRes,
                    popularRes,
                    topRatedRes,
                    nowPlayingRes,
                    seriesRes,
                    upcomingRes,
                    bollywoodRes
                ] = await Promise.all([
                    getTrending(),
                    getPopularMovies(),
                    getTopRated(),
                    getNowPlaying(),
                    getPopularSeries(),
                    getUpcoming(),
                    getBollywoodMovies()
                ]);

                setTrending(trendingRes.data.results);
                setPopular(popularRes.data.results);
                setTopRated(topRatedRes.data.results);
                setNowPlaying(nowPlayingRes.data.results);
                setSeries(seriesRes.data.results);
                setUpcoming(upcomingRes.data.results);
                setBollywood(bollywoodRes.data.results);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAll();
    }, []);

    return (
        <div className="pb-20 md:pb-0">
            <HeroSection movies={trending} />
            <div className="relative z-10 -mt-8 md:-mt-16 pb-10">
                <MovieRow title="🔥 Trending Now" movies={trending} loading={loading} />
                <MovieRow title="🎬 Now Playing" movies={nowPlaying} loading={loading} />
                <MovieRow title="⭐ Popular Movies" movies={popular} loading={loading} />
                <MovieRow title="🏆 Top Rated" movies={topRated} loading={loading} />
                <MovieRow title="📺 Popular Series" movies={series} loading={loading} />
                <MovieRow title="🎭 Coming Soon" movies={upcoming} loading={loading} />
                <MovieRow title="🇮🇳 Bollywood" movies={bollywood} loading={loading} />
            </div>
        </div>
    );
};

export default Home;