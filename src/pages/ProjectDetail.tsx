import { useParams, Link } from 'react-router-dom';
import { projects } from '../data/projectData';
import Chip from '../components/Chip';

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const project = projects.find((p) => p.id === id);

  if (!project) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h1 className="text-4xl font-display font-bold text-gray-900 mb-4">Project not found</h1>
        <Link to="/projects" className="text-google-blue hover:underline">
          &larr; Back to Projects
        </Link>
      </div>
    );
  }

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
              {project.id === 'rbai' ? 'smart_toy' : 'dashboard'}
            </span>
          </div>
          <div>
            <h1 className="text-4xl font-display font-bold text-gray-900 leading-tight">
              {project.title}
            </h1>
            <span className="text-gray-500 font-medium">{project.date}</span>
          </div>
        </div>

        <p className="text-xl text-gray-600 mb-8 leading-relaxed">
          {project.shortDescription}
        </p>

        <div className="flex flex-wrap gap-2 mb-12 border-b border-gray-100 pb-8">
          {project.techStack.map((tech) => (
            <Chip key={tech} className="bg-white border-gray-200 text-gray-700">
              {tech}
            </Chip>
          ))}
        </div>
      </div>

      <div className="prose prose-lg max-w-none text-gray-700">
        <h2 className="text-2xl font-display font-bold text-gray-900 mb-6 flex items-center gap-2">
          <span className="material-symbols-rounded text-google-yellow">lightbulb</span>
          About the Project
        </h2>
        <ul className="space-y-4 list-none pl-0">
          {project.bulletPoints.map((point, idx) => (
            <li key={idx} className="flex gap-4">
              <span className="material-symbols-rounded text-google-blue shrink-0 mt-1">check_circle</span>
              <span className="leading-relaxed">{point}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
