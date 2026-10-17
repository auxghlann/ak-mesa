import { describe, it, expect } from 'vitest';
import type { ProjectItem } from '../src/components/projects/ProjectsFilterableList';
import { extractProjectImages } from '../src/components/projects/ProjectContentViewer';

describe('Project Features & Filtering Logic', () => {
  const mockProjects: ProjectItem[] = [
    {
      slug: 'project-a',
      title: 'AI Agent Alpha',
      date: '2026-03-01',
      short_description: 'An AI assistant for automating workflows.',
      tech_stack: ['Python', 'FastAPI', 'LangChain'],
      tags: ['AI & Agents', 'Automation'],
      views: 120,
      is_pinned: true,
      app_icon_url: 'https://example.com/icon-a.png',
    },
    {
      slug: 'project-b',
      title: 'Data Pipeline Beta',
      date: '2026-01-15',
      short_description: 'ETL pipeline processing event streams.',
      tech_stack: ['Python', 'Polars', 'Airflow'],
      tags: ['Data Engineering'],
      views: 450,
      is_pinned: false,
    },
    {
      slug: 'project-c',
      title: 'Web Portal Gamma',
      date: '2026-02-10',
      short_description: 'Full-stack developer dashboard.',
      tech_stack: ['TypeScript', 'React', 'TailwindCSS'],
      tags: ['Web Apps'],
      views: 85,
      is_pinned: false,
    },
  ];

  it('should filter projects by category tag', () => {
    const aiProjects = mockProjects.filter((p) => p.tags?.includes('AI & Agents'));
    expect(aiProjects.length).toBe(1);
    expect(aiProjects[0].slug).toBe('project-a');

    const dataProjects = mockProjects.filter((p) => p.tags?.includes('Data Engineering'));
    expect(dataProjects.length).toBe(1);
    expect(dataProjects[0].slug).toBe('project-b');
  });

  it('should filter projects by tech stack', () => {
    const pythonProjects = mockProjects.filter((p) => p.tech_stack?.includes('Python'));
    expect(pythonProjects.length).toBe(2);

    const reactProjects = mockProjects.filter((p) => p.tech_stack?.includes('React'));
    expect(reactProjects.length).toBe(1);
    expect(reactProjects[0].slug).toBe('project-c');
  });

  it('should sort projects by view count in descending order', () => {
    const sorted = [...mockProjects].sort((a, b) => (b.views || 0) - (a.views || 0));
    expect(sorted[0].slug).toBe('project-b'); // 450 views
    expect(sorted[1].slug).toBe('project-a'); // 120 views
    expect(sorted[2].slug).toBe('project-c'); // 85 views
  });

  it('should sort projects by date in descending order', () => {
    const sorted = [...mockProjects].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    expect(sorted[0].slug).toBe('project-a'); // March 2026
    expect(sorted[1].slug).toBe('project-c'); // Feb 2026
    expect(sorted[2].slug).toBe('project-b'); // Jan 2026
  });

  it('should prioritize pinned projects when sorting by featured', () => {
    const sorted = [...mockProjects].sort((a, b) => {
      if (a.is_pinned && !b.is_pinned) return -1;
      if (!a.is_pinned && b.is_pinned) return 1;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
    expect(sorted[0].slug).toBe('project-a'); // is_pinned is true
  });

  it('should filter out hidden projects when is_visible is false', () => {
    const projectsWithHidden: ProjectItem[] = [
      ...mockProjects,
      {
        slug: 'hidden-project',
        title: 'Hidden Draft Project',
        date: '2026-03-02',
        short_description: 'Work in progress.',
        is_visible: false,
      },
    ];

    const visibleOnly = projectsWithHidden.filter((p) => p.is_visible !== false);
    expect(visibleOnly.length).toBe(3);
    expect(visibleOnly.some((p) => p.slug === 'hidden-project')).toBe(false);
  });

  it('should extract images from gallery array and markdown content', () => {
    const gallery = ['https://example.com/ss1.png', 'https://example.com/ss2.png'];
    const markdown = `
# Project Title
Here is an architectural diagram:
![Architecture Diagram](https://example.com/arch.png)

And an embedded screenshot:
<img src="https://example.com/dashboard.png" alt="Dashboard View" />

Duplicate reference should be ignored:
![Duplicate Architecture](https://example.com/arch.png)
`;
    const images = extractProjectImages(markdown, gallery, 'Test Project');
    expect(images).toEqual([
      { src: 'https://example.com/ss1.png', alt: 'Test Project screenshot 1' },
      { src: 'https://example.com/ss2.png', alt: 'Test Project screenshot 2' },
      { src: 'https://example.com/arch.png', alt: 'Architecture Diagram' },
      { src: 'https://example.com/dashboard.png', alt: 'Dashboard View' },
    ]);
  });

  it('should parse project-showcase markdown frontmatter and body into ak-mesa schema', async () => {
    const { parseShowcaseMarkdown } = await import('../scripts/syncShowcase');
    const fixture = `---
slug: test-project
title: Test Project
date: 2026-10-12
icon: terminal
short_description: Concise overview of test project
tags:
  - AI & Agents
  - Web Apps
tech_stack:
  - FastAPI
  - TypeScript
links:
  github: https://github.com/example/test
  livePreview: null
ai_summary: Test summary for AI retrieval
---

Content body here without H1 header.`;

    const parsed = parseShowcaseMarkdown(fixture);
    expect(parsed.slug).toBe('test-project');
    expect(parsed.tags).toEqual(['AI & Agents', 'Web Apps']);
    expect(parsed.tech_stack).toContain('FastAPI');
    expect(parsed.links.github).toBe('https://github.com/example/test');
    expect(parsed.links.livePreview).toBeNull();
    expect(parsed.ai_summary).toBe('Test summary for AI retrieval');
    expect(parsed.content).toBe('Content body here without H1 header.');
  });
});

