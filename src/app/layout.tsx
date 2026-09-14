import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import '../index.css';
import NavBar from '@/components/NavBar';
import Chatbot from '@/components/Chatbot';
import Link from 'next/link';
import { personalInfo } from '@/data/resumeData';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: `${personalInfo.name} | Developer Portfolio`,
  description: personalInfo.headline,
  icons: {
    icon: '/favicon-portfolio.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
      </head>
      <body className="min-h-screen flex flex-col relative font-sans bg-surface text-on-surface antialiased">
        <NavBar />
        <main className="flex-grow max-w-container-max mx-auto w-full px-margin-mobile md:px-margin-desktop relative">
          {children}
        </main>
        <footer className="bg-surface-container-lowest border-t border-outline-variant w-full py-8 mt-12">
          <div className="flex flex-col md:flex-row justify-between items-center px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto gap-base">
            <Link href="/" className="flex items-center" aria-label="Allan Khester Mesa - Home">
              <img src="/logo.png" alt="Allan Khester Mesa" className="h-8 w-auto object-contain" />
            </Link>
            <span className="font-body-md text-body-md text-on-surface-variant md:text-left">
              © {new Date().getFullYear()} sleepdeprivedtable.
            </span>
            <div className="flex gap-4">
              <a
                className="text-on-surface-variant hover:text-primary transition-colors font-label-sm text-label-sm"
                href={`https://${personalInfo?.github || 'github.com'}`}
                target="_blank"
                rel="noreferrer"
              >
                GitHub
              </a>
              <a
                className="text-on-surface-variant hover:text-primary transition-colors font-label-sm text-label-sm"
                href={`https://${personalInfo?.linkedin || 'linkedin.com'}`}
                target="_blank"
                rel="noreferrer"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </footer>
        <Chatbot />
      </body>
    </html>
  );
}
