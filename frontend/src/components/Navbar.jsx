import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  FiSearch,
  FiMenu,
  FiX,
  FiHome,
  FiFilm,
  FiTv,
  FiBookmark,
  FiArrowLeft
} from 'react-icons/fi';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${searchQuery}`);
      setSearchOpen(false);
      setSearchQuery('');
      setMenuOpen(false);
    }
  };

  const navLinks = [
    { name: 'Home', path: '/', icon: <FiHome size={18} /> },
    { name: 'Movies', path: '/categories', icon: <FiFilm size={18} /> },
    { name: 'Series', path: '/series', icon: <FiTv size={18} /> },
    { name: 'Watchlist', path: '/watchlist', icon: <FiBookmark size={18} /> },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* TOP NAVBAR */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-dark/95 backdrop-blur-md shadow-lg'
            : 'bg-gradient-to-b from-black/90 to-transparent'
        }`}
        style={{ paddingTop: 'env(safe-area-inset-top)' }}
      >
        {/* Search Overlay */}
        {searchOpen && (
          <div className="absolute inset-0 bg-dark z-[60] flex items-center px-3 h-12 md:h-14">
            <button
              type="button"
              onClick={() => setSearchOpen(false)}
              className="text-gray-400 p-2 mr-1 flex-shrink-0"
            >
              <FiArrowLeft size={18} />
            </button>

            <form onSubmit={handleSearch} className="flex items-center flex-1">
              <input
                autoFocus
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search movies, series..."
                className="flex-1 bg-gray-900 border border-gray-700 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-primary"
              />
              <button
                type="submit"
                className="bg-primary text-white px-3 py-2 rounded-lg ml-2 flex-shrink-0"
              >
                <FiSearch size={14} />
              </button>
            </form>
          </div>
        )}

        <div className="px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-between h-12 md:h-14">

            {/* Logo */}
            <Link to="/" className="flex-shrink-0">
              <span className="text-primary font-bold text-lg sm:text-xl md:text-2xl tracking-wider">
                CINE<span className="text-white">VERSE</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-6">
              {navLinks.map(link => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    isActive(link.path) ? 'text-primary' : 'text-gray-300'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Right Side */}
            <div className="flex items-center">
              <button
                onClick={() => setSearchOpen(true)}
                className="text-gray-300 p-2"
              >
                <FiSearch size={18} />
              </button>

              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden text-gray-300 p-2"
              >
                {menuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {menuOpen && (
          <div className="md:hidden bg-dark/98 backdrop-blur-md border-t border-gray-800 shadow-xl">
            {navLinks.map(link => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 text-sm ${
                  isActive(link.path)
                    ? 'text-primary bg-primary/10'
                    : 'text-gray-300 active:bg-gray-800'
                }`}
              >
                {link.icon}
                <span className="font-medium">{link.name}</span>
              </Link>
            ))}
          </div>
        )}
      </nav>

      {/* MOBILE BOTTOM TAB BAR - ONLY 4 ITEMS */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-dark/98 backdrop-blur-md border-t border-gray-800"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="grid grid-cols-4 h-14">
          {navLinks.map(link => (
            <Link
              key={link.name}
              to={link.path}
              className={`flex flex-col items-center justify-center ${
                isActive(link.path)
                  ? 'text-primary'
                  : 'text-gray-500'
              }`}
            >
              <div className={`p-1 rounded-lg ${isActive(link.path) ? 'bg-primary/15' : ''}`}>
                {link.icon}
              </div>
              <span className="text-[10px] font-medium mt-0.5 leading-none">
                {link.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default Navbar;