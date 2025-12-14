import { ResumeContent } from '@/types/resume';

interface ResumePreviewProps {
  data: ResumeContent;
}

export default function ResumePreview({ data }: ResumePreviewProps) {
  const { personalDetail } = data;

  // A4 dimensions: 210mm x 297mm (ratio: 1:1.414)
  return (
    <div className="w-full max-w-[210mm] bg-white shadow-lg border border-gray-300" style={{ aspectRatio: '1/1.414' }}>
      <div className="p-8 h-full">
        {/* Header section - Personal Details */}
        <div className="border-b border-gray-200 pb-6 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {personalDetail.fullName || 'Your Name'}
              </h1>
              <h2 className="text-xl text-gray-700 mt-2">
                {personalDetail.headline || 'Professional Title'}
              </h2>
            </div>
            {personalDetail.photoUrl && (
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-300">
                <img 
                  src={personalDetail.photoUrl} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <div>
              {personalDetail.email && (
                <p className="text-gray-600">
                  <span className="font-medium">Email:</span> {personalDetail.email}
                </p>
              )}
              {personalDetail.phone && (
                <p className="text-gray-600 mt-1">
                  <span className="font-medium">Phone:</span> {personalDetail.phone}
                </p>
              )}
            </div>
            <div>
              {personalDetail.address && (
                <p className="text-gray-600">
                  <span className="font-medium">Address:</span> {personalDetail.address}
                </p>
              )}
            </div>
          </div>

          {/* Social Links */}
          <div className="flex flex-wrap gap-4 mt-4">
            {personalDetail.socialLinks?.linkedin && (
              <a 
                href={personalDetail.socialLinks.linkedin} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                LinkedIn
              </a>
            )}
            {personalDetail.socialLinks?.github && (
              <a 
                href={personalDetail.socialLinks.github} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                GitHub
              </a>
            )}
            {personalDetail.socialLinks?.portfolio && (
              <a 
                href={personalDetail.socialLinks.portfolio} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Portfolio
              </a>
            )}
            {personalDetail.socialLinks?.twitter && (
              <a 
                href={personalDetail.socialLinks.twitter} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Twitter
              </a>
            )}
          </div>
        </div>

        {/* Render sections */}
        {data.sections.map((section) => {
          if (!section.isVisible) return null;

          switch (section.type) {
            case 'experience':
              return (
                <div key={section.id} className="mt-6">
                  <h2 className="text-xl font-bold text-gray-900 border-b border-gray-300 pb-2 mb-4">
                    {section.title}
                  </h2>
                  <div className="space-y-4">
                    {section.items.map((item: any) => (
                      <div key={item.id} className="pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                        <div className="flex justify-between">
                          <h3 className="text-lg font-semibold text-gray-900">{item.role}</h3>
                          <div className="text-gray-600">
                            {item.startDate && <span>{item.startDate}</span>}
                            {item.startDate && item.endDate && <span> - </span>}
                            {item.endDate ? (
                              <span>{item.endDate}</span>
                            ) : item.currentlyWorking ? (
                              <span>Present</span>
                            ) : null}
                          </div>
                        </div>
                        <p className="text-gray-700 font-medium">{item.company}</p>
                        <p className="text-gray-600 mt-2">{item.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            case 'education':
              return (
                <div key={section.id} className="mt-6">
                  <h2 className="text-xl font-bold text-gray-900 border-b border-gray-300 pb-2 mb-4">
                    {section.title}
                  </h2>
                  <div className="space-y-4">
                    {section.items.map((item: any) => (
                      <div key={item.id} className="pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                        <div className="flex justify-between">
                          <h3 className="text-lg font-semibold text-gray-900">{item.degree}</h3>
                          <div className="text-gray-600">
                            {item.startDate && <span>{item.startDate}</span>}
                            {item.startDate && item.endDate && <span> - </span>}
                            {item.endDate && <span>{item.endDate}</span>}
                          </div>
                        </div>
                        <p className="text-gray-700 font-medium">{item.school}</p>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {item.city && <span className="text-gray-600">{item.city}</span>}
                          {item.gpa && <span className="text-gray-600">GPA: {item.gpa}</span>}
                        </div>
                        {item.description && <p className="text-gray-600 mt-2">{item.description}</p>}
                        {item.coursework && item.coursework.length > 0 && (
                          <p className="text-sm text-gray-500 mt-1">
                            <span className="font-medium">Relevant Coursework:</span> {item.coursework.join(', ')}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            case 'skills':
              return (
                <div key={section.id} className="mt-6">
                  <h2 className="text-xl font-bold text-gray-900 border-b border-gray-300 pb-2 mb-4">
                    {section.title}
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {section.items.map((item: any) => (
                      <span
                        key={item.id}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                      >
                        {item.name}
                        {item.level && <span className="ml-1">({item.level})</span>}
                      </span>
                    ))}
                  </div>
                </div>
              );
            case 'projects':
              return (
                <div key={section.id} className="mt-6">
                  <h2 className="text-xl font-bold text-gray-900 border-b border-gray-300 pb-2 mb-4">
                    {section.title}
                  </h2>
                  <div className="space-y-4">
                    {section.items.map((item: any) => (
                      <div key={item.id} className="pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                        <div className="flex justify-between">
                          <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                          {item.url ? (
                            <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                              {item.url}
                            </a>
                          ) : (
                            <div className="text-gray-600">
                              {item.startDate && <span>{item.startDate}</span>}
                              {item.startDate && item.endDate && <span> - </span>}
                              {item.endDate && <span>{item.endDate}</span>}
                            </div>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {item.technologies && item.technologies.map((tech: string, idx: number) => (
                            <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs">
                              {tech}
                            </span>
                          ))}
                        </div>
                        {item.description && <p className="text-gray-600 mt-2">{item.description}</p>}
                        {item.achievements && item.achievements.length > 0 && (
                          <ul className="list-disc list-inside text-gray-600 mt-1 ml-2">
                            {item.achievements.map((achievement: string, idx: number) => (
                              <li key={idx} className="text-sm">{achievement}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            case 'custom':
              return (
                <div key={section.id} className="mt-6">
                  <h2 className="text-xl font-bold text-gray-900 border-b border-gray-300 pb-2 mb-4">
                    {section.title}
                  </h2>
                  <div className="space-y-4">
                    {section.items.map((item: any) => (
                      <div key={item.id} className="pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                        <div className="flex justify-between">
                          <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                          <div className="text-gray-600">
                            {item.startDate && <span>{item.startDate}</span>}
                            {item.startDate && item.endDate && <span> - </span>}
                            {item.endDate && <span>{item.endDate}</span>}
                          </div>
                        </div>
                        {item.subtitle && <p className="text-gray-700 font-medium">{item.subtitle}</p>}
                        <div className="flex flex-wrap gap-2 mt-1">
                          {item.location && <span className="text-gray-600">{item.location}</span>}
                        </div>
                        {item.description && <p className="text-gray-600 mt-2">{item.description}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              );
            default:
              return (
                <div key={section.id} className="mt-6">
                  <h2 className="text-xl font-bold text-gray-900 border-b border-gray-300 pb-2 mb-4">
                    {section.title}
                  </h2>
                  <p className="text-gray-500 italic">Preview for this section is coming soon</p>
                </div>
              );
          }
        })}
      </div>
    </div>
  );
}