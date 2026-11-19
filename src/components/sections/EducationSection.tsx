'use client';

import { useId, useState } from 'react';
import type { Education } from '@/data/resumeData';
import { Timeline, TimelineItem } from '@/components/ui/Timeline';

export default function EducationSection({ educations }: { educations: Education[] }) {
  const [showAll, setShowAll] = useState(false);
  const extraListId = useId();

  const pinnedEducations = educations.filter((edu) => edu.pinned);
  const extraEducations = educations.filter((edu) => !edu.pinned);
  const hasExtra = extraEducations.length > 0;

  return (
    <section id="education" className="scroll-mt-24 pt-16 border-t border-outline-variant">
      <div className="flex items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-2xl bg-surface-container-high border border-outline-variant flex items-center justify-center text-on-surface shadow-xs">
            <span aria-hidden="true" className="material-symbols-rounded text-[22px]">school</span>
          </div>
          <div>
            <h2 className="font-headline-lg text-headline-lg">education</h2>
          </div>
        </div>

        {hasExtra && (
          <button
            type="button"
            aria-expanded={showAll}
            aria-controls={extraListId}
            onClick={() => setShowAll(!showAll)}
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
            <span>{showAll ? 'Show highlights only' : `Show all (${educations.length})`}</span>
          </button>
        )}
      </div>

      <Timeline>
        {pinnedEducations.map((edu, index) => (
          <TimelineItem
            key={edu.id}
            title={edu.degree}
            subtitle={edu.institution}
            date={edu.date}
            isLast={index === pinnedEducations.length - 1}
          >
            <p className="font-medium text-on-surface-variant">{edu.honors}</p>
          </TimelineItem>
        ))}

        {hasExtra && (
          <div
            id={extraListId}
            data-open={showAll}
            aria-hidden={!showAll}
            inert={!showAll}
            className="collapsible-disclosure -ml-10"
          >
            <div className="collapsible-disclosure-inner pl-10">
              <div className={pinnedEducations.length > 0 ? 'pt-10' : ''}>
                {extraEducations.map((edu, index) => (
                  <TimelineItem
                    key={edu.id}
                    title={edu.degree}
                    subtitle={edu.institution}
                    date={edu.date}
                    isLast={index === extraEducations.length - 1}
                  >
                    <p className="font-medium text-on-surface-variant">{edu.honors}</p>
                  </TimelineItem>
                ))}
              </div>
            </div>
          </div>
        )}
      </Timeline>

      {hasExtra && (
        <div className="mt-6 sm:hidden">
          <button
            type="button"
            aria-expanded={showAll}
            aria-controls={extraListId}
            onClick={() => setShowAll(!showAll)}
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
            <span>{showAll ? 'Show highlights only' : `Show all (${educations.length})`}</span>
          </button>
        </div>
      )}
    </section>
  );
}
