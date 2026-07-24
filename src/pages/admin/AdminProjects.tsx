import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

type Project = {
  id: string;
  slug: string;
  title: string;
  date: string;
  icon: string;
  short_description: string;
  tech_stack: string[];
};

export default function AdminProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchProjects = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('projects')
      .select('id, slug, title, date, icon, short_description, tech_stack')
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching projects:', error.message);
    } else {
      setProjects(data as Project[]);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login', { replace: true });
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
      return;
    }

    setDeletingId(id);
    const { error } = await supabase.from('projects').delete().eq('id', id);

    if (error) {
      alert(`Failed to delete project: ${error.message}`);
    } else {
      setProjects((prev) => prev.filter((p) => p.id !== id));
    }
    setDeletingId(null);
  };

  return (
    <div className="max-w-5xl mx-auto px-margin-mobile md:px-margin-desktop py-section-gap">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-headline-xl text-headline-xl text-on-surface leading-tight font-bold">
            Showcase CMS
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Manage, create, and update your portfolio project showcases
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/projects/new"
            className="bg-primary text-on-primary font-label-lg text-label-lg px-5 py-2.5 rounded-full hover:bg-primary/90 transition-colors inline-flex items-center gap-2 shadow-sm font-medium"
          >
            <span className="material-symbols-rounded text-[20px]">add</span>
            New Project
          </Link>
          <button
            onClick={handleSignOut}
            className="border border-outline text-on-surface hover:bg-surface-container font-label-lg text-label-lg px-4 py-2.5 rounded-full transition-colors inline-flex items-center gap-1 font-medium"
          >
            <span className="material-symbols-rounded text-[20px]">logout</span>
            Sign Out
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <h2 className="font-headline-md text-headline-md text-on-surface animate-pulse">
            Loading project list...
          </h2>
        </div>
      ) : projects.length === 0 ? (
        <div className="bg-surface-container rounded-[24px] p-12 text-center border border-outline-variant/30">
          <span className="material-symbols-rounded text-5xl text-on-surface-variant mb-4">
            folder_open
          </span>
          <h3 className="font-headline-md text-headline-md text-on-surface mb-2 font-bold">
            No projects found
          </h3>
          <p className="font-body-md text-body-md text-on-surface-variant mb-6">
            Get started by adding your first project showcase!
          </p>
          <Link
            to="/admin/projects/new"
            className="bg-primary text-on-primary font-label-lg text-label-lg px-6 py-3 rounded-full hover:bg-primary/90 transition-colors inline-flex items-center gap-2 shadow-sm font-medium"
          >
            <span className="material-symbols-rounded text-[20px]">add</span>
            Create Project
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-surface-container rounded-[24px] p-6 border border-outline-variant/30 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-outline-variant transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-[16px] flex items-center justify-center shrink-0">
                  <span className="material-symbols-rounded text-2xl">
                    {project.icon || 'code'}
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-title-lg text-title-lg text-on-surface font-bold">
                      {project.title}
                    </h3>
                    <span className="bg-surface-container-high font-label-sm text-label-sm px-2.5 py-0.5 rounded-full text-on-surface-variant">
                      /{project.slug}
                    </span>
                  </div>
                  <p className="font-body-md text-body-md text-on-surface-variant line-clamp-1 mb-2">
                    {project.short_description}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {project.tech_stack?.slice(0, 5).map((tech) => (
                      <span
                        key={tech}
                        className="bg-surface-container-highest font-label-sm text-label-sm px-2 py-0.5 rounded-md text-on-surface"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.tech_stack?.length > 5 && (
                      <span className="font-label-sm text-label-sm text-on-surface-variant self-center">
                        +{project.tech_stack.length - 5} more
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end md:self-center shrink-0 border-t md:border-t-0 border-outline-variant/30 pt-3 md:pt-0 w-full md:w-auto justify-end">
                <Link
                  to={`/projects/${project.slug}`}
                  target="_blank"
                  className="p-2 text-on-surface-variant hover:text-primary transition-colors rounded-full hover:bg-surface-container-high"
                  title="View Public Page"
                >
                  <span className="material-symbols-rounded text-[20px]">visibility</span>
                </Link>
                <Link
                  to={`/admin/projects/edit/${project.id}`}
                  className="px-4 py-2 bg-secondary-fixed text-on-secondary-fixed-variant hover:bg-secondary-container hover:text-white rounded-full font-label-md text-label-md font-medium transition-colors inline-flex items-center gap-1"
                >
                  <span className="material-symbols-rounded text-[18px]">edit</span>
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(project.id, project.title)}
                  disabled={deletingId === project.id}
                  className="px-4 py-2 bg-error-container text-on-error-container hover:bg-error hover:text-on-error rounded-full font-label-md text-label-md font-medium transition-colors inline-flex items-center gap-1 disabled:opacity-50"
                >
                  <span className="material-symbols-rounded text-[18px]">delete</span>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
