import { experiences, educations, skills, personalInfo, certifications } from '@/data/resumeData';
import { Timeline, TimelineItem } from '@/components/Timeline';
import Chip from '@/components/Chip';
import Image from 'next/image';
import profilePic from '@/assets/profile.jpg';

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="py-section-gap flex flex-col md:flex-row items-center gap-12 md:gap-gutter" id="home">
        <div className="shrink-0">
          <Image
            src={profilePic}
            alt={personalInfo.name}
            className="w-48 h-48 md:w-64 md:h-64 rounded-full object-cover shadow-lg border-4 border-surface-container-highest"
            priority
          />
        </div>
        <div className="flex-1 text-center md:text-left">
          <h1 className="font-headline-xl text-headline-xl mb-4">
            Hi, I'm {personalInfo.name}<span className="text-primary">.</span>
          </h1>
          <h2 className="font-headline-md text-headline-md text-on-surface-variant mb-6 font-normal">
            {personalInfo.headline}
          </h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant mb-8 max-w-2xl mx-auto md:mx-0">
            A recent Cum Laude Computer Science graduate and a passionate developer who aims to build AI-powered applications that actually help people.
          </p>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-3 gap-y-2 text-sm text-on-surface-variant font-sans">
            <a
              href={`mailto:${personalInfo.email}`}
              className="inline-flex items-center gap-1.5 hover:text-primary transition-colors group"
            >
              <span className="material-symbols-rounded text-[#ea4335] text-[18px] group-hover:scale-110 transition-transform">mail</span>
              <span>{personalInfo.email}</span>
            </a>

            <span className="text-outline-variant/60 select-none hidden sm:inline">|</span>

            <a
              href={`https://${personalInfo.github}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 hover:text-primary transition-colors group"
            >
              <svg className="w-[17px] h-[17px] text-[#24292f] fill-current shrink-0 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
              <span>{personalInfo.github}</span>
            </a>

            <span className="text-outline-variant/60 select-none hidden sm:inline">|</span>

            <a
              href={`https://${personalInfo.linkedin}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 hover:text-primary transition-colors group"
            >
              <svg className="w-[17px] h-[17px] text-[#0a66c2] fill-current shrink-0 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
              </svg>
              <span>{personalInfo.linkedin}</span>
            </a>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter py-section-gap">
        {/* Left Column: Experience & Education */}
        <div className="md:col-span-7 flex flex-col gap-16">
          <section>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-on-primary shadow-sm">
                <span className="material-symbols-rounded">work</span>
              </div>
              <h2 className="font-headline-lg text-headline-lg">Experience</h2>
            </div>
            <Timeline>
              {experiences.map((exp, index) => (
                <TimelineItem
                  key={exp.id}
                  title={exp.title}
                  subtitle={exp.company}
                  date={exp.date}
                  isLast={index === experiences.length - 1}
                >
                  <ul className="list-disc pl-5">
                    {exp.description.map((desc, i) => (
                      <li key={i}>{desc}</li>
                    ))}
                  </ul>
                </TimelineItem>
              ))}
            </Timeline>
          </section>

          <section>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center text-white shadow-sm">
                <span className="material-symbols-rounded">school</span>
              </div>
              <h2 className="font-headline-lg text-headline-lg">Education</h2>
            </div>
            <Timeline>
              {educations.map((edu, index) => (
                <TimelineItem
                  key={edu.id}
                  title={edu.degree}
                  subtitle={edu.institution}
                  date={edu.date}
                  isLast={index === educations.length - 1}
                >
                  <p className="font-medium text-on-surface-variant">{edu.honors}</p>
                </TimelineItem>
              ))}
            </Timeline>
          </section>
        </div>

        {/* Right Column: Skills & Certifications */}
        <div className="md:col-span-5 flex flex-col gap-16">
          <section>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-full bg-yellow-500 flex items-center justify-center text-white shadow-sm">
                <span className="material-symbols-rounded fill-current">bolt</span>
              </div>
              <h2 className="font-headline-lg text-headline-lg">Skills Matrix</h2>
            </div>
            <div className="space-y-8">
              {skills.map((skillGroup, idx) => {
                const colorMap = ['blue', 'red', 'yellow'] as const;
                const chipColor = colorMap[idx % colorMap.length];

                return (
                  <div key={skillGroup.category}>
                    <h3 className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-4">
                      {skillGroup.category}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {skillGroup.skills.map((skill) => (
                        <Chip key={skill} color={chipColor}>
                          {skill}
                        </Chip>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-on-secondary shadow-sm">
                <span className="material-symbols-rounded">workspace_premium</span>
              </div>
              <h2 className="font-headline-lg text-headline-lg">Certifications</h2>
            </div>
            <ul className="flex flex-col gap-4">
              {certifications.map((cert) => {
                const CardContent = (
                  <div className="bg-surface-container-lowest border border-outline-variant/50 rounded-[24px] p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <h3 className="font-headline-md text-[18px] leading-tight mb-2 text-on-surface">{cert.name}</h3>
                        <p className="font-body-sm text-on-surface-variant">
                          {cert.issuer} {cert.date && `• ${cert.date}`}
                        </p>
                      </div>
                      {cert.link && (
                        <span className="material-symbols-rounded text-outline hover:text-primary transition-colors">
                          open_in_new
                        </span>
                      )}
                    </div>
                  </div>
                );

                return (
                  <li key={cert.id} className="group">
                    {cert.link ? (
                      <a href={cert.link} target="_blank" rel="noreferrer" className="block outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-[24px]">
                        {CardContent}
                      </a>
                    ) : (
                      CardContent
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        </div>
      </div>
    </>
  );
}
