import type { SkillCategory } from '@/data/resumeData';
import Chip from '@/components/ui/Chip';

export default function SkillsSection({ skills }: { skills: SkillCategory[] }) {
  return (
    <section id="skills" className="scroll-mt-24 pt-16 border-t border-outline-variant">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-11 h-11 rounded-2xl bg-surface-container-high border border-outline-variant flex items-center justify-center text-on-surface shadow-xs">
          <span className="material-symbols-rounded text-[22px]">bolt</span>
        </div>
        <div>
          <h2 className="font-headline-lg text-headline-lg">skills matrix</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {skills.map((skillGroup) => (
          <div
            key={skillGroup.category}
            className="bg-surface-container-lowest border border-outline-variant rounded-[24px] p-6 shadow-xs md:last:col-span-2"
          >
            <h3 className="font-mono text-xs uppercase tracking-wider text-on-surface-variant font-semibold mb-4">
              {skillGroup.category}
            </h3>
            <div className="flex flex-wrap gap-2">
              {skillGroup.skills.map((skill) => (
                <Chip key={skill} color="default">
                  {skill}
                </Chip>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
