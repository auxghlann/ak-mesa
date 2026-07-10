import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

type Project = {
  id: string;
  slug: string;
  title: string;
  date: string;
  icon: string;
  short_description: string;
  content: string;
  tech_stack: string[];
  links: {
    livePreview?: string | null;
    github?: string | null;
    videoDemo?: string | null;
    article?: string | null;
    images?: string[];
  };
};

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchProject() {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('slug', id)
        .single();
        
      if (!error && data) {
        setProject(data as Project);
      } else if (error) {
        console.error('Error fetching project:', error.message);
      }
      setIsLoading(false);
    }
    
    if (id) {
      fetchProject();
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-section-gap text-center">
        <h1 className="font-headline-xl text-headline-xl text-on-surface mb-4 animate-pulse">Loading project...</h1>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-section-gap text-center">
        <h1 className="font-headline-xl text-headline-xl text-on-surface mb-4">Project not found</h1>
        <Link to="/projects" className="text-primary hover:underline font-label-lg text-label-lg">
          &larr; Back to Projects
        </Link>
      </div>
    );
  }

  const { title, date, icon, short_description, content, tech_stack, links } = project;
  const images = links?.images || [];

  return (
    <div className="max-w-3xl mx-auto px-margin-mobile md:px-margin-desktop py-section-gap">
      <Link to="/projects" className="inline-flex items-center gap-2 text-on-surface-variant hover:text-primary font-label-lg text-label-lg mb-8 transition-colors">
        <span className="material-symbols-rounded text-[20px]">arrow_back</span>
        Back to Projects
      </Link>

      <div className="mb-12">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-primary rounded-[24px] flex items-center justify-center text-on-primary shadow-md">
            <span className="material-symbols-rounded text-4xl">
              {icon}
            </span>
          </div>
          <div>
            <h1 className="font-headline-xl text-headline-xl text-on-surface leading-tight">
              {title}
            </h1>
            <span className="font-label-md text-on-surface-variant font-medium">{date}</span>
          </div>
        </div>

        <p className="font-body-lg text-body-lg text-on-surface-variant mb-8 leading-relaxed">
          {short_description}
        </p>

        <div className="flex flex-wrap gap-2 mb-8">
          {tech_stack?.map((tech: string) => (
            <span key={tech} className="bg-surface-container px-3 py-1 rounded-lg font-label-sm text-label-sm text-on-surface">
              {tech}
            </span>
          ))}
        </div>

        {links && (
          <div className="flex flex-wrap gap-4 border-b border-outline-variant/30 pb-8">
            {links.livePreview && (
              <a href={links.livePreview} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-primary-fixed text-on-primary-fixed px-6 py-3 rounded-full font-label-lg text-label-lg hover:bg-primary-container transition-colors shadow-sm">
                <span className="material-symbols-rounded text-[20px]">open_in_new</span>
                Live Preview
              </a>
            )}
            {links.github && (
              <a href={links.github} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 border border-outline text-on-surface px-6 py-3 rounded-full font-label-lg text-label-lg hover:bg-surface-container transition-colors">
                <span className="material-symbols-rounded text-[20px]">code</span>
                GitHub
              </a>
            )}
            {links.videoDemo && (
              <a href={links.videoDemo} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-secondary-fixed text-on-secondary-fixed-variant px-6 py-3 rounded-full font-label-lg text-label-lg hover:bg-secondary-container hover:text-white transition-colors">
                <span className="material-symbols-rounded text-[20px]">play_circle</span>
                Video Demo
              </a>
            )}
            {links.article && (
              <a href={links.article} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-surface-container-high text-on-surface px-6 py-3 rounded-full font-label-lg text-label-lg hover:bg-surface-container-highest transition-colors">
                <span className="material-symbols-rounded text-[20px]">article</span>
                Featured Post
              </a>
            )}
          </div>
        )}
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          {images.map((url: string, idx: number) => {
            // Make the last image span 2 columns if there is an odd number of images
            const isLastOdd = idx === images.length - 1 && images.length % 2 !== 0;
            return (
              <img 
                key={url} 
                src={url} 
                alt={`${title} screenshot ${idx + 1}`} 
                className={`w-full h-auto rounded-[24px] shadow-sm border border-outline-variant/30 ${isLastOdd ? 'md:col-span-2' : ''}`}
              />
            );
          })}
        </div>
      )}

      <div className="prose prose-lg max-w-none text-on-surface-variant prose-headings:font-headline-md prose-headings:text-on-surface prose-a:text-primary prose-a:no-underline hover:prose-a:underline">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
}
