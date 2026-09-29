import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import '../index.css';
import Sidebar from '@/components/Sidebar';
import Chatbot from '@/components/Chatbot';
import { personalInfo } from '@/data/resumeData';
import { ThemeProvider } from '@/context/ThemeContext';

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
  title: `${personalInfo.name} | Portfolio`,
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
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');var d=document.documentElement;if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches)){d.classList.add('dark');}else{d.classList.remove('dark');}}catch(e){}})();`,
          }}
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
      </head>
      <body className="min-h-screen flex flex-col md:flex-row relative font-sans bg-surface text-on-surface antialiased transition-colors duration-200">
        <ThemeProvider>
          <Sidebar />
          <div className="flex flex-col flex-grow w-full pb-20 md:pb-0 min-w-0">
            <main className="flex-grow max-w-container-max mx-auto w-full px-margin-mobile md:px-margin-desktop relative">
              {children}
            </main>
          </div>
          <Chatbot />
        </ThemeProvider>
      </body>
    </html>
  );
}
