'use client';

import { useState } from 'react';
import type { Certification } from '@/data/resumeData';
import IssuerIcon from './IssuerIcon';

export default function CertificationsSection({ certifications }: { certifications: Certification[] }) {
  const [showAll, setShowAll] = useState(false);

  // Pinned credentials always have higher precedence than date
  const sortedCerts = [...certifications].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return (b.date || '').localeCompare(a.date || '');
  });

  const pinnedCerts = sortedCerts.filter((cert) => cert.pinned);
  const displayedCerts = showAll ? sortedCerts : pinnedCerts;

  return (
    <section id="certifications" className="scroll-mt-24 pt-16 border-t border-outline-variant">
      <div className="flex items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-2xl bg-surface-container-high border border-outline-variant flex items-center justify-center text-on-surface shadow-xs">
            <span className="material-symbols-rounded text-[22px]">workspace_premium</span>
          </div>
          <div>
            <h2 className="font-headline-lg text-headline-lg">certifications</h2>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowAll(!showAll)}
          className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono text-on-surface-variant hover:text-on-surface bg-surface-container-low hover:bg-surface-container border border-outline-variant transition-colors cursor-pointer"
        >
          <span className="material-symbols-rounded text-[16px]">
            {showAll ? 'expand_less' : 'expand_more'}
          </span>
          <span>{showAll ? 'Show highlights only' : `Show all (${certifications.length})`}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {displayedCerts.map((cert) => {
          const CardContent = (
            <div className="h-full flex flex-col justify-between bg-surface-container-lowest border border-outline-variant hover:border-outline rounded-[24px] p-6 shadow-xs hover:shadow-sm transition-all duration-200 group">
              <div>
                {/* Issuer Header Row with Icon & Verification Link */}
                <div className="flex items-center justify-between gap-3 mb-3.5">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <IssuerIcon issuer={cert.issuer} iconPath={cert.issuerIcon} />
                    <span className="font-mono text-xs text-on-surface-variant truncate">
                      {cert.issuer}
                    </span>
                  </div>
                  {cert.link && (
                    <span className="material-symbols-rounded text-outline-variant group-hover:text-primary transition-colors text-[18px] shrink-0">
                      open_in_new
                    </span>
                  )}
                </div>

                <h3 className="font-headline-md text-[17px] leading-snug text-on-surface group-hover:text-primary transition-colors">
                  {cert.name}
                </h3>
              </div>
              <div className="mt-4 pt-3 border-t border-outline-variant/40 flex items-center justify-between text-xs font-mono text-on-surface-variant">
                <span>{cert.date || 'Verified'}</span>
              </div>
            </div>
          );

          return (
            <div key={cert.id}>
              {cert.link ? (
                <a
                  href={cert.link}
                  target="_blank"
                  rel="noreferrer"
                  className="block h-full outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-[24px]"
                >
                  {CardContent}
                </a>
              ) : (
                CardContent
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 sm:hidden">
        <button
          type="button"
          onClick={() => setShowAll(!showAll)}
          className="w-full inline-flex justify-center items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-mono text-on-surface-variant hover:text-on-surface bg-surface-container-low hover:bg-surface-container border border-outline-variant transition-colors cursor-pointer"
        >
          <span className="material-symbols-rounded text-[16px]">
            {showAll ? 'expand_less' : 'expand_more'}
          </span>
          <span>{showAll ? 'Show highlights only' : `Show all (${certifications.length})`}</span>
        </button>
      </div>
    </section>
  );
}
