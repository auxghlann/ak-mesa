'use client';

import { useId, useLayoutEffect, useRef, useState } from 'react';
import type { Certification } from '@/data/resumeData';
import IssuerIcon from './IssuerIcon';

export default function CertificationsSection({ certifications }: { certifications: Certification[] }) {
  const [showAll, setShowAll] = useState(false);
  const [renderAll, setRenderAll] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const pendingStartHeightRef = useRef<number | null>(null);
  const gridId = useId();

  // Pinned credentials always have higher precedence than date
  const sortedCerts = [...certifications].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return (b.date || '').localeCompare(a.date || '');
  });

  const pinnedCerts = sortedCerts.filter((cert) => cert.pinned);
  const hasExtra = sortedCerts.length > pinnedCerts.length;
  const displayedCerts = renderAll ? sortedCerts : pinnedCerts;

  const handleToggle = () => {
    const nextShowAll = !showAll;
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion || !wrapperRef.current) {
      pendingStartHeightRef.current = null;
      setShowAll(nextShowAll);
      setRenderAll(nextShowAll);
      setIsClosing(false);
      return;
    }

    pendingStartHeightRef.current = wrapperRef.current.getBoundingClientRect().height;
    setShowAll(nextShowAll);
    if (nextShowAll) {
      setIsClosing(false);
      setRenderAll(true);
    } else {
      setIsClosing(true);
    }
  };

  useLayoutEffect(() => {
    const wrapper = wrapperRef.current;
    const startHeight = pendingStartHeightRef.current;
    if (!wrapper || startHeight === null) return;
    pendingStartHeightRef.current = null;

    wrapper.style.transition = 'none';
    let endHeight: number;
    if (showAll) {
      wrapper.style.height = 'auto';
      endHeight = wrapper.getBoundingClientRect().height;
    } else {
      const lastPinned = wrapper.querySelector<HTMLElement>('[data-cert-last-pinned]');
      if (lastPinned) {
        const wrapperRect = wrapper.getBoundingClientRect();
        const lastPinnedRect = lastPinned.getBoundingClientRect();
        const paddingBottom = parseFloat(getComputedStyle(wrapper).paddingBottom) || 0;
        endHeight = lastPinnedRect.bottom - wrapperRect.top + paddingBottom;
      } else {
        endHeight = 0;
      }
    }

    const finish = () => {
      wrapper.style.height = '';
      wrapper.style.overflow = '';
      if (!showAll) {
        setRenderAll(false);
        setIsClosing(false);
      }
    };

    if (Math.abs(endHeight - startHeight) < 0.5) {
      wrapper.style.transition = '';
      finish();
      return;
    }

    wrapper.style.height = `${startHeight}px`;
    wrapper.style.overflow = 'hidden';
    void wrapper.offsetHeight;

    wrapper.style.transition = '';
    wrapper.style.height = `${endHeight}px`;

    let settled = false;
    const settle = () => {
      if (settled) return;
      settled = true;
      wrapper.removeEventListener('transitionend', onTransitionEnd);
      window.clearTimeout(failsafeTimer);
      finish();
    };

    const onTransitionEnd = (event: TransitionEvent) => {
      if (event.target === wrapper && event.propertyName === 'height') {
        settle();
      }
    };

    wrapper.addEventListener('transitionend', onTransitionEnd);
    const failsafeTimer = window.setTimeout(settle, 400);

    return () => {
      settled = true;
      wrapper.removeEventListener('transitionend', onTransitionEnd);
      window.clearTimeout(failsafeTimer);
    };
  }, [showAll]);

  return (
    <section id="certifications" className="scroll-mt-24 pt-16 border-t border-outline-variant">
      <div className="flex items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-2xl bg-surface-container-high border border-outline-variant flex items-center justify-center text-on-surface shadow-xs">
            <span aria-hidden="true" className="material-symbols-rounded text-[22px]">workspace_premium</span>
          </div>
          <div>
            <h2 className="font-headline-lg text-headline-lg">certifications</h2>
          </div>
        </div>

        {hasExtra && (
          <button
            type="button"
            aria-expanded={showAll}
            aria-controls={gridId}
            onClick={handleToggle}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono text-on-surface-variant hover:text-on-surface bg-surface-container-low hover:bg-surface-container border border-outline-variant transition-colors cursor-pointer"
          >
            <span
              aria-hidden="true"
              className={`material-symbols-rounded text-[16px] transition-transform duration-300 ease-out motion-reduce:transition-none ${
                showAll ? 'rotate-180' : ''
              }`}
            >
              expand_more
            </span>
            <span>{showAll ? 'Show highlights only' : `Show all (${certifications.length})`}</span>
          </button>
        )}
      </div>

      <div ref={wrapperRef} id={gridId} className="cert-grid-wrapper -m-1 p-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {displayedCerts.map((cert, index) => {
            const isExtra = !cert.pinned;
            const isLastPinned = index === pinnedCerts.length - 1 && !isExtra;
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
                      <span aria-hidden="true" className="material-symbols-rounded text-outline-variant group-hover:text-primary transition-colors text-[18px] shrink-0">
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
              <div
                key={cert.id}
                data-cert-last-pinned={isLastPinned ? '' : undefined}
                data-closing={isExtra && isClosing ? 'true' : undefined}
                aria-hidden={isExtra && isClosing ? true : undefined}
                inert={isExtra && isClosing ? true : undefined}
                className={isExtra ? 'cert-extra-item' : undefined}
              >
                {cert.link ? (
                  <a
                    href={cert.link}
                    target="_blank"
                    rel="noreferrer"
                    className="block h-full outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-[24px]"
                  >
                    {CardContent}
                    <span className="sr-only"> (opens in new tab)</span>
                  </a>
                ) : (
                  CardContent
                )}
              </div>
            );
          })}
        </div>
      </div>

      {hasExtra && (
        <div className="mt-6 sm:hidden">
          <button
            type="button"
            aria-expanded={showAll}
            aria-controls={gridId}
            onClick={handleToggle}
            className="w-full inline-flex justify-center items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-mono text-on-surface-variant hover:text-on-surface bg-surface-container-low hover:bg-surface-container border border-outline-variant transition-colors cursor-pointer"
          >
            <span
              aria-hidden="true"
              className={`material-symbols-rounded text-[16px] transition-transform duration-300 ease-out motion-reduce:transition-none ${
                showAll ? 'rotate-180' : ''
              }`}
            >
              expand_more
            </span>
            <span>{showAll ? 'Show highlights only' : `Show all (${certifications.length})`}</span>
          </button>
        </div>
      )}
    </section>
  );
}
