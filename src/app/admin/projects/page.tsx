'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import AdminRoute from '@/components/admin/AdminRoute';
import AdminProjectRowSkeleton from '@/components/skeletons/AdminProjectRowSkeleton';
import ProjectIcon from '@/components/projects/ProjectIcon';
import {
  fetchAdminProjects,
  toggleProjectPin,
  toggleProjectVisibility,
  deleteProject,
  type AdminProject as Project,
} from '@/lib/projects';

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const router = useRouter();

  const fetchProjects = async () => {
    setIsLoading(true);
    const { data, error } = await fetchAdminProjects();

    if (error) {
      console.error('Error fetching projects:', error);
    } else {
      setProjects(data);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleTogglePin = async (id: string, currentPinned: boolean) => {
    const newPinned = !currentPinned;
    setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, is_pinned: newPinned } : p)));
    const res = await toggleProjectPin(id, newPinned);
    if (!res.success) {
      console.error('Failed to update pinned status in DB:', res.error);
      setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, is_pinned: currentPinned } : p)));
      alert(`Could not save pin to database: ${res.error}\nMake sure to run scripts/003_add_pinned_to_projects.sql in Supabase SQL editor.`);
    }
  };

  const handleToggleVisibility = async (id: string, currentVisible: boolean) => {
    const newVisible = !currentVisible;
    setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, is_visible: newVisible } : p)));
    const res = await toggleProjectVisibility(id, newVisible);
    if (!res.success) {
      console.error('Failed to update visibility in DB:', res.error);
      setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, is_visible: currentVisible } : p)));
      alert(`Could not save visibility to database: ${res.error}\nMake sure to run scripts/006_add_is_visible_to_projects.sql in Supabase SQL editor.`);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.replace('/admin/login');
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
      return;
    }

    setDeletingId(id);
    const res = await deleteProject(id);

    if (!res.success) {
      alert(`Failed to delete project: ${res.error}`);
    } else {
      setProjects((prev) => prev.filter((p) => p.id !== id));
    }
    setDeletingId(null);
  };

  return (
    <AdminRoute>
      <div className="max-w-5xl mx-auto px-margin-mobile md:px-margin-desktop py-section-gap">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-headline-xl text-headline-xl text-on-surface leading-tight">
              Showcase CMS
            </h1>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Manage, create, and update your portfolio project showcases
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/projects/new"
              className="bg-primary text-on-primary font-label-lg text-label-lg px-5 py-2.5 rounded-full hover:bg-primary/90 transition-colors inline-flex items-center gap-2 shadow-sm font-medium"
            >
              <span className="material-symbols-rounded text-[20px]">add</span>
              New Project
            </Link>
            <button
              onClick={handleSignOut}
              className="border border-outline text-on-surface hover:bg-surface-container font-label-lg text-label-lg px-4 py-2.5 rounded-full transition-colors inline-flex items-center gap-1 font-medium cursor-pointer"
            >
              <span className="material-symbols-rounded text-[20px]">logout</span>
              Sign Out
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <AdminProjectRowSkeleton key={i} />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="bg-surface-container rounded-[24px] p-12 text-center border border-outline-variant/30">
            <span className="material-symbols-rounded text-5xl text-on-surface-variant mb-4">
              folder_open
            </span>
            <h3 className="font-headline-md text-headline-md text-on-surface mb-2">
              No projects found
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant mb-6">
              Get started by adding your first project showcase!
            </p>
            <Link
              href="/admin/projects/new"
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
                  <ProjectIcon
                    appIconUrl={project.app_icon_url}
                    icon={project.icon}
                    title={project.title}
                    className="w-12 h-12 rounded-[16px] bg-primary/10 text-primary border border-primary/20 flex items-center justify-center shrink-0 overflow-hidden"
                    iconClassName="text-2xl"
                  />
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="font-title-lg text-title-lg text-on-surface font-medium">
                        {project.title}
                      </h3>
                      <span className="bg-surface-container-high font-label-sm text-label-sm px-2.5 py-0.5 rounded-full text-on-surface-variant">
                        /{project.slug}
                      </span>
                      <span className="inline-flex items-center gap-1 font-mono text-[11px] text-on-surface-variant px-2 py-0.5 rounded-full bg-surface-container-high">
                        <span className="material-symbols-rounded text-[13px]">visibility</span>
                        {project.views ?? 0}
                      </span>
                      {project.is_visible === false ? (
                        <span className="inline-flex items-center gap-1 font-mono text-[11px] text-on-error-container bg-error-container/60 px-2 py-0.5 rounded-full border border-error/20">
                          <span className="material-symbols-rounded text-[13px]">visibility_off</span>
                          Hidden
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 font-mono text-[11px] text-on-surface-variant bg-surface-container-high px-2 py-0.5 rounded-full">
                          <span className="material-symbols-rounded text-[13px]">visibility</span>
                          Visible
                        </span>
                      )}
                      {project.is_pinned && (
                        <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary text-on-primary font-bold shadow-xs">
                          <span className="material-symbols-rounded text-[13px]">push_pin</span>
                          Pinned
                        </span>
                      )}
                    </div>
                    <p className="font-body-md text-body-md text-on-surface-variant line-clamp-1 mb-2">
                      {project.short_description}
                    </p>
                    {Array.isArray(project.tags) && project.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {project.tags.map((t) => (
                          <span
                            key={t}
                            className="bg-primary/10 text-primary border border-primary/20 font-mono text-[10px] px-2 py-0.2 rounded-full"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    )}
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

                {/* More Vert Actions Dropdown */}
                <div className="relative self-end md:self-center shrink-0">
                  <button
                    type="button"
                    onClick={() => setOpenMenuId(openMenuId === project.id ? null : project.id)}
                    className="w-9 h-9 rounded-full flex items-center justify-center text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer"
                    title="Actions menu"
                    aria-label="Actions menu"
                    aria-expanded={openMenuId === project.id}
                  >
                    <span className="material-symbols-rounded text-[22px]">more_vert</span>
                  </button>

                  {openMenuId === project.id && (
                    <>
                      {/* Invisible backdrop to dismiss dropdown on click outside */}
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setOpenMenuId(null)}
                      />

                      {/* Dropdown Menu Card */}
                      <div className="absolute right-0 top-full mt-1.5 z-50 w-52 bg-surface-container-high border border-outline-variant/70 rounded-2xl shadow-xl py-1.5 backdrop-blur-md flex flex-col text-on-surface">
                        <Link
                          href={`/projects/${project.slug}`}
                          target="_blank"
                          onClick={() => setOpenMenuId(null)}
                          className="flex items-center gap-2.5 px-4 py-2 font-label-md text-label-md hover:bg-surface-container-highest transition-colors text-on-surface"
                        >
                          <span className="material-symbols-rounded text-[18px] text-on-surface-variant">visibility</span>
                          <span>View Public Page</span>
                        </Link>

                        <Link
                          href={`/admin/projects/edit/${project.id}`}
                          onClick={() => setOpenMenuId(null)}
                          className="flex items-center gap-2.5 px-4 py-2 font-label-md text-label-md hover:bg-surface-container-highest transition-colors text-on-surface"
                        >
                          <span className="material-symbols-rounded text-[18px] text-on-surface-variant">edit</span>
                          <span>Edit Project</span>
                        </Link>

                        <button
                          type="button"
                          onClick={() => {
                            handleToggleVisibility(project.id, project.is_visible !== false);
                            setOpenMenuId(null);
                          }}
                          className="flex items-center gap-2.5 px-4 py-2 font-label-md text-label-md hover:bg-surface-container-highest transition-colors text-left w-full cursor-pointer text-on-surface"
                        >
                          <span className="material-symbols-rounded text-[18px] text-on-surface-variant">
                            {project.is_visible !== false ? 'visibility_off' : 'visibility'}
                          </span>
                          <span>{project.is_visible !== false ? 'Hide from Public' : 'Show on Public'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            handleTogglePin(project.id, Boolean(project.is_pinned));
                            setOpenMenuId(null);
                          }}
                          className="flex items-center gap-2.5 px-4 py-2 font-label-md text-label-md hover:bg-surface-container-highest transition-colors text-left w-full cursor-pointer text-on-surface"
                        >
                          <span className="material-symbols-rounded text-[18px] text-on-surface-variant">
                            {project.is_pinned ? 'keep_off' : 'push_pin'}
                          </span>
                          <span>{project.is_pinned ? 'Unpin from Home' : 'Pin to Home'}</span>
                        </button>

                        <div className="border-t border-outline-variant/40 my-1" />

                        <button
                          type="button"
                          onClick={() => {
                            setOpenMenuId(null);
                            handleDelete(project.id, project.title);
                          }}
                          disabled={deletingId === project.id}
                          className="flex items-center gap-2.5 px-4 py-2 font-label-md text-label-md text-error hover:bg-error-container/30 transition-colors text-left w-full cursor-pointer disabled:opacity-50"
                        >
                          <span className="material-symbols-rounded text-[18px] text-error">delete</span>
                          <span>Delete Project</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminRoute>
  );
}
