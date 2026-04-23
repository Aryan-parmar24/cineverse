import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiSearch, FiMenu, FiX, FiHome, FiFilm, FiTv, FiBookmark } from 'react-icons/fi';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    { name: 'Home', path: '/', icon: <FiHome size={20} /> },
    { name: 'Movies', path: '/categories', icon: <FiFilm size={20} /> },
    { name: 'Series', path: '/series', icon: <FiTv size={20} /> },
    { name: 'Watchlist', path: '/watchlist', icon: <FiBookmark size={20} /> },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* TOP NAVBAR */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-dark/95 backdrop-blur-md shadow-lg'
            : 'bg-gradient-to-b from-black/80 to-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex items-center justify-between h-12 sm:h-14 md:h-16">

            {/* Logo */}
            <Link to="/" className="flex-shrink-0" onClick={() => setMenuOpen(false)}>
              <span className="text-primary font-bold text-xl sm:text-2xl md:text-3xl tracking-wider">
                CINE<span className="text-white">VERSE</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
              {navLinks.map(link => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    isActive(link.path)
                      ? 'text-primary'
                      : 'text-gray-300'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Right */}
            <div className="flex items-center space-x-1 sm:space-x-2">

              {searchOpen ? (
                <form onSubmit={handleSearch} className="flex items-center">
                  <input
                    autoFocus
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search..."
                    className="bg-black/90 border border-gray-600 text-white px-3 py-1.5 sm:py-2 rounded-l-lg text-xs sm:text-sm w-32 sm:w-48 md:w-64 focus:outline-none focus:border-primary"
                  />
                  <button
                    type="submit"
                    className="bg-primary px-2 sm:px-3 py-1.5 sm:py-2 rounded-r-lg"
                  >
                    <FiSearch size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setSearchOpen(false)}
                    className="ml-1 sm:ml-2 text-gray-400 p-1"
                  >
                    <FiX size={18} />
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setSearchOpen(true)}
                  className="text-gray-300 hover:text-white p-2"
                >
                  <FiSearch size={20} />
                </button>
              )}

              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden text-gray-300 hover:text-white p-2"
              >
                {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
              </button>
            </div>
          </div>

          {/* Mobile Menu Dropdown */}
          {menuOpen && (
            <div className="md:hidden bg-dark/98 backdrop-blur-md border-t border-gray-800 py-1 rounded-b-xl absolute left-0 right-0 top-12 sm:top-14">
              {navLinks.map(link => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 transition-colors ${
                    isActive(link.path)
                      ? 'text-primary bg-primary/10'
                      : 'text-gray-300 active:bg-gray-800'
                  }`}
                >
                  {link.icon}
                  <span className="font-medium text-sm">{link.name}</span>
                </Link>
              ))}

              <form onSubmit={handleSearch} className="px-4 py-3 border-t border-gray-800">
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search movies..."
                    className="flex-1 bg-gray-800 border border-gray-700 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-primary"
                  />
                  <button type="submit" className="bg-primary text-white px-3 py-2 rounded-lg">
                    <FiSearch size={14} />
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </nav>

      {/* BOTTOM TAB BAR - Mobile */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-dark/98 backdrop-blur-md border-t border-gray-800"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="flex items-center justify-around py-1.5">
          {navLinks.map(link => (
            <Link
              key={link.name}
              to={link.path}
              className={`flex flex-col items-center justify-center w-16 py-1 rounded-xl transition-all ${
                isActive(link.path)
                  ? 'text-primary'
                  : 'text-gray-500 active:text-gray-300'
              }`}
            >
              <div className={`p-1 rounded-lg ${isActive(link.path) ? 'bg-primary/20' : ''}`}>
                {link.icon}
              </div>
              <span className="text-[10px] font-medium mt-0.5">{link.name}</span>
            </Link>
          ))}
          <button
            onClick={() => setSearchOpen(true)}
            className="flex flex-col items-center justify-center w-16 py-1 text-gray-500 active:text-gray-300"
          >
            <div className="p-1">
              <FiSearch size={20} />
            </div>
            <span className="text-[10px] font-medium mt-0.5">Search</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Navbar;