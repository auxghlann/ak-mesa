import Link from 'next/link';
import ProjectIcon from '../projects/ProjectIcon';

export type PinnedProject = {
  slug: string;
  title: string;
  date: string;
  icon?: string;
  short_description: string;
  tech_stack?: string[];
  views?: number;
  tags?: string[];
  app_icon_url?: string | null;
};

export default function ProjectsSection({ projects }: { projects: PinnedProject[] }) {
  if (!projects || projects.length === 0) return null;

  return (
    <section id="projects" className="scroll-mt-24 pt-16 border-t border-outline-variant">
      <div className="flex items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-2xl bg-surface-container-high border border-outline-variant flex items-center justify-center text-on-surface shadow-xs">
            <span className="material-symbols-rounded text-[22px]">code</span>
          </div>
          <div>
            <h2 className="font-headline-lg text-headline-lg">projects</h2>
          </div>
        </div>

        <Link
          href="/projects"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-mono text-on-surface-variant hover:text-on-surface bg-surface-container-low hover:bg-surface-container border border-outline-variant transition-colors group cursor-pointer"
        >
          <span>View all projects</span>
          <span className="material-symbols-rounded text-[16px] group-hover:translate-x-0.5 transition-transform">
            arrow_forward
          </span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {projects.map((project) => (
          <Link
            key={project.slug}
            href={`/projects/${project.slug}`}
            className="block h-full group"
          >
            <div className="bg-surface-container-lowest border border-outline-variant hover:border-outline rounded-[28px] p-6 shadow-xs hover:shadow-md transition-all duration-300 h-full flex flex-col justify-between">
              <div>
                {/* Zone 1: Top Bar (Icon + Date & Pin) */}
                <div className="flex items-center justify-between mb-4">
                  <ProjectIcon
                    appIconUrl={project.app_icon_url}
                    icon={project.icon}
                    title={project.title}
                    className="w-12 h-12 rounded-2xl bg-surface-container-high border border-outline-variant/60 flex items-center justify-center text-on-surface group-hover:scale-105 transition-transform shadow-xs"
                    iconClassName="text-[24px]"
                  />
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] text-on-surface-variant">
                      {new Date(project.date).toLocaleDateString('en-US', {
                        timeZone: 'UTC',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </div>

                {/* Zone 2: Content Body */}
                <h3 className="font-headline-md text-[18px] leading-snug text-on-surface mb-2 group-hover:text-primary transition-colors">
                  {project.title}
                </h3>
                <p className="font-body-sm text-on-surface-variant line-clamp-3 mb-6">
                  {project.short_description}
                </p>
              </div>

              {/* Zone 3: Footer Bar (Tech Stack) */}
              <div className="flex items-center justify-between gap-2 pt-3 border-t border-outline-variant/40 mt-auto">
                <div className="flex flex-wrap gap-1.5">
                  {project.tech_stack?.slice(0, 3).map((tech: string) => (
                    <span
                      key={tech}
                      className="bg-surface-container border border-outline-variant/60 px-2 py-0.5 rounded-lg font-mono text-[10px] text-on-surface-variant"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.tech_stack && project.tech_stack.length > 3 && (
                    <span className="font-mono text-[10px] text-on-surface-variant self-center">
                      +{project.tech_stack.length - 3}
                    </span>
                  )}
                </div>

                <div
                  className="flex items-center gap-1 font-mono text-[11px] text-on-surface-variant shrink-0"
                  title={`${project.views ?? 0} views`}
                >
                  <span className="material-symbols-rounded text-[14px]">visibility</span>
                  <span>{project.views ?? 0}</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
