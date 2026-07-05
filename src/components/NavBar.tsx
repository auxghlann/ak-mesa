import { Link, useLocation } from 'react-router-dom';

export default function NavBar() {
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Projects', path: '/projects' },
  ];

  return (
    <nav className="bg-surface/80 backdrop-blur-md sticky top-0 z-50 border-b border-outline-variant/30">
      <div className="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop py-4 max-w-container-max mx-auto">
        <Link to="/" className="font-headline-md text-headline-md font-extrabold text-on-surface">
          AK<span className="text-primary">.</span>
        </Link>
        <div className="flex gap-gutter items-center">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path || (link.path !== '/' && location.pathname.startsWith(link.path));
            return (
              <Link
                key={link.name}
                to={link.path}
                className={
                  isActive 
                    ? 'text-primary font-bold border-b-2 border-primary pb-1 font-label-lg text-label-lg' 
                    : 'text-on-surface-variant hover:text-primary transition-colors duration-200 font-label-lg text-label-lg'
                }
              >
                {link.name}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
