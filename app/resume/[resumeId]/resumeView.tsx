"use client";
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Edit, Save, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import html2pdf from 'html2pdf.js';
import type { ResumeData } from './types';
import { useSession } from 'next-auth/react';

export default function ResumeView({ 
  resumeData: initialResumeData,
  resumeId 
}: { 
  resumeData: ResumeData;
  resumeId: string;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [resumeData, setResumeData] = useState(initialResumeData);
  const [isSaving, setIsSaving] = useState(false);
  const { data: session } = useSession();

  const handleDownload = () => {
    const element = document.getElementById('resume-content');
    const opt = {
      margin: [0.2, 0.295, 0.3, 0.295], // 1cm top/bottom, 0.75cm left/right in inches
      filename: `${resumeData.personalDetails.fullName.replace(/\s+/g, '_')}_resume.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    
    html2pdf().set(opt).from(element).save();
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function flattenObject(obj: any, parentKey = ''): { [key: string]: any } {
    return Object.keys(obj).reduce((acc, key) => {
      const newKey = parentKey ? `${parentKey}.${key}` : key;
      
      if (Array.isArray(obj[key])) {
        return {
          ...acc,
          [newKey]: obj[key]
        };
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        return {
          ...acc,
          ...flattenObject(obj[key], newKey)
        };
      } else {
        return {
          ...acc,
          [newKey]: obj[key]
        };
      }
    }, {});
  }
  
  // Then update the handleSave function:
  const handleSave = async () => {
    try {
      setIsSaving(true);
      const userEmail = session?.user?.email;
      if (!userEmail) throw new Error('User email not found');
      
      const resumeRef = doc(db, `users/${userEmail}/resumes/${resumeId}`);
      const flattenedData = flattenObject(resumeData);
      
      await updateDoc(resumeRef, flattenedData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving resume:', error);
      alert('Failed to save changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const updateField = <T extends keyof ResumeData>(
    section: T,
    index: number | null,
    field: string,
    value: string
  ) => {
    setResumeData(prev => {
      if (index === null) {
        if (section === 'personalDetails') {
          return {
            ...prev,
            personalDetails: {
              ...prev.personalDetails,
              [field]: value
            }
          };
        }
        if (section === 'objective') {
          return {
            ...prev,
            objective: value
          };
        }
        return prev;
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const sectionArray = [...prev[section] as any[]];
      sectionArray[index] = { 
        ...sectionArray[index], 
        [field]: value 
      };

      return {
        ...prev,
        [section]: sectionArray
      };
    });
  };

  const EditableText = ({ 
    value, 
    onChange, 
    multiline = false,
    className = "" ,
    link = false,
  }: { 
    value: string, 
    onChange: (value: string) => void, 
    multiline?: boolean,
    className?: string,
    link?: boolean,
  }) => {
    if (!isEditing) return link ? <a href={value} target='_blank' className={className}>{value}</a> : <span className={className}>{value}</span>;
    
    if (multiline) {
      return (
        <textarea
        className={`flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
      />
      );
    }
    
    return (
      <Input
        value={value || ''}
        onChange={e => onChange(e.target.value)}
        className={className}
      />
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 py-4">
      {/* Action Buttons */}
      <div className="max-w-[21cm] mx-auto mb-4 flex justify-between items-center px-4">
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleDownload}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Download PDF
          </Button>
          {isEditing ? (
            <>
              <Button
                variant="default"
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setResumeData(initialResumeData);
                  setIsEditing(false);
                }}
                className="flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                Cancel
              </Button>
            </>
          ) : (
            <Button
              variant="outline"
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2"
            >
              <Edit className="h-4 w-4" />
              Edit Resume
            </Button>
          )}
        </div>
      </div>

      <div id="resume-content" className="max-w-[21cm] mx-auto bg-white shadow-lg p-6">
        {/* Personal Details Section */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 text-center mb-2">
            <EditableText
              value={resumeData.personalDetails.fullName}
              onChange={(value) => updateField('personalDetails', null, 'fullName', value)}
            />
          </h1>
          <div className="text-center text-gray-600 text-sm">
            <EditableText
              value={resumeData.personalDetails.email}
              onChange={(value) => updateField('personalDetails', null, 'email', value)}
              className="inline-block mx-2"
            />
            &#x2022;
            <EditableText
              value={resumeData.personalDetails.phone}
              onChange={(value) => updateField('personalDetails', null, 'phone', value)}
              className="inline-block mx-2"
            />
            &#x2022;
            <EditableText
              value={resumeData.personalDetails.location}
              onChange={(value) => updateField('personalDetails', null, 'location', value)}
              className="inline-block mx-2"
            />
          </div>
          <div className="text-center mt-1 text-gray-600">
            <EditableText
            value={resumeData.personalDetails.linkedin}
            onChange={(value) => updateField('personalDetails', null, 'linkedin', value)}
            className="text-blue-600 hover:underline inline-block mx-2 text-sm"
            link={true}
            />
            &#x2022;
            <EditableText
              value={resumeData.personalDetails.github}
              onChange={(value) => updateField('personalDetails', null, 'github', value)}
              className="text-blue-600 hover:underline inline-block mx-2 text-sm"
              link={true}
            />
          </div>
        </div>

        {/* Rest of the sections with modified styling */}
        {/* Objective Section */}
        <div className="mb-6">
          <h2 className="text-lg text-black font-semibold mb-2 border-b-2 border-black pb-1">Professional Summary</h2>
          <EditableText
            value={resumeData.objective}
            onChange={(value) => updateField('objective', null, 'objective', value)}
            multiline
            className="text-gray-600 text-sm"
          />
        </div>

        {/* Work Experience Section */}
        <div className="mb-6">
          <h2 className="text-lg text-black font-semibold mb-2 border-b-2 border-black pb-1">Work Experience</h2>
          {resumeData.workExperience.map((experience, index) => (
            <div key={index} className="mb-4 last:mb-0">
              <div className="flex justify-between items-start">
                <EditableText
                  value={experience.jobTitle}
                  onChange={(value) => updateField('workExperience', index, 'jobTitle', value)}
                  className="font-semibold text-black text-md"
                />
                <div className="text-gray-500 text-sm">
                  <EditableText
                    value={experience.startDate}
                    onChange={(value) => updateField('workExperience', index, 'startDate', value)}
                    className="inline"
                  />
                  <span> - </span>
                  <EditableText
                    value={experience.endDate}
                    onChange={(value) => updateField('workExperience', index, 'endDate', value)}
                    className="inline"
                  />
                </div>
              </div>
              <div className="flex flex-col">
                <EditableText
                    value={experience.companyName}
                    onChange={(value) => updateField('workExperience', index, 'companyName', value)}
                    className="text-gray-600  text-sm font-bold"
                    />
                <EditableText
                    value={experience.description}
                    onChange={(value) => updateField('workExperience', index, 'description', value)}
                    multiline
                    className="text-gray-600 text-sm mt-1 ml-2"
                    />
              </div>
            </div>
          ))}
        </div>

        {/* Projects Section */}
        <div className="mb-6">
        <h2 className="text-lg text-black font-semibold mb-2 border-b-2 border-black pb-1">Projects</h2>
        {resumeData.projects.map((project, index) => (
            <div key={index} className="mb-4 last:mb-0">
            <div className="flex justify-between items-start">
                <EditableText
                value={project.projectName}
                onChange={(value) => updateField('projects', index, 'projectName', value)}
                className="font-semibold text-black text-md"
                />
                <EditableText
                value={project.link}
                onChange={(value) => updateField('projects', index, 'link', value)}
                className="text-blue-600 hover:underline text-sm"
                />
            </div>
            <EditableText
                value={project.description}
                onChange={(value) => updateField('projects', index, 'description', value)}
                multiline
                className="text-gray-600 text-sm mt-1 ml-2"
            />
            </div>
        ))}
        </div>

        {/* Education Section */}
        <div className="mb-6">
        <h2 className="text-lg text-black font-semibold mb-2 border-b-2 border-black pb-1">Education</h2>
        {resumeData.education.map((edu, index) => (
            <div key={index} className="mb-4 last:mb-0">
            <div className="flex justify-between items-start">
                <EditableText
                value={edu.degree}
                onChange={(value) => updateField('education', index, 'degree', value)}
                className="font-semibold text-black text-md"
                />
                <div className="text-gray-500 text-sm">
                <EditableText
                    value={edu.startDate}
                    onChange={(value) => updateField('education', index, 'startDate', value)}
                    className="inline"
                />
                <span> - </span>
                <EditableText
                    value={edu.endDate}
                    onChange={(value) => updateField('education', index, 'endDate', value)}
                    className="inline"
                />
                </div>
            </div>
            <div className="flex flex-col">
                <EditableText
                    value={edu.institution}
                    onChange={(value) => updateField('education', index, 'institution', value)}
                    className="text-gray-600 text-sm"
                    />
                    <p className='text-gray-600 text-sm'>   
                        CGPA: 
                    <EditableText
                        value={edu.grade}
                        onChange={(value) => updateField('education', index, 'grade', value)}
                        className="text-gray-600 text-sm mt-1"
                    />
                    </p>
                </div>
            </div>
        ))}
        </div>

        {/* Skills Section */}
        <div className="mb-6">
        <h2 className="text-lg text-black font-semibold mb-2 border-b-2 border-black pb-1">Technical Skills</h2>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            {resumeData.skills.map((skill, index) => (
            <div key={index} className="flex justify-between items-center">
                <EditableText
                value={skill.skill}
                onChange={(value) => updateField('skills', index, 'skill', value)}
                className="text-gray-700 text-sm font-medium"
                />
                <EditableText
                value={skill.proficiency}
                onChange={(value) => updateField('skills', index, 'proficiency', value)}
                className="text-gray-600 text-sm"
                />
            </div>
            ))}
        </div>
        </div>

        {/* Languages Section */}
        <div className="mb-6">
        <h2 className="text-lg text-black font-semibold mb-2 border-b-2 border-black pb-1">Languages</h2>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 auto-rows-auto">
            {resumeData.languages.slice(0, 6).map((language, index) => (
            <div key={index} className="flex justify-between items-center">
                <EditableText
                value={language.language}
                onChange={(value) => updateField('languages', index, 'language', value)}
                className="text-gray-700 text-sm font-medium"
                />
                <EditableText
                value={language.proficiency}
                onChange={(value) => updateField('languages', index, 'proficiency', value)}
                className="text-gray-600 text-sm"
                />
            </div>
            ))}
        </div>
        </div>

        {/* Certifications Section */}
        <div className="mb-6">
            <h2 className="text-lg text-black font-semibold mb-2 border-b-2 border-black pb-1">Certifications</h2>
            {resumeData.certifications.map((cert, index) => (
                <div key={index} className="mb-4 last:mb-0">
                    <div className="flex justify-between items-start">
                        <EditableText
                        value={cert.certificationName}
                        onChange={(value) => updateField('certifications', index, 'certificationName', value)}
                        className="font-semibold text-black text-sm"
                        />
                        <EditableText
                        value={cert.issueDate}
                        onChange={(value) => updateField('certifications', index, 'issueDate', value)}
                        className="text-gray-500 text-sm"
                        />
                    </div>
                    <EditableText
                        value={cert.issuingOrganization}
                        onChange={(value) => updateField('certifications', index, 'issuingOrganization', value)}
                        className="text-gray-600 text-sm"
                    />
                </div>
            ))}
        </div>
    </div>
    </div>
    );
    }