import { experiences, educations, skills, personalInfo, certifications } from '../data/resumeData';
import { Timeline, TimelineItem } from '../components/Timeline';
import Chip from '../components/Chip';
import profilePic from '../assets/profile.jpg';

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <section className="py-section-gap flex flex-col md:flex-row items-center gap-12 md:gap-gutter" id="home">
        <div className="shrink-0">
          <img src={profilePic} alt={personalInfo.name} className="w-48 h-48 md:w-64 md:h-64 rounded-full object-cover shadow-lg border-4 border-surface-container-highest" />
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
          <div className="flex flex-wrap justify-center md:justify-start gap-4">
            <a href={`mailto:${personalInfo.email}`} className="inline-flex items-center gap-2 bg-primary-fixed text-on-primary-fixed px-6 py-3 rounded-full font-label-lg text-label-lg hover:bg-primary-container transition-colors shadow-sm">
              <span className="material-symbols-rounded text-[20px]">mail</span>
              Contact Me
            </a>
            <a href={`https://${personalInfo.github}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 border border-outline text-on-surface px-6 py-3 rounded-full font-label-lg text-label-lg hover:bg-surface-container transition-colors">
              <span className="material-symbols-rounded text-[20px]">code</span>
              GitHub
            </a>
            <a href={`https://${personalInfo.linkedin}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 border border-outline text-on-surface px-6 py-3 rounded-full font-label-lg text-label-lg hover:bg-surface-container transition-colors">
              <span className="material-symbols-rounded text-[20px]">link</span>
              LinkedIn
            </a>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter py-section-gap">
        {/* Left Column: Experience & Education */}
        <div className="md:col-span-7 flex flex-col gap-16">
          <section>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-full bg-primary-fixed flex items-center justify-center text-primary">
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
              <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface">
                <span className="material-symbols-rounded text-green-600">school</span>
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
              <div className="w-12 h-12 rounded-full bg-yellow-50 flex items-center justify-center text-yellow-600">
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
              <div className="w-12 h-12 rounded-full bg-secondary-fixed flex items-center justify-center text-secondary">
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
