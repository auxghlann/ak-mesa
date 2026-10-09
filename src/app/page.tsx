import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { experiences, educations, skills, personalInfo, certifications } from '@/data/resumeData';
import ProjectsSection from '@/components/sections/ProjectsSection';
import ExperienceSection from '@/components/sections/ExperienceSection';
import EducationSection from '@/components/sections/EducationSection';
import CertificationsSection from '@/components/sections/CertificationsSection';
import SkillsSection from '@/components/sections/SkillsSection';

import { cacheLife, cacheTag } from 'next/cache';

async function getPinnedProjects() {
  'use cache';
  cacheLife('hours');
  cacheTag('projects');

  const { data, error } = await supabase
    .from('projects')
    .select('slug, title, date, icon, short_description, tech_stack, views, tags, app_icon_url')
    .eq('is_pinned', true)
    .eq('is_visible', true)
    .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching pinned projects:', error.message);
    return [];
  }
  return data || [];
}

export default async function HomePage() {
  const pinnedProjects = await getPinnedProjects();

  return (
    <div className="flex flex-col gap-20 py-12 md:py-16 max-w-4xl mx-auto">
      {/* Hero Section */}
      <section className="min-h-[calc(100vh-6rem)] flex flex-col justify-center" id="home">
        <div className="flex flex-col md:flex-row items-center gap-10 md:gap-14">
          <div className="shrink-0">
            <Image
              src="/assets/profile.jpg"
              alt={personalInfo.name}
              width={288}
              height={288}
              className="w-52 h-52 md:w-64 md:h-64 lg:w-72 lg:h-72 rounded-[24px] object-cover shadow-md border-2 border-outline-variant"
              priority
            />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h1 className="font-headline-xl text-headline-xl mb-3">
              {personalInfo.name}<span className="text-primary"></span>
            </h1>
            <h2 className="font-headline-md text-headline-md text-on-surface-variant mb-5 font-normal">
              {personalInfo.headline}
            </h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant mb-8 max-w-2xl mx-auto md:mx-0">
              A recent Cum Laude Computer Science graduate and a passionate developer who aims to build AI-powered applications that actually help people.
            </p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-2 text-sm text-on-surface-variant font-sans">
              <a
                href={`mailto:${personalInfo.email}`}
                className="inline-flex items-center gap-1.5 hover:text-primary transition-colors group"
              >
                <span className="material-symbols-rounded text-on-surface-variant group-hover:text-primary text-[18px] group-hover:scale-110 transition-transform">mail</span>
                <span>{personalInfo.email}</span>
              </a>

              <span className="text-outline-variant select-none hidden sm:inline">|</span>

              <a
                href={`https://${personalInfo.github}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 hover:text-primary transition-colors group"
              >
                <svg className="w-[17px] h-[17px] text-on-surface-variant group-hover:text-primary fill-current shrink-0 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
                <span>{personalInfo.github}</span>
              </a>

              <span className="text-outline-variant select-none hidden sm:inline">|</span>

              <a
                href={`https://${personalInfo.linkedin}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 hover:text-primary transition-colors group"
              >
                <svg className="w-[17px] h-[17px] text-on-surface-variant group-hover:text-primary fill-current shrink-0 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                </svg>
                <span>{personalInfo.linkedin}</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <ProjectsSection projects={pinnedProjects} />

      {/* Experience Section */}
      <ExperienceSection experiences={experiences} />

      {/* Education Section */}
      <EducationSection educations={educations} />

      {/* Certifications Section */}
      <CertificationsSection certifications={certifications} />

      {/* Skills Section */}
      <SkillsSection skills={skills} />
    </div>
  );
}
