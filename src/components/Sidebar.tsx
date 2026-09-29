'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAdminHotkey } from '../hooks/useAdminHotkey';
import { personalInfo } from '@/data/resumeData';
import { useTheme } from '@/context/ThemeContext';

export default function Sidebar() {
  const pathname = usePathname();
  const { theme, resolvedTheme, setTheme, toggleTheme, mounted } = useTheme();
  useAdminHotkey();

  const navLinks = [
    { name: '~', path: '/', icon: 'home' },
    { name: 'Projects', path: '/projects', icon: 'folder' },
  ];

  return (
    <>
      {/* Desktop Left Sidebar */}
      <aside className="hidden md:flex flex-col justify-between bg-surface/80 backdrop-blur-md sticky top-0 h-screen w-55 shrink-0 border-r border-outline-variant px-4 py-5 z-40 transition-all">
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
                  className={`flex items-center gap-2 px-1 py-1 rounded-xl transition-all duration-200 font-mono text-xs ${isActive
                    ? 'text-on-surface font-bold'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
                    }`}
                  aria-label={link.name}
                >
                  <span
                    className={`material-symbols-rounded text-[16px] text-on-surface shrink-0 transition-opacity duration-200 ${isActive ? 'opacity-100' : 'opacity-0'
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

        {/* Contact Info & Theme Toggle at Bottom */}
        <div className="pt-3 border-t border-outline-variant flex flex-col gap-3">
          {/* Theme Selector on top of email */}
          <div className="flex flex-col gap-1.5">
            <span className="px-2 font-mono text-[10px] uppercase tracking-wider text-on-surface-variant">
              Theme
            </span>
            <div className="grid grid-cols-3 gap-1 bg-surface-container-low p-1 rounded-xl border border-outline-variant">
              <button
                type="button"
                onClick={() => setTheme('light')}
                title="Light mode"
                aria-label="Light mode"
                className={`flex items-center justify-center py-1 rounded-lg transition-all cursor-pointer ${mounted && theme === 'light'
                  ? 'bg-surface text-on-surface shadow-xs font-semibold'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container/50'
                  }`}
              >
                <span className="material-symbols-rounded text-[17px]">light_mode</span>
              </button>
              <button
                type="button"
                onClick={() => setTheme('dark')}
                title="Dark mode"
                aria-label="Dark mode"
                className={`flex items-center justify-center py-1 rounded-lg transition-all cursor-pointer ${mounted && theme === 'dark'
                  ? 'bg-surface text-on-surface shadow-xs font-semibold'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container/50'
                  }`}
              >
                <span className="material-symbols-rounded text-[17px]">dark_mode</span>
              </button>
              <button
                type="button"
                onClick={() => setTheme('system')}
                title="System preference"
                aria-label="System theme"
                className={`flex items-center justify-center py-1 rounded-lg transition-all cursor-pointer ${mounted && theme === 'system'
                  ? 'bg-surface text-on-surface shadow-xs font-semibold'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container/50'
                  }`}
              >
                <span className="material-symbols-rounded text-[17px]">desktop_windows</span>
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <p className="px-2 text-[11px] leading-relaxed text-on-surface-variant font-sans">
              For work opportunities, collabs &amp; projects, reach me at
            </p>
            <a
              href={`mailto:${personalInfo.email}`}
              className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container transition-colors group"
              title={personalInfo.email}
            >
              <span className="material-symbols-rounded text-on-surface-variant group-hover:text-primary text-[18px] shrink-0 group-hover:scale-110 transition-transform">
                mail
              </span>
              <span className="font-mono text-[11px] tracking-tight whitespace-nowrap">
                {personalInfo.email}
              </span>
            </a>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 w-full bg-surface/90 backdrop-blur-md border-t border-outline-variant z-50 px-4 py-2 pb-safe-bottom">
        <div className="flex justify-around items-center max-w-sm mx-auto">
          {navLinks.map((link) => {
            const isActive = pathname === link.path || (link.path !== '/' && pathname.startsWith(link.path));
            return (
              <Link
                key={link.name}
                href={link.path}
                className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-200 min-w-[64px] ${isActive ? 'text-on-surface font-bold' : 'text-on-surface-variant hover:text-on-surface'
                  }`}
              >
                <div
                  className={`flex items-center justify-center w-10 h-6 rounded-full mb-0.5 transition-colors ${isActive ? 'bg-surface-container text-on-surface' : 'bg-transparent'
                    }`}
                >
                  <span className="material-symbols-rounded text-[20px]">{link.icon}</span>
                </div>
                <span className="font-mono text-[11px] font-medium">{link.name}</span>
              </Link>
            );
          })}

          <button
            type="button"
            onClick={toggleTheme}
            className="flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-200 min-w-[64px] text-on-surface-variant hover:text-on-surface cursor-pointer"
            aria-label={`Switch theme (currently ${mounted ? resolvedTheme : 'system'})`}
          >
            <div className="flex items-center justify-center w-10 h-6 rounded-full mb-0.5 transition-colors bg-transparent">
              <span className="material-symbols-rounded text-[20px]">
                {mounted && resolvedTheme === 'dark' ? 'light_mode' : 'dark_mode'}
              </span>
            </div>
            <span className="font-mono text-[11px] font-medium capitalize">
              {mounted ? (resolvedTheme === 'dark' ? 'Light' : 'Dark') : 'Theme'}
            </span>
          </button>
        </div>
      </nav>
    </>
  );
}
