'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAdminHotkey } from '../hooks/useAdminHotkey';
import { personalInfo } from '@/data/resumeData';
import { useTheme } from '@/context/ThemeContext';

export default function Sidebar() {
  const pathname = usePathname();
  const { theme, resolvedTheme, setTheme, toggleTheme, mounted } = useTheme();
  useAdminHotkey();

  const [activeSection, setActiveSection] = useState<string>('home');

  useEffect(() => {
    if (pathname !== '/') return;

    const sectionIds = ['home', 'projects', 'experience', 'education', 'certifications', 'skills'];
    const handleScroll = () => {
      const scrollY = window.scrollY + 250;
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const id = sectionIds[i];
        const el = document.getElementById(id);
        if (el && scrollY >= el.offsetTop) {
          setActiveSection(id);
          return;
        }
      }
      setActiveSection('home');
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  const [isHomeExpanded, setIsHomeExpanded] = useState<boolean>(true);

  const primaryLinks = [
    { name: '~', path: '/', icon: 'home' },
    { name: 'Projects', path: '/projects', icon: 'folder' },
  ];

  const homeSections = [
    { name: '01-projects', id: 'projects', icon: 'code' },
    { name: '02-experience', id: 'experience', icon: 'work' },
    { name: '03-education', id: 'education', icon: 'school' },
    { name: '04-certs', id: 'certifications', icon: 'workspace_premium' },
    { name: '05-skills', id: 'skills', icon: 'bolt' },
  ];

  return (
    <>
      {/* Desktop Left Sidebar */}
      <aside className="hidden md:flex flex-col justify-between bg-surface/80 backdrop-blur-md sticky top-0 h-screen w-56 shrink-0 border-r border-outline-variant px-4 py-5 z-40 transition-all">
        <div className="flex flex-col gap-6">
          {/* Brand Header */}
          <Link href="/" className="inline-flex items-center px-1 py-0.5 group" aria-label="Khester Mesa - Home">
            <span className="font-mono text-lg font-bold tracking-tight text-on-surface group-hover:text-primary transition-colors">
              khester/
            </span>
          </Link>

          {/* File Explorer Tree Navigation */}
          <nav className="flex flex-col w-full font-mono text-xs select-none">
            {/* Root Node: ~ (Home directory) */}
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 py-1 px-1 rounded-lg hover:bg-surface-container-highest transition-colors group">
                {/* Chevron Toggle */}
                <button
                  type="button"
                  onClick={() => setIsHomeExpanded(!isHomeExpanded)}
                  className="w-4 h-4 flex items-center justify-center text-on-surface-variant hover:text-on-surface cursor-pointer shrink-0"
                  aria-label={isHomeExpanded ? 'Collapse home tree' : 'Expand home tree'}
                >
                  <span
                    className={`material-symbols-rounded text-[18px] transition-transform duration-150 ${isHomeExpanded ? 'rotate-90' : ''
                      }`}
                  >
                    chevron_right
                  </span>
                </button>

                {/* Home link */}
                <Link
                  href="/"
                  onClick={(e) => {
                    if (pathname === '/') {
                      e.preventDefault();
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                    if (!isHomeExpanded) setIsHomeExpanded(true);
                  }}
                  className={`flex items-center gap-2 flex-grow transition-colors ${pathname === '/' && activeSection === 'home'
                    ? 'text-on-surface font-semibold'
                    : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                >
                  <span className="material-symbols-rounded text-[19px] shrink-0 text-on-surface">home</span>
                  <span className="text-sm">~</span>
                </Link>
              </div>

              {/* Indented Children of ~ with tab margin and icons */}
              {isHomeExpanded && (
                <div className="flex flex-col pl-7 ml-2 py-1 gap-1">
                  {homeSections.map((section) => {
                    const isSectionActive = pathname === '/' && activeSection === section.id;
                    return (
                      <Link
                        key={section.id}
                        href={`/#${section.id}`}
                        onClick={(e) => {
                          if (pathname === '/') {
                            e.preventDefault();
                            document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth' });
                          }
                        }}
                        className={`flex items-center gap-2 py-1 px-1.5 rounded-lg transition-colors text-xs ${isSectionActive
                          ? 'text-on-surface font-semibold bg-surface-container-highest'
                          : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest'
                          }`}
                      >
                        <span className={`material-symbols-rounded text-[17px] shrink-0 ${isSectionActive ? 'text-on-surface' : 'text-on-surface-variant'}`}>
                          {section.icon}
                        </span>
                        <span>{section.name}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Root Node: Projects */}
            <div>
              <Link
                href="/projects"
                className={`flex items-center gap-2 py-1 px-1 rounded-lg transition-colors group ${pathname.startsWith('/projects')
                  ? 'text-on-surface font-semibold bg-surface-container-highest'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest'
                  }`}
              >
                {/* Spacer to align folder icon with home icon */}
                <span className="w-4 shrink-0" aria-hidden="true" />
                <span className="material-symbols-rounded text-[19px] shrink-0">folder</span>
                <span className="text-sm">Projects</span>
              </Link>
            </div>
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
                suppressHydrationWarning
                className={`flex items-center justify-center py-1 rounded-lg transition-all cursor-pointer ${mounted && theme === 'light'
                  ? 'bg-surface text-on-surface shadow-xs font-semibold'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest'
                  }`}
              >
                <span className="material-symbols-rounded text-[17px]">light_mode</span>
              </button>
              <button
                type="button"
                onClick={() => setTheme('dark')}
                title="Dark mode"
                aria-label="Dark mode"
                suppressHydrationWarning
                className={`flex items-center justify-center py-1 rounded-lg transition-all cursor-pointer ${mounted && theme === 'dark'
                  ? 'bg-surface text-on-surface shadow-xs font-semibold'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest'
                  }`}
              >
                <span className="material-symbols-rounded text-[17px]">dark_mode</span>
              </button>
              <button
                type="button"
                onClick={() => setTheme('system')}
                title="System preference"
                aria-label="System theme"
                suppressHydrationWarning
                className={`flex items-center justify-center py-1 rounded-lg transition-all cursor-pointer ${mounted && theme === 'system'
                  ? 'bg-surface text-on-surface shadow-xs font-semibold'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest'
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
              className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-on-surface-variant hover:text-primary hover:bg-surface-container-highest transition-colors group"
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
          {primaryLinks.map((link) => {
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
            suppressHydrationWarning
            className="flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-200 min-w-[64px] text-on-surface-variant hover:text-on-surface cursor-pointer"
            aria-label={`Switch theme (currently ${mounted ? resolvedTheme : 'system'})`}
          >
            <div className="flex items-center justify-center w-10 h-6 rounded-full mb-0.5 transition-colors bg-transparent">
              <span className="material-symbols-rounded text-[20px]" suppressHydrationWarning>
                {mounted && resolvedTheme === 'dark' ? 'light_mode' : 'dark_mode'}
              </span>
            </div>
            <span className="font-mono text-[11px] font-medium capitalize" suppressHydrationWarning>
              {mounted ? (resolvedTheme === 'dark' ? 'Light' : 'Dark') : 'Theme'}
            </span>
          </button>
        </div>
      </nav>
    </>
  );
}
