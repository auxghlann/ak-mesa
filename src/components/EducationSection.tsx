'use client';

import { useState } from 'react';
import type { Education } from '@/data/resumeData';
import { Timeline, TimelineItem } from '@/components/Timeline';

export default function EducationSection({ educations }: { educations: Education[] }) {
  const [showAll, setShowAll] = useState(false);

  const pinnedEducations = educations.filter((edu) => edu.pinned);
  const displayedEducations = showAll ? educations : pinnedEducations;

  return (
    <section id="education" className="scroll-mt-24 pt-16 border-t border-outline-variant">
      <div className="flex items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-2xl bg-surface-container-high border border-outline-variant flex items-center justify-center text-on-surface shadow-xs">
            <span className="material-symbols-rounded text-[22px]">school</span>
          </div>
          <div>
            <h2 className="font-headline-lg text-headline-lg">education</h2>
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
          <span>{showAll ? 'Show highlights only' : `Show all (${educations.length})`}</span>
        </button>
      </div>

      <Timeline>
        {displayedEducations.map((edu, index) => (
          <TimelineItem
            key={edu.id}
            title={edu.degree}
            subtitle={edu.institution}
            date={edu.date}
            isLast={index === displayedEducations.length - 1}
          >
            <p className="font-medium text-on-surface-variant">{edu.honors}</p>
          </TimelineItem>
        ))}
      </Timeline>

      <div className="mt-6 sm:hidden">
        <button
          type="button"
          onClick={() => setShowAll(!showAll)}
          className="w-full inline-flex justify-center items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-mono text-on-surface-variant hover:text-on-surface bg-surface-container-low hover:bg-surface-container border border-outline-variant transition-colors cursor-pointer"
        >
          <span className="material-symbols-rounded text-[16px]">
            {showAll ? 'expand_less' : 'expand_more'}
          </span>
          <span>{showAll ? 'Show highlights only' : `Show all (${educations.length})`}</span>
        </button>
      </div>
    </section>
  );
}
