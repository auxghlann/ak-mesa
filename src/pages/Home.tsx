import { experiences, educations, skills, personalInfo, certifications } from '../data/resumeData';
import { Timeline, TimelineItem } from '../components/Timeline';
import Chip from '../components/Chip';
import profilePic from '../assets/profile.jpg';

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      {/* Hero Section */}
      <section className="mb-20">
        <div className="flex flex-col sm:flex-row sm:items-center gap-8 mb-8">
          <img src={profilePic} alt={personalInfo.name} className="w-32 h-32 rounded-full border-4 border-white shadow-sm object-cover shrink-0" />
          <div>
            <h1 className="text-5xl font-display font-bold text-gray-900 mb-4 tracking-tight">
              Hi, I'm {personalInfo.name} <span className="text-google-blue">.</span>
            </h1>
            <h2 className="text-2xl text-on-surface-variant font-light">
              {personalInfo.headline}
            </h2>
          </div>
        </div>
        <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mb-8">
          A passionate developer that aims to build AI-powered applications that actually help people.
        </p>
        <div className="flex flex-wrap gap-4">
          <a href={`mailto:${personalInfo.email}`} className="flex items-center gap-2 bg-blue-50 text-google-blue hover:bg-google-blue hover:text-black px-6 py-3 rounded-full font-medium transition-colors shadow-sm hover:shadow-md">
            <span className="material-symbols-rounded text-[20px]">mail</span>
            Contact Me
          </a>
          <a href={`https://${personalInfo.github}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 px-6 py-3 rounded-full font-medium transition-colors">
            <span className="material-symbols-rounded text-[20px]">code</span>
            GitHub
          </a>
          <a href={`https://${personalInfo.linkedin}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 px-6 py-3 rounded-full font-medium transition-colors">
            <span className="material-symbols-rounded text-[20px]">link</span>
            LinkedIn
          </a>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Column: Experience & Education */}
        <div className="lg:col-span-2 space-y-16">
          <section>
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-blue-50 rounded-2xl text-google-blue">
                <span className="material-symbols-rounded text-3xl">work</span>
              </div>
              <h2 className="text-3xl font-display font-bold">Experience</h2>
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
                  <ul className="list-disc pl-4 space-y-2 text-gray-600">
                    {exp.description.map((desc, i) => (
                      <li key={i}>{desc}</li>
                    ))}
                  </ul>
                </TimelineItem>
              ))}
            </Timeline>
          </section>

          <section>
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-green-50 rounded-2xl text-google-green">
                <span className="material-symbols-rounded text-3xl">school</span>
              </div>
              <h2 className="text-3xl font-display font-bold">Education</h2>
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
                  <p className="font-medium text-gray-800">{edu.honors}</p>
                </TimelineItem>
              ))}
            </Timeline>
          </section>
        </div>

        {/* Sidebar Column: Skills & Certifications */}
        <div className="space-y-12">
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-yellow-50 rounded-2xl text-google-yellow">
                <span className="material-symbols-rounded text-3xl">bolt</span>
              </div>
              <h2 className="text-2xl font-display font-bold">Skills Matrix</h2>
            </div>
            <div className="space-y-8">
              {skills.map((skillGroup, idx) => {
                const colorMap = ['blue', 'green', 'red'] as const;
                const chipColor = colorMap[idx % colorMap.length];

                return (
                  <div key={skillGroup.category}>
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
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
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-red-50 rounded-2xl text-google-red">
                <span className="material-symbols-rounded text-3xl">workspace_premium</span>
              </div>
              <h2 className="text-2xl font-display font-bold">Certifications</h2>
            </div>
            <ul className="space-y-4">
              {certifications.map((cert) => {
                const CardContent = (
                  <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm group-hover:-translate-y-1 group-hover:shadow-md transition-all relative">
                    <h4 className="font-medium text-gray-900 leading-tight pr-6">{cert.name}</h4>
                    <p className="text-sm text-gray-500 mt-1">
                      {cert.issuer} {cert.date && `• ${cert.date}`}
                    </p>
                    {cert.link && (
                      <span className="material-symbols-rounded text-gray-300 group-hover:text-google-blue absolute top-4 right-4 text-lg transition-colors">
                        open_in_new
                      </span>
                    )}
                  </div>
                );

                return (
                  <li key={cert.id} className="group">
                    {cert.link ? (
                      <a href={cert.link} target="_blank" rel="noreferrer" className="block outline-none focus-visible:ring-2 focus-visible:ring-google-blue rounded-2xl">
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
    </div>
  );
}
