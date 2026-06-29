import { Link } from 'react-router-dom';
import Card from '../components/Card';
import Chip from '../components/Chip';

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
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-display font-bold text-gray-900 mb-4">
          Projects <span className="text-google-red">.</span>
        </h1>
        <p className="text-lg text-on-surface-variant">
          A collection of things I've built, focusing on AI and active learning.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project) => (
          <Link key={project.id} to={`/projects/${project.id}`} className="block h-full">
            <Card className="h-full flex flex-col hover:border-google-blue/30">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-blue-50 rounded-2xl text-google-blue">
                  <span className="material-symbols-rounded text-3xl">
                    {project.id === 'rbai' ? 'smart_toy' : 'dashboard'}
                  </span>
                </div>
                <span className="text-sm text-gray-400 font-medium">{project.date}</span>
              </div>
              
              <h2 className="text-2xl font-display font-bold mb-2">{project.title}</h2>
              <p className="text-gray-600 mb-6 flex-grow">{project.shortDescription}</p>
              
              <div className="flex flex-wrap gap-2 mt-auto">
                {project.techStack?.map((tech: string) => (
                  <Chip key={tech} className="text-xs bg-gray-50 border-gray-100 text-gray-600">
                    {tech}
                  </Chip>
                ))}
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
