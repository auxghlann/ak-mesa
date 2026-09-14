'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAdminHotkey } from '../hooks/useAdminHotkey';

export default function NavBar() {
  const pathname = usePathname();
  useAdminHotkey();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Projects', path: '/projects' },
  ];

  return (
    <nav className="bg-surface/80 backdrop-blur-md sticky top-0 z-50 border-b border-outline-variant/30">
      <div className="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop py-4 max-w-container-max mx-auto">
        <Link href="/" className="flex items-center" aria-label="Allan Khester Mesa - Home">
          <img src="/logo.png" alt="Allan Khester Mesa" className="h-9 w-auto object-contain" />
        </Link>
        <div className="flex gap-gutter items-center">
          {navLinks.map((link) => {
            const isActive = pathname === link.path || (link.path !== '/' && pathname.startsWith(link.path));
            return (
              <Link
                key={link.name}
                href={link.path}
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
