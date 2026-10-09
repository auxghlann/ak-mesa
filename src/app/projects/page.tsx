import { supabase } from '@/lib/supabase';
import type { Metadata } from 'next';
import { cacheLife, cacheTag } from 'next/cache';
import ProjectsFilterableList, { type ProjectItem } from '@/components/projects/ProjectsFilterableList';

export const metadata: Metadata = {
  title: 'Projects | Allan Khester Mesa',
  description: 'A collection of software engineering projects, AI applications, and case studies by Allan Khester Mesa.',
};

async function getProjects(): Promise<ProjectItem[]> {
  'use cache';
  cacheLife('hours');
  cacheTag('projects');

  const { data, error } = await supabase
    .from('projects')
    .select('slug, title, date, icon, short_description, tech_stack, is_pinned, views, tags, app_icon_url')
    .eq('is_visible', true)
    .order('is_pinned', { ascending: false })
    .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching projects:', error.message);
    return [];
  }
  return (data as ProjectItem[]) || [];
}

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-section-gap">
      <div className="mb-12">
        <h1 className="font-headline-xl text-headline-xl mb-4">
          projects<span className="text-secondary">.</span>
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant">
          A collection of things I've built.
        </p>
      </div>

      <ProjectsFilterableList projects={projects} />
    </div>
  );
}
