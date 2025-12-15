import { forwardRef } from 'react';
import { ResumeContent } from '@/types/resume';

interface ClassicTemplateProps {
  data: ResumeContent;
}

const ClassicTemplate = forwardRef<HTMLDivElement, ClassicTemplateProps>(({ data }, ref) => {
  const { personalDetail } = data;

  // A4 dimensions: 210mm x 297mm
  return (
    <div
      ref={ref}
      id="resume-content"
      className="w-full bg-white shadow-md border border-slate-200 print:shadow-none print:m-0 print:border-none"
      style={{ minHeight: '297mm', width: '210mm' }}
    >
      <div className="p-12 print:p-8 font-serif">
        {/* Header - Personal Details - Centered */}
        <header className="mb-8 text-center">
          <div className="flex flex-col items-center">
            {personalDetail.photoUrl && (
              <img
                src={personalDetail.photoUrl}
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover border-2 border-slate-200 mb-4"
              />
            )}
            <h1 className="text-4xl font-bold text-slate-900 tracking-tight">
              {personalDetail.fullName || 'Your Name'}
            </h1>
            {personalDetail.headline && (
              <p className="text-lg text-slate-600 mt-2 font-serif">
                {personalDetail.headline}
              </p>
            )}
            
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-4 text-sm text-slate-600">
              {personalDetail.email && <span>{personalDetail.email}</span>}
              {personalDetail.phone && <span>{personalDetail.phone}</span>}
              {personalDetail.address && <span>{personalDetail.address}</span>}
            </div>

            {/* Social Links */}
            {(personalDetail.socialLinks?.linkedin || 
              personalDetail.socialLinks?.github || 
              personalDetail.socialLinks?.portfolio || 
              personalDetail.socialLinks?.twitter) && (
              <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-2 text-sm">
                {personalDetail.socialLinks?.linkedin && (
                  <a
                    href={personalDetail.socialLinks.linkedin}
                    className="text-slate-700 hover:text-slate-900 print:text-slate-700"
                  >
                    LinkedIn
                  </a>
                )}
                {personalDetail.socialLinks?.github && (
                  <a
                    href={personalDetail.socialLinks.github}
                    className="text-slate-700 hover:text-slate-900 print:text-slate-700"
                  >
                    GitHub
                  </a>
                )}
                {personalDetail.socialLinks?.portfolio && (
                  <a
                    href={personalDetail.socialLinks.portfolio}
                    className="text-slate-700 hover:text-slate-900 print:text-slate-700"
                  >
                    Portfolio
                  </a>
                )}
                {personalDetail.socialLinks?.twitter && (
                  <a
                    href={personalDetail.socialLinks.twitter}
                    className="text-slate-700 hover:text-slate-900 print:text-slate-700"
                  >
                    Twitter
                  </a>
                )}
              </div>
            )}
          </div>
        </header>

        {/* Horizontal line separator */}
        <div className="border-b border-slate-300 mb-8"></div>

        {/* Sections - Single Column */}
        <div className="space-y-8">
          {data.sections.map((section) => {
            if (!section.isVisible) return null;

            return (
              <section key={section.id}>
                <h2 className="text-xl font-bold text-slate-900 mb-4 font-serif uppercase tracking-wide">
                  {section.title}
                </h2>

                {section.type === 'experience' && (
                  <div className="space-y-6">
                    {section.items.map((item: any) => (
                      <div key={item.id} className="space-y-2">
                        <div className="flex justify-between items-baseline">
                          <h3 className="text-base font-semibold text-slate-900">{item.role}</h3>
                          <span className="text-sm text-slate-600 whitespace-nowrap">
                            {item.startDate} - {item.currentlyWorking ? 'Present' : item.endDate}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-slate-700">{item.company}</p>
                        {item.description && (
                          <p className="text-sm text-slate-600 leading-relaxed">{item.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {section.type === 'education' && (
                  <div className="space-y-6">
                    {section.items.map((item: any) => (
                      <div key={item.id} className="space-y-2">
                        <div className="flex justify-between items-baseline">
                          <h3 className="text-base font-semibold text-slate-900">{item.degree}</h3>
                          <span className="text-sm text-slate-600 whitespace-nowrap">
                            {item.startDate} - {item.endDate}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-slate-700">{item.school}</p>
                        <div className="flex gap-3 text-sm text-slate-600">
                          {item.city && <span>{item.city}</span>}
                          {item.gpa && <span>GPA: {item.gpa}</span>}
                        </div>
                        {item.description && (
                          <p className="text-sm text-slate-600 leading-relaxed">{item.description}</p>
                        )}
                        {item.coursework && item.coursework.length > 0 && (
                          <p className="text-sm text-slate-600">
                            <span className="font-medium">Coursework:</span> {item.coursework.join(', ')}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {section.type === 'skills' && (
                  <div className="space-y-1">
                    {section.items.map((item: any) => (
                      <span
                        key={item.id}
                        className="text-sm text-slate-700 after:content-['•'] after:ml-2 last:after:content-none"
                      >
                        {item.name}
                        {item.level && ` (${item.level})`}
                      </span>
                    ))}
                  </div>
                )}

                {section.type === 'projects' && (
                  <div className="space-y-6">
                    {section.items.map((item: any) => (
                      <div key={item.id} className="space-y-2">
                        <div className="flex justify-between items-baseline">
                          <h3 className="text-base font-semibold text-slate-900">{item.title}</h3>
                          {(item.startDate || item.endDate) && (
                            <span className="text-sm text-slate-600 whitespace-nowrap">
                              {item.startDate} {item.endDate && `- ${item.endDate}`}
                            </span>
                          )}
                        </div>
                        {item.technologies && item.technologies.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {item.technologies.map((tech: string, idx: number) => (
                              <span key={idx} className="text-xs text-slate-600 bg-slate-100 px-2 py-1 rounded">
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}
                        {item.description && (
                          <p className="text-sm text-slate-600 leading-relaxed">{item.description}</p>
                        )}
                        {item.achievements && item.achievements.length > 0 && (
                          <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                            {item.achievements.map((achievement: string, idx: number) => (
                              <li key={idx}>{achievement}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {section.type === 'custom' && (
                  <div className="space-y-6">
                    {section.items.map((item: any) => (
                      <div key={item.id} className="space-y-2">
                        <div className="flex justify-between items-baseline">
                          <h3 className="text-base font-semibold text-slate-900">{item.title}</h3>
                          {(item.startDate || item.endDate) && (
                            <span className="text-sm text-slate-600 whitespace-nowrap">
                              {item.startDate} {item.endDate && `- ${item.endDate}`}
                            </span>
                          )}
                        </div>
                        {item.subtitle && (
                          <p className="text-sm font-medium text-slate-700">{item.subtitle}</p>
                        )}
                        {item.location && (
                          <p className="text-sm text-slate-600">{item.location}</p>
                        )}
                        {item.description && (
                          <p className="text-sm text-slate-600 leading-relaxed">{item.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Horizontal line separator between sections */}
                <div className="border-b border-slate-200 mt-8"></div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
});

ClassicTemplate.displayName = 'ClassicTemplate';

export default ClassicTemplate;
