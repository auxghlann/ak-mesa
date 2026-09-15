'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAdminHotkey } from '../hooks/useAdminHotkey';
import { personalInfo } from '@/data/resumeData';

export default function Sidebar() {
  const pathname = usePathname();
  useAdminHotkey();

  const navLinks = [
    { name: 'Home', path: '/', icon: 'home' },
    { name: 'Projects', path: '/projects', icon: 'folder' },
  ];

  return (
    <>
      {/* Desktop Left Sidebar */}
      <aside className="hidden md:flex flex-col justify-between bg-surface/80 backdrop-blur-md sticky top-0 h-screen w-55 shrink-0 border-r border-outline-variant/30 px-4 py-5 z-40 transition-all">
        <div className="flex flex-col gap-4">
          {/* Brand Header */}
          <Link href="/" className="inline-flex items-center gap-2 px-2 py-1 group" aria-label="Khester Mesa - Home">
            <span className="font-mono text-lg font-bold tracking-tight text-on-surface group-hover:text-primary transition-colors">
              ~/allan
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1 w-full">
            {navLinks.map((link) => {
              const isActive = pathname === link.path || (link.path !== '/' && pathname.startsWith(link.path));
              return (
                <Link
                  key={link.name}
                  href={link.path}
                  className={`flex items-center gap-2 px-2 py-2 rounded-xl transition-all duration-200 font-mono text-xs ${
                    isActive
                      ? 'text-on-surface font-bold'
                      : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
                  }`}
                  aria-label={link.name}
                >
                  <span
                    className={`material-symbols-rounded text-[16px] text-on-surface shrink-0 transition-opacity duration-200 ${
                      isActive ? 'opacity-100' : 'opacity-0'
                    }`}
                    aria-hidden="true"
                  >
                    chevron_right
                  </span>
                  <span className={`material-symbols-rounded text-[19px] ${isActive ? 'text-on-surface' : ''}`}>
                    {link.icon}
                  </span>
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Contact Info at Bottom */}
        <div className="pt-3 border-t border-outline-variant/30 flex flex-col gap-1.5">
          <p className="px-2 text-[11px] leading-relaxed text-on-surface-variant font-sans">
            For work opportunities, collabs &amp; projects, reach me at
          </p>
          <a
            href={`mailto:${personalInfo.email}`}
            className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors group"
            title={personalInfo.email}
          >
            <span className="material-symbols-rounded text-[#141414] text-[18px] shrink-0 group-hover:scale-110 transition-transform">
              mail
            </span>
            <span className="font-mono text-[11px] tracking-tight whitespace-nowrap">
              {personalInfo.email}
            </span>
          </a>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 w-full bg-surface/90 backdrop-blur-md border-t border-outline-variant/30 z-50 px-4 py-2 pb-safe-bottom">
        <div className="flex justify-around items-center max-w-sm mx-auto">
          {navLinks.map((link) => {
            const isActive = pathname === link.path || (link.path !== '/' && pathname.startsWith(link.path));
            return (
              <Link
                key={link.name}
                href={link.path}
                className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-200 min-w-[64px] ${
                  isActive ? 'text-primary font-bold' : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <div
                  className={`flex items-center justify-center w-10 h-6 rounded-full mb-0.5 transition-colors ${
                    isActive ? 'bg-primary-container/20 text-primary' : 'bg-transparent'
                  }`}
                >
                  <span className="material-symbols-rounded text-[20px]">{link.icon}</span>
                </div>
                <span className="font-mono text-[11px] font-medium">{link.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
