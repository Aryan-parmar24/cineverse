import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-darkgray border-t border-gray-800 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <h2 className="text-primary font-black text-3xl mb-3">
              CINE<span className="text-white">VERSE</span>
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              Discover and watch movies and TV series from around the world.
            </p>
          </div>

          {/* Navigate */}
          <div>
            <h3 className="text-white font-semibold mb-4">Navigate</h3>
            <ul className="space-y-2">
              {[
                { name: 'Home', path: '/' },
                { name: 'Movies', path: '/categories' },
                { name: 'TV Series', path: '/series' },
                { name: 'Watchlist', path: '/watchlist' },
              ].map(link => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-gray-400 text-sm hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              {['Privacy Policy', 'Terms of Service', 'DMCA'].map(item => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-gray-400 text-sm hover:text-primary transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-500 text-sm">
            © 2024 CineVerse. Movie data provided by{' '}
            <a
              href="https://www.themoviedb.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              TMDB
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;