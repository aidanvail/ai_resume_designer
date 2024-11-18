import { Input } from '@/components/ui/input';
import type { TemplateProps } from './types';
import { Textarea } from '@/components/ui/textarea';


export function ProfessionalTemplate({ resumeData, isEditing, updateField }: TemplateProps) {
  const renderMarkdown = (text: string): string => {
    if (!text) return '';
    
    return text
      .split('\n')
      .map(line => {
        // Convert bold text
        line = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        
        // Convert bullet points
        if (line.trim().startsWith('- ')) {
          line = `<br/>• ${line.substring(2)}`;
        }
        return line;
      })
      .join('\n');
  };
  
  const renderInput = ({ 
    value, 
    onChange, 
    multiline = false,
    className = "",
    link = false,
    ariaLabel = ""
  }: { 
    value: string, 
    onChange: (value: string) => void,
    multiline?: boolean,
    className?: string,
    link?: boolean,
    ariaLabel?: string
  }) => {
    if (!isEditing) {
      if (link) {
        return (
          <a 
            href={value} 
            target="_blank" 
            rel="noopener noreferrer" 
            className={`hover:text-blue-700 ${className}`}
            aria-label={ariaLabel}
          >
            {value}
          </a>
        );
      }
      
      return (
        <div 
          className={className}
          dangerouslySetInnerHTML={{ __html: renderMarkdown(value) }}
        />
      );
    }

    if (multiline) {
      return (
        <Textarea
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full min-h-[60px] ${className}`}
          aria-label={ariaLabel}
        />
      );
    }

    return (
      <Input
        type="text"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className={`focus-visible:ring-2 ${className}`}
        aria-label={ariaLabel}
      />
    );
  };

  const hasContent = (section: unknown): boolean => {
    if (!section) return false;
    if (Array.isArray(section)) return section.length > 0;
    if (typeof section === 'object' && section !== null) {
      return Object.values(section).some(value => 
        typeof value === 'string' ? value.trim() !== '' : Boolean(value)
      );
    }
    return typeof section === 'string' ? section.trim() !== '' : Boolean(section);
  };

  return (
    <div className="max-w-[21cm] mx-auto bg-white px-8">
      {/* Personal Details Section */}
      <div className="mb-8">
        <div className="flex justify-between w-full">
          <div className="flex flex-col">
            <h1 className="text-4xl font-bold text-gray-800 text-center">
              {renderInput({
                value: resumeData.personalDetails.fullName,
                onChange: (value) => updateField('personalDetails', null, 'fullName', value),
                className: "text-left",
                ariaLabel: "Full name"
              })}
            </h1>
            <p>
            {renderInput({
                value: resumeData.jobTitle,
                onChange: (value) => updateField('jobTitle',null, 'jobTitle', value),
                className: "text-left text-black",
                ariaLabel: "Job Title"
              })}
            </p>
          </div>
          <div className="text-right text-gray-600 text-sm flex flex-col">
          {resumeData.personalDetails.email && (
            <div className="items-center gap-1 mx-2">
              {renderInput({
                value: resumeData.personalDetails.email,
                onChange: (value) => updateField('personalDetails', null, 'email', value),
                className: "inline-block",
                ariaLabel: "Email address"
              })}
            </div>
          )}
          {resumeData.personalDetails.phone && (
            <div className="items-center gap-1 mx-2">
              {renderInput({
                value: resumeData.personalDetails.phone,
                onChange: (value) => updateField('personalDetails', null, 'phone', value),
                className: "inline-block",
                ariaLabel: "Phone number"
              })}
            </div>
          )}
          {resumeData.personalDetails.location && (
            <div className="items-center gap-1 mx-2">
              {renderInput({
                value: resumeData.personalDetails.location,
                onChange: (value) => updateField('personalDetails', null, 'location', value),
                className: "inline-block",
                ariaLabel: "Location"
              })}
            </div>
          )}
          {resumeData.personalDetails.linkedin && (
            <div className="items-center gap-1 mx-2">
              {renderInput({
                value: resumeData.personalDetails.linkedin,
                onChange: (value) => updateField('personalDetails', null, 'linkedin', value),
                className: "text-blue-600 hover:underline inline-block text-sm",
                link: true,
                ariaLabel: "LinkedIn profile"
              })}
            </div>
          )}
          {resumeData.personalDetails.github && (
            <div className="items-center gap-1 mx-2">
              {renderInput({
                value: resumeData.personalDetails.github,
                onChange: (value) => updateField('personalDetails', null, 'github', value),
                className: "text-blue-600 hover:underline inline-block text-sm",
                link: true,
                ariaLabel: "GitHub profile"
              })}
            </div>
          )}
        </div>
        </div>
      </div>

      {/* Professional Summary */}
      {hasContent(resumeData.objective) && (
        <div className="mb-6 text-black">
          <div className="flex items-center gap-2 text-lg font-semibold mb-3 border-b-2 border-black pb-1">
            <h2 className='text-center w-full'>Professional Summary</h2>
          </div>
          {renderInput({
            value: resumeData.objective,
            onChange: (value) => updateField('objective', null, 'objective', value),
            multiline: true,
            className: "text-gray-700 text-sm leading-relaxed text-justify",
            ariaLabel: "Professional summary"
          })}
        </div>
      )}

      {/* Work Experience Section */}
      {hasContent(resumeData.workExperience) && (
        <div className="mb-6 text-black">
          <div className="flex items-center gap-2 text-lg font-semibold mb-3 border-b-2 border-black pb-1">
            <h2 className='text-center w-full'>Work Experience</h2>
          </div>
          {resumeData.workExperience.map((experience, index) => (
            <div 
            key={index} 
            className={`pb-4 ${
              index !== resumeData.workExperience.length - 1 
                ? "mb-4 border-b-2 border-dashed border-gray-300" 
                : "last:mb-0"
              }`}
            >
              <div className="flex justify-between items-start mb-1">
                <div className="flex-1">
                  {renderInput({
                    value: experience.jobTitle,
                    onChange: (value) => updateField('workExperience', index, 'jobTitle', value),
                    className: "font-semibold text-gray-800",
                    ariaLabel: "Job title"
                  })}
                </div>
                <div className="text-black italic text-sm flex items-center gap-1">
                  {renderInput({
                    value: experience.startDate,
                    onChange: (value) => updateField('workExperience', index, 'startDate', value),
                    ariaLabel: "Start date"
                  })}
                  <span>-</span>
                  {renderInput({
                    value: experience.endDate,
                    onChange: (value) => updateField('workExperience', index, 'endDate', value),
                    ariaLabel: "End date"
                  })}
                </div>
              </div>
              <div className="flex flex-col">
                {renderInput({
                  value: experience.companyName,
                  onChange: (value) => updateField('workExperience', index, 'companyName', value),
                  className: "text-black font-medium text-sm mb-1",
                  ariaLabel: "Company name"
                })}
                {renderInput({
                  value: experience.description,
                  onChange: (value) => updateField('workExperience', index, 'description', value),
                  multiline: true,
                  className: "text-gray-600 text-sm ml-4 text-justify",
                  ariaLabel: "Job description"
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Projects Section */}
      {hasContent(resumeData.projects) && (
        <div className="mb-6 text-black">
          <div className="flex items-center gap-2 text-lg font-semibold mb-3 border-b-2 border-black pb-1">
            <h2 className='text-center w-full'>Projects</h2>
          </div>
          {resumeData.projects.map((project, index) => (
            <div 
            key={index} 
            className={`pb-4 ${
              index !== resumeData.projects.length - 1 
                ? "mb-4 border-b-2 border-dashed border-gray-300" 
                : "last:mb-0"
              }`}
              >
              <div className="flex items-center justify-between mb-1">
                {renderInput({
                  value: project.projectName,
                  onChange: (value) => updateField('projects', index, 'projectName', value),
                  className: "font-semibold text-black",
                  ariaLabel: "Project name"
                })}
                {project.link && renderInput({
                  value: project.link,
                  onChange: (value) => updateField('projects', index, 'link', value),
                  className: "text-blue-600 hover:underline text-sm italic",
                  link: true,
                  ariaLabel: "Project link"
                })}
              </div>
              {renderInput({
                value: project.description,
                onChange: (value) => updateField('projects', index, 'description', value),
                multiline: true,
                className: "text-gray-600 text-sm ml-4 text-justify",
                ariaLabel: "Project description"
              })}
            </div>
          ))}
        </div>
      )}

      {/* Education Section */}
      {hasContent(resumeData.education) && (
        <div className="mb-6 text-black">
          <div className="flex items-center gap-2 text-lg font-semibold mb-3 border-b-2 border-black pb-1">
            <h2 className='text-center w-full'>Education</h2>
          </div>
          {resumeData.education.map((edu, index) => (
            <div key={index} className="mb-4 last:mb-0">
              <div className="flex justify-between items-start">
                {renderInput({
                  value: edu.degree,
                  onChange: (value) => updateField('education', index, 'degree', value),
                  className: "font-semibold text-gray-800",
                  ariaLabel: "Degree"
                })}
                <div className="text-black italic text-sm flex items-center gap-1">
                  {renderInput({
                    value: edu.startDate,
                    onChange: (value) => updateField('education', index, 'startDate', value),
                    ariaLabel: "Start date"
                  })}
                  <span>-</span>
                  {renderInput({
                    value: edu.endDate,
                    onChange: (value) => updateField('education', index, 'endDate', value),
                    ariaLabel: "End date"
                  })}
                </div>
              </div>
              {renderInput({
                value: edu.institution,
                onChange: (value) => updateField('education', index, 'institution', value),
                className: "text-black font-medium text-sm",
                ariaLabel: "Institution"
              })}
              {edu.grade && (
                <div className="text-gray-600 text-sm">
                  GPA: {renderInput({
                    value: edu.grade,
                    onChange: (value) => updateField('education', index, 'grade', value),
                    className: "ml-1 inline-block w-16",
                    ariaLabel: "GPA"
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Skills Section */}
      {hasContent(resumeData.skills) && (
        <div className="mb-6 text-black">
          <div className="flex items-center gap-2 text-lg font-semibold mb-3 border-b-2 border-black pb-1">
            <h2 className='text-center w-full'>Technical Skills</h2>
          </div>
          <div className="space-y-2">
            {resumeData.skills.map((categoryGroup, index) => (
              <div key={index} className="flex items-start">
                {renderInput({
                  value: categoryGroup.category,
                  onChange: (value) => updateField('skills', index, 'category', value),
                  className: "text-black text-sm font-semibold",
                  ariaLabel: "Skill category"
                })}
                <span className="text-gray-800 text-sm font-semibold mx-2">:</span>
                {renderInput({
                  value: categoryGroup.skills,
                  onChange: (value) => updateField('skills', index, 'skills', value),
                  className: "text-gray-700 text-sm",
                  ariaLabel: "Skills"
                })}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications Section */}
      {hasContent(resumeData.certifications) && (
        <div className="mb-6 text-black">
          <div className="flex items-center gap-2 text-lg font-semibold mb-3 border-b-2 border-black pb-1">
            <h2 className='text-center w-full'>Certifications</h2>
          </div>
          {resumeData.certifications.map((cert, index) => (
            <div key={index} className="mb-3 last:mb-0">
              <div className="flex justify-between items-start">
                {renderInput({
                  value: cert.certificationName,
                  onChange: (value) => updateField('certifications', index, 'certificationName', value),
                  className: "font-medium text-gray-800 text-sm",
                  ariaLabel: "Certification name"
                })}
                <div className="flex items-center gap-1">
                  {renderInput({
                    value: cert.issueDate,
                    onChange: (value) => updateField('certifications', index, 'issueDate', value),
                    className: "text-gray-600 italic text-sm",
                    ariaLabel: "Certification date"
                  })}
                </div>
              </div>
              <div className="flex items-center gap-1">
                {renderInput({
                  value: cert.issuingOrganization,
                  onChange: (value) => updateField('certifications', index, 'issuingOrganization', value),
                  className: "text-gray-600 text-sm",
                  ariaLabel: "Issuing organization"
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Languages Section */}
      {hasContent(resumeData.languages) && (
        <div className="mb-6 text-black">
          <div className="flex items-center gap-2 text-lg font-semibold mb-3 border-b-2 border-black pb-1">
            <h2 className='text-center w-full'>Languages</h2>
          </div>
          <div className="flex flex-col space-y-2">
            {resumeData.languages.map((language, index) => (
              <div key={index} className="text-sm flex items-center gap-2 p-2 rounded-md">
                {renderInput({
                  value: language.language,
                  onChange: (value) => updateField('languages', index, 'language', value),
                  className: "font-medium text-gray-800",
                  ariaLabel: "Language name"
                })}
                <span>-</span>
                {renderInput({
                  value: language.proficiency,
                  onChange: (value) => updateField('languages', index, 'proficiency', value),
                  className: "text-gray-600",
                  ariaLabel: "Language proficiency"
                })}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
