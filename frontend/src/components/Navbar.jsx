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
      {/* ===== TOP NAVBAR ===== */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-dark shadow-lg'
          : 'bg-gradient-to-b from-black/80 to-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-14 md:h-16">

            {/* Logo */}
            <Link to="/" className="flex-shrink-0">
              <span className="text-primary font-bold text-2xl md:text-3xl tracking-wider">
                CINE<span className="text-white">VERSE</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map(link => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    isActive(link.path)
                      ? 'text-primary border-b-2 border-primary pb-1'
                      : 'text-gray-300'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            {/* Right Side */}
            <div className="flex items-center space-x-2">

              {/* Search Bar */}
              {searchOpen ? (
                <form
                  onSubmit={handleSearch}
                  className="flex items-center"
                >
                  <input
                    autoFocus
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search..."
                    className="bg-black/90 border border-gray-600 text-white px-3 py-2 rounded-l-lg text-sm w-40 md:w-64 focus:outline-none focus:border-primary"
                  />
                  <button
                    type="submit"
                    className="bg-primary px-3 py-2 rounded-r-lg hover:bg-red-700"
                  >
                    <FiSearch size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setSearchOpen(false)}
                    className="ml-2 text-gray-400 hover:text-white p-1"
                  >
                    <FiX size={20} />
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setSearchOpen(true)}
                  className="text-gray-300 hover:text-white p-2 rounded-lg"
                >
                  <FiSearch size={22} />
                </button>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden text-gray-300 hover:text-white p-2 rounded-lg"
              >
                {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Dropdown Menu */}
          {menuOpen && (
            <div className="md:hidden bg-dark/95 backdrop-blur-sm border-t border-gray-800 py-2 rounded-b-xl">
              {navLinks.map(link => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 transition-colors ${
                    isActive(link.path)
                      ? 'text-primary bg-primary/10'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  {link.icon}
                  <span className="font-medium">{link.name}</span>
                </Link>
              ))}

              {/* Search in menu */}
              <form
                onSubmit={handleSearch}
                className="px-4 py-3 border-t border-gray-800"
              >
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search movies, series..."
                    className="flex-1 bg-gray-800 border border-gray-700 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-primary"
                  />
                  <button
                    type="submit"
                    className="bg-primary text-white px-3 py-2 rounded-lg"
                  >
                    <FiSearch size={16} />
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </nav>

      {/* ===== BOTTOM TAB BAR (Mobile Only) ===== */}
      <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-dark/95 backdrop-blur-sm border-t border-gray-800 safe-bottom">
        <div className="flex items-center justify-around py-2">
          {navLinks.map(link => (
            <Link
              key={link.name}
              to={link.path}
              className={`flex flex-col items-center space-y-1 px-4 py-2 rounded-xl transition-all ${
                isActive(link.path)
                  ? 'text-primary'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {link.icon}
              <span className="text-xs font-medium">{link.name}</span>
              {isActive(link.path) && (
                <span className="w-1 h-1 bg-primary rounded-full" />
              )}
            </Link>
          ))}
          <button
            onClick={() => setSearchOpen(true)}
            className={`flex flex-col items-center space-y-1 px-4 py-2 rounded-xl transition-all ${
              searchOpen ? 'text-primary' : 'text-gray-500'
            }`}
          >
            <FiSearch size={20} />
            <span className="text-xs font-medium">Search</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Navbar;