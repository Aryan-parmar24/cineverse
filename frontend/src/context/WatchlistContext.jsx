import { createContext, useContext, useState, useEffect } from 'react';

const WatchlistContext = createContext();

export const WatchlistProvider = ({ children }) => {
  const [watchlist, setWatchlist] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('cineverse_watchlist');
    if (saved) setWatchlist(JSON.parse(saved));
  }, []);

  const addToWatchlist = (movie) => {
    const updated = [...watchlist, movie];
    setWatchlist(updated);
    localStorage.setItem('cineverse_watchlist', JSON.stringify(updated));
  };

  const removeFromWatchlist = (id) => {
    const updated = watchlist.filter(m => m.id !== id);
    setWatchlist(updated);
    localStorage.setItem('cineverse_watchlist', JSON.stringify(updated));
  };

  const isInWatchlist = (id) => watchlist.some(m => m.id === id);

  return (
    <WatchlistContext.Provider value={{
      watchlist,
      addToWatchlist,
      removeFromWatchlist,
      isInWatchlist
    }}>
      {children}
    </WatchlistContext.Provider>
  );
};

export const useWatchlist = () => useContext(WatchlistContext);