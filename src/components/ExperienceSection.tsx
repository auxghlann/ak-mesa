import type { Experience } from '@/data/resumeData';
import { Timeline, TimelineItem } from '@/components/Timeline';

export default function ExperienceSection({ experiences }: { experiences: Experience[] }) {
  return (
    <section id="experience" className="scroll-mt-24 pt-16 border-t border-outline-variant">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-11 h-11 rounded-2xl bg-surface-container-high border border-outline-variant flex items-center justify-center text-on-surface shadow-xs">
          <span className="material-symbols-rounded text-[22px]">work</span>
        </div>
        <div>
          <h2 className="font-headline-lg text-headline-lg">experience</h2>
        </div>
      </div>

      <Timeline>
        {experiences.map((exp, index) => (
          <TimelineItem
            key={exp.id}
            title={exp.title}
            subtitle={exp.company}
            date={exp.date}
            isLast={index === experiences.length - 1}
          >
            <ul className="list-disc pl-5 space-y-1">
              {exp.description.map((desc, i) => (
                <li key={i}>{desc}</li>
              ))}
            </ul>
          </TimelineItem>
        ))}
      </Timeline>
    </section>
  );
}
