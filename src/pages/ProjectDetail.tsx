import { useParams, Link } from 'react-router-dom';

// Load MDX modules eagerly for now to match Projects.tsx behavior
const mdxModules = import.meta.glob('../content/projects/*.mdx', { eager: true });

// Load all project images to map them dynamically
const imageAssets = import.meta.glob<{ default: string }>('../assets/projects/**/*.{png,jpg,jpeg,svg,webp}', { eager: true });

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  
  // Find the exact module for the requested ID
  const projectPath = Object.keys(mdxModules).find(path => path.endsWith(`/${id}.mdx`));
  const module = projectPath ? mdxModules[projectPath] as any : null;

  if (!module) {
    return (
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-section-gap text-center">
        <h1 className="font-headline-xl text-headline-xl text-on-surface mb-4">Project not found</h1>
        <Link to="/projects" className="text-primary hover:underline font-label-lg text-label-lg">
          &larr; Back to Projects
        </Link>
      </div>
    );
  }

  const MDXContent = module.default;
  const meta = module.meta;

  const getImageUrl = (imagePath: string) => {
    const fullPath = `../assets/projects/${imagePath}`;
    return imageAssets[fullPath]?.default || '';
  };

  return (
    <div className="max-w-3xl mx-auto px-margin-mobile md:px-margin-desktop py-section-gap">
      <Link to="/projects" className="inline-flex items-center gap-2 text-on-surface-variant hover:text-primary font-label-lg text-label-lg mb-8 transition-colors">
        <span className="material-symbols-rounded text-[20px]">arrow_back</span>
        Back to Projects
      </Link>

      <div className="mb-12">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-primary-fixed rounded-[24px] flex items-center justify-center text-primary">
            <span className="material-symbols-rounded text-4xl">
              {meta.icon}
            </span>
          </div>
          <div>
            <h1 className="font-headline-xl text-headline-xl text-on-surface leading-tight">
              {meta.title}
            </h1>
            <span className="font-label-md text-on-surface-variant font-medium">{meta.date}</span>
          </div>
        </div>

        <p className="font-body-lg text-body-lg text-on-surface-variant mb-8 leading-relaxed">
          {meta.shortDescription}
        </p>

        <div className="flex flex-wrap gap-2 mb-8">
          {meta.techStack?.map((tech: string) => (
            <span key={tech} className="bg-surface-container px-3 py-1 rounded-lg font-label-sm text-label-sm text-on-surface">
              {tech}
            </span>
          ))}
        </div>

        {meta.links && (
          <div className="flex flex-wrap gap-4 border-b border-outline-variant/30 pb-8">
            {meta.links.livePreview && (
              <a href={meta.links.livePreview} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-primary-fixed text-on-primary-fixed px-6 py-3 rounded-full font-label-lg text-label-lg hover:bg-primary-container transition-colors shadow-sm">
                <span className="material-symbols-rounded text-[20px]">open_in_new</span>
                Live Preview
              </a>
            )}
            {meta.links.github && (
              <a href={meta.links.github} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 border border-outline text-on-surface px-6 py-3 rounded-full font-label-lg text-label-lg hover:bg-surface-container transition-colors">
                <span className="material-symbols-rounded text-[20px]">code</span>
                GitHub
              </a>
            )}
            {meta.links.videoDemo && (
              <a href={meta.links.videoDemo} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-secondary-fixed text-on-secondary-fixed-variant px-6 py-3 rounded-full font-label-lg text-label-lg hover:bg-secondary-container hover:text-white transition-colors">
                <span className="material-symbols-rounded text-[20px]">play_circle</span>
                Video Demo
              </a>
            )}
            {meta.links.article && (
              <a href={meta.links.article} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-surface-container-high text-on-surface px-6 py-3 rounded-full font-label-lg text-label-lg hover:bg-surface-container-highest transition-colors">
                <span className="material-symbols-rounded text-[20px]">article</span>
                Featured Post
              </a>
            )}
          </div>
        )}
      </div>

      {meta.images && meta.images.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          {meta.images.map((imgPath: string, idx: number) => {
            const url = getImageUrl(imgPath);
            if (!url) return null;
            // Make the last image span 2 columns if there is an odd number of images
            const isLastOdd = idx === meta.images.length - 1 && meta.images.length % 2 !== 0;
            return (
              <img 
                key={imgPath} 
                src={url} 
                alt={`${meta.title} screenshot ${idx + 1}`} 
                className={`w-full h-auto rounded-[24px] shadow-sm border border-outline-variant/30 ${isLastOdd ? 'md:col-span-2' : ''}`}
              />
            );
          })}
        </div>
      )}

      <div className="prose prose-lg max-w-none text-on-surface-variant prose-headings:font-headline-md prose-headings:text-on-surface prose-a:text-primary">
        <MDXContent />
      </div>
    </div>
  );
}
