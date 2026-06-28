import { Link, useLocation } from 'react-router-dom';

export default function NavBar() {
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Projects', path: '/projects' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="text-xl font-display font-bold text-gray-800 tracking-tight">
          A<span className="text-google-blue">K</span>.
        </Link>
        <nav className="flex items-center gap-6">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path || (link.path !== '/' && location.pathname.startsWith(link.path));
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`font-medium transition-colors ${
                  isActive ? 'text-google-blue' : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
