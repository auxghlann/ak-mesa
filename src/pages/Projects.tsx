import { Link } from 'react-router-dom';

// Import all MDX files from the content directory
const mdxModules = import.meta.glob('../content/projects/*.mdx', { eager: true });

// Parse them into a project list
const projects = Object.entries(mdxModules).map(([path, module]) => {
  // Extract filename without extension for the ID
  const id = path.split('/').pop()?.replace('.mdx', '') || '';
  const meta = (module as any).meta;
  return {
    id,
    ...meta
  };
});

export default function Projects() {
  return (
    <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-section-gap">
      <div className="mb-12">
        <h1 className="font-headline-xl text-headline-xl mb-4">
          Projects<span className="text-secondary">.</span>
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant">
          A collection of things I've built.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
        {projects.map((project) => (
          <Link key={project.id} to={`/projects/${project.id}`} className="block h-full group">
            <div className="bg-surface-container-lowest border border-outline-variant/30 rounded-[32px] p-8 hover:border-primary/50 hover:shadow-lg transition-all duration-300 h-full flex flex-col">
              <div className="flex justify-between items-start mb-6">
                <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center text-on-primary group-hover:scale-110 transition-transform shadow-md">
                  <span className="material-symbols-rounded text-[28px]">
                    {project.icon || 'dashboard'}
                  </span>
                </div>
                <span className="font-label-sm text-label-sm text-on-surface-variant">{project.date}</span>
              </div>

              <h2 className="font-headline-md text-headline-md mb-4 text-[24px] leading-tight text-on-surface">{project.title}</h2>
              <p className="font-body-md text-body-md text-on-surface-variant mb-8 flex-grow line-clamp-3">{project.shortDescription}</p>

              <div className="flex flex-wrap gap-2 mt-auto">
                {project.techStack?.map((tech: string) => (
                  <span key={tech} className="bg-surface-container px-3 py-1 rounded-lg font-label-sm text-label-sm text-on-surface">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
