import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WatchlistProvider } from './context/WatchlistContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import MovieDetail from './pages/MovieDetail';
import TVDetail from './pages/TVDetail';
import Search from './pages/Search';
import Categories from './pages/Categories';
import TVSeries from './pages/TVSeries';
import Watchlist from './pages/Watchlist';

function App() {
  return (
    <WatchlistProvider>
      <Router>
        <div className="min-h-screen bg-dark text-white">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/movie/:id" element={<MovieDetail />} />
            <Route path="/tv/:id" element={<TVDetail />} />
            <Route path="/search" element={<Search />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/series" element={<TVSeries />} />
            <Route path="/watchlist" element={<Watchlist />} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </WatchlistProvider>
  );
}

export default App;