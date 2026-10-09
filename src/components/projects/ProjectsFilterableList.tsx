'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import ProjectIcon from './ProjectIcon';

export type ProjectItem = {
  slug: string;
  title: string;
  date: string;
  icon?: string;
  short_description: string;
  tech_stack?: string[];
  is_pinned?: boolean;
  views?: number;
  tags?: string[];
  app_icon_url?: string | null;
  is_visible?: boolean;
};

type SortOption = 'featured' | 'date_desc' | 'date_asc' | 'views_desc';

export default function ProjectsFilterableList({
  projects,
}: {
  projects: ProjectItem[];
}) {
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [selectedTech, setSelectedTech] = useState<string>('All');
  const [sortBy, setSortBy] = useState<SortOption>('featured');

  // Extract all unique category tags from projects
  const allTags = useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => {
      if (Array.isArray(p.tags)) {
        p.tags.forEach((tag) => {
          const trimmed = tag.trim();
          if (trimmed) set.add(trimmed);
        });
      }
    });
    return Array.from(set).sort();
  }, [projects]);

  // Extract all unique tech stack entries
  const allTechStack = useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => {
      if (Array.isArray(p.tech_stack)) {
        p.tech_stack.forEach((tech) => {
          const trimmed = tech.trim();
          if (trimmed) set.add(trimmed);
        });
      }
    });
    return Array.from(set).sort();
  }, [projects]);

  // Filter and sort projects
  const filteredProjects = useMemo(() => {
    let result = [...projects];

    // 1. Filter by category tag
    if (selectedTag !== 'All') {
      result = result.filter(
        (p) => Array.isArray(p.tags) && p.tags.includes(selectedTag)
      );
    }

    // 2. Filter by tech stack
    if (selectedTech !== 'All') {
      result = result.filter(
        (p) => Array.isArray(p.tech_stack) && p.tech_stack.includes(selectedTech)
      );
    }

    // 3. Sort
    result.sort((a, b) => {
      if (sortBy === 'featured') {
        // Pinned first, then newest date
        if (a.is_pinned && !b.is_pinned) return -1;
        if (!a.is_pinned && b.is_pinned) return 1;
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }

      if (sortBy === 'date_desc') {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }

      if (sortBy === 'date_asc') {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      }

      if (sortBy === 'views_desc') {
        return (b.views || 0) - (a.views || 0);
      }

      return 0;
    });

    return result;
  }, [projects, selectedTag, selectedTech, sortBy]);

  const hasActiveFilters = selectedTag !== 'All' || selectedTech !== 'All' || sortBy !== 'featured';

  const resetFilters = () => {
    setSelectedTag('All');
    setSelectedTech('All');
    setSortBy('featured');
  };

  return (
    <div className="space-y-8">
      {/* Filters & Sorting Controls */}
      <div className="space-y-5 pb-8 border-b border-outline-variant mb-10">
        {/* Category Tag Pills (if tags exist) */}
        {allTags.length > 0 && (
          <div>
            {/* <div className="flex items-center gap-2 mb-2.5">
              <span className="font-mono text-xs tracking-wider text-on-surface-variant font-semibold">
                Categories:
              </span>
            </div> */}
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setSelectedTag('All')}
                className={`px-3.5 py-1.5 rounded-full font-mono text-xs transition-colors cursor-pointer ${selectedTag === 'All'
                  ? 'bg-primary text-on-primary font-bold shadow-xs'
                  : 'bg-surface-container text-on-surface hover:bg-surface-container-high border border-outline-variant/60'
                  }`}
              >
                All ({projects.length})
              </button>
              {allTags.map((tag) => {
                const count = projects.filter((p) => p.tags?.includes(tag)).length;
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setSelectedTag(tag)}
                    className={`px-3.5 py-1.5 rounded-full font-mono text-xs transition-colors cursor-pointer ${selectedTag === tag
                      ? 'bg-primary text-on-primary font-bold shadow-xs'
                      : 'bg-surface-container text-on-surface hover:bg-surface-container-high border border-outline-variant/60'
                      }`}
                  >
                    {tag} ({count})
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Dropdowns Row: Tech Stack & Sort By */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
          <div className="flex flex-wrap items-center gap-3">
            {/* Tech Stack Selector */}
            {allTechStack.length > 0 && (
              <div className="flex items-center gap-2">
                <label htmlFor="tech-filter" className="font-mono text-xs text-on-surface-variant shrink-0">
                  Tech:
                </label>
                <select
                  id="tech-filter"
                  value={selectedTech}
                  onChange={(e) => setSelectedTech(e.target.value)}
                  className="bg-surface-container border border-outline-variant/60 rounded-xl px-3 py-1.5 font-mono text-xs text-on-surface focus:outline-none focus:border-primary cursor-pointer"
                >
                  <option value="All">All Technologies</option>
                  {allTechStack.map((tech) => (
                    <option key={tech} value={tech}>
                      {tech}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Sort Selector */}
            <div className="flex items-center gap-2">
              <label htmlFor="sort-selector" className="font-mono text-xs text-on-surface-variant shrink-0">
                Sort:
              </label>
              <select
                id="sort-selector"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="bg-surface-container border border-outline-variant/60 rounded-xl px-3 py-1.5 font-mono text-xs text-on-surface focus:outline-none focus:border-primary cursor-pointer"
              >
                <option value="featured">Featured / Newest</option>
                <option value="views_desc">Most Viewed</option>
                <option value="date_desc">Date (Newest first)</option>
                <option value="date_asc">Date (Oldest first)</option>
              </select>
            </div>
          </div>

          {/* Results count & Persistent Reset Button */}
          <div className="flex items-center justify-between sm:justify-end gap-3 text-xs font-mono text-on-surface-variant">
            <span>
              Showing {filteredProjects.length} of {projects.length}
            </span>
            <button
              type="button"
              onClick={resetFilters}
              disabled={!hasActiveFilters}
              title={hasActiveFilters ? 'Reset filters' : 'No filters active'}
              aria-label="Reset filters"
              className={`w-7 h-7 rounded-lg border transition-all inline-flex items-center justify-center shrink-0 ${hasActiveFilters
                ? 'text-primary border-primary/30 bg-primary/10 hover:bg-primary/20 hover:border-primary/50 cursor-pointer shadow-2xs'
                : 'text-on-surface-variant/30 border-outline-variant/30 bg-surface-container-low/30 cursor-not-allowed opacity-40'
                }`}
            >
              <span className="material-symbols-rounded text-[18px]">restart_alt</span>
            </button>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="bg-surface-container-lowest border border-outline-variant rounded-[32px] p-12 text-center">
          <span className="material-symbols-rounded text-4xl text-on-surface-variant mb-3 block">
            filter_list_off
          </span>
          <h3 className="font-headline-md text-headline-md text-on-surface mb-2">
            No matching projects
          </h3>
          <p className="font-body-md text-body-md text-on-surface-variant mb-6">
            Try choosing a different category or clearing active filters.
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="bg-primary text-on-primary font-label-lg px-6 py-2.5 rounded-full hover:bg-primary/90 transition-colors inline-flex items-center gap-2 cursor-pointer"
          >
            <span className="material-symbols-rounded text-[20px]">restart_alt</span>
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
          {filteredProjects.map((project) => (
            <Link
              key={project.slug}
              href={`/projects/${project.slug}`}
              className="block h-full group"
            >
              <div className="bg-surface-container-lowest border border-outline-variant rounded-[32px] p-7 md:p-8 hover:border-outline hover:shadow-lg transition-all duration-300 h-full flex flex-col">
                {/* Zone 1: Top Bar (Icon + Date & Pin) */}
                <div className="flex justify-between items-start mb-5">
                  <ProjectIcon
                    appIconUrl={project.app_icon_url}
                    icon={project.icon}
                    title={project.title}
                    className="w-13 h-13 rounded-2xl bg-surface-container-high border border-outline-variant/60 flex items-center justify-center text-on-surface group-hover:scale-105 transition-transform shadow-xs"
                    iconClassName="text-[26px]"
                  />

                  <div className="flex items-center gap-2.5">
                    {project.is_pinned && (
                      <span
                        className="w-7 h-7 rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center justify-center shrink-0"
                        title="Featured project"
                      >
                        <span className="material-symbols-rounded text-[15px]">push_pin</span>
                      </span>
                    )}
                    <span className="font-mono text-xs text-on-surface-variant">
                      {new Date(project.date).toLocaleDateString('en-US', {
                        timeZone: 'UTC',
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </div>

                {/* Zone 2: Content Body (Category Tags, Title, Description) */}
                {Array.isArray(project.tags) && project.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-2.5">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-primary/10 text-primary border border-primary/20 px-2.5 py-0.5 rounded-full font-mono text-[10px] font-semibold tracking-wide uppercase"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                <h2 className="font-headline-md text-headline-md mb-2 text-[22px] leading-snug text-on-surface group-hover:text-primary transition-colors">
                  {project.title}
                </h2>

                <p className="font-body-md text-body-md text-on-surface-variant mb-6 flex-grow line-clamp-3">
                  {project.short_description}
                </p>

                {/* Zone 3: Footer Bar (Tech Stack on Left + Views & Arrow on Right) */}
                <div className="flex items-center justify-between gap-3 mt-auto pt-4 border-t border-outline-variant/40">
                  <div className="flex flex-wrap gap-1.5">
                    {project.tech_stack?.slice(0, 3).map((tech: string) => (
                      <span
                        key={tech}
                        className="bg-surface-container border border-outline-variant/60 px-2.5 py-1 rounded-lg font-mono text-[11px] text-on-surface-variant"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.tech_stack && project.tech_stack.length > 3 && (
                      <span className="font-mono text-[10px] text-on-surface-variant self-center px-1">
                        +{project.tech_stack.length - 3}
                      </span>
                    )}
                  </div>

                  <div
                    className="flex items-center gap-1 font-mono text-xs text-on-surface-variant shrink-0"
                    title={`${project.views ?? 0} views`}
                  >
                    <span className="material-symbols-rounded text-[15px]">visibility</span>
                    <span>{project.views ?? 0}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
