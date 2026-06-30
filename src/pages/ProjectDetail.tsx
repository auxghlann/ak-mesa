import { useParams, Link } from 'react-router-dom';
import Chip from '../components/Chip';

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
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h1 className="text-4xl font-display font-bold text-gray-900 mb-4">Project not found</h1>
        <Link to="/projects" className="text-google-blue hover:underline">
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
    <div className="max-w-3xl mx-auto px-6 py-12">
      <Link to="/projects" className="inline-flex items-center gap-2 text-on-surface-variant hover:text-google-blue font-medium mb-8 transition-colors">
        <span className="material-symbols-rounded text-[20px]">arrow_back</span>
        Back to Projects
      </Link>

      <div className="mb-12">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-4 bg-gray-50 rounded-3xl text-gray-700">
            <span className="material-symbols-rounded text-4xl">
              {id === 'rbai' ? 'smart_toy' : 'dashboard'}
            </span>
          </div>
          <div>
            <h1 className="text-4xl font-display font-bold text-gray-900 leading-tight">
              {meta.title}
            </h1>
            <span className="text-gray-500 font-medium">{meta.date}</span>
          </div>
        </div>

        <p className="text-xl text-gray-600 mb-8 leading-relaxed">
          {meta.shortDescription}
        </p>

        <div className="flex flex-wrap gap-2 mb-8">
          {meta.techStack?.map((tech: string) => (
            <Chip key={tech} className="bg-white border-gray-200 text-gray-700">
              {tech}
            </Chip>
          ))}
        </div>

        {meta.links && (
          <div className="flex flex-wrap gap-4 border-b border-gray-100 pb-8">
            {meta.links.livePreview && (
              <a href={meta.links.livePreview} target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-google-blue text-white px-4 py-2 rounded-full font-medium hover:bg-blue-600 transition-colors text-sm">
                <span className="material-symbols-rounded text-[18px]">open_in_new</span>
                Live Preview
              </a>
            )}
            {meta.links.github && (
              <a href={meta.links.github} target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-full font-medium hover:bg-gray-800 transition-colors text-sm">
                <span className="material-symbols-rounded text-[18px]">code</span>
                GitHub
              </a>
            )}
            {meta.links.videoDemo && (
              <a href={meta.links.videoDemo} target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-google-red text-white px-4 py-2 rounded-full font-medium hover:bg-red-600 transition-colors text-sm">
                <span className="material-symbols-rounded text-[18px]">play_circle</span>
                Video Demo
              </a>
            )}
            {meta.links.article && (
              <a href={meta.links.article} target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-google-green text-white px-4 py-2 rounded-full font-medium hover:bg-green-600 transition-colors text-sm">
                <span className="material-symbols-rounded text-[18px]">article</span>
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
                className={`w-full h-auto rounded-2xl shadow-sm border border-gray-200 ${isLastOdd ? 'md:col-span-2' : ''}`}
              />
            );
          })}
        </div>
      )}

      <div className="prose prose-lg prose-blue max-w-none text-gray-700 prose-headings:font-display prose-headings:font-bold prose-a:text-google-blue">
        <MDXContent />
      </div>
    </div>
  );
}
