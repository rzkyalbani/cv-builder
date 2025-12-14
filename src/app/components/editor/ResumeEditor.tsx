'use client';

import { useState, useEffect } from 'react';
import { ResumeContent, ResumeSection } from '@/types/resume';
import PersonalDetailsForm from '@/app/components/editor/forms/PersonalDetailsForm';
import ResumePreview from '@/app/components/preview/ResumePreview';
import ExperienceForm from '@/app/components/editor/forms/ExperienceForm';
import AddSection from '@/app/components/editor/AddSection';

interface ResumeEditorProps {
  initialData: ResumeContent;
  resumeId: string;
}

export default function ResumeEditor({ initialData, resumeId }: ResumeEditorProps) {
  const [resumeData, setResumeData] = useState<ResumeContent>(initialData);
  const [savingStatus, setSavingStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  useEffect(() => {
    setResumeData(initialData);
  }, [initialData]);

  const handlePersonalDetailsChange = (newData: any) => {
    setResumeData(prev => ({
      ...prev,
      personalDetail: { ...prev.personalDetail, ...newData }
    }));
  };

  const handleSectionChange = (index: number, newItems: any[]) => {
    setResumeData(prev => {
      const newSections = [...prev.sections];
      newSections[index] = {
        ...newSections[index],
        items: newItems
      };
      return { ...prev, sections: newSections };
    });
  };

  const handleAddSection = (type: 'experience' | 'education' | 'skills' | 'projects' | 'custom') => {
    // Check if this section type already exists
    const existingSection = resumeData.sections.find(section => section.type === type);

    if (existingSection) {
      // Optional: scroll to the existing section
      return;
    }

    const newSection: ResumeSection = {
      id: Date.now().toString(), // Simple ID generation
      type,
      title: type.charAt(0).toUpperCase() + type.slice(1),
      isVisible: true,
      columns: 1,
      items: [],
    };

    setResumeData(prev => ({
      ...prev,
      sections: [...prev.sections, newSection]
    }));
  };

  const renderSectionForm = (section: ResumeSection, index: number) => {
    switch (section.type) {
      case 'experience':
        return (
          <ExperienceForm
            items={section.items}
            onChange={(items) => handleSectionChange(index, items)}
          />
        );
      default:
        return (
          <div className="border border-gray-200 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {section.title || section.type.charAt(0).toUpperCase() + section.type.slice(1)}
            </h3>
            <p className="text-gray-500 italic">Form for this section type is coming soon</p>
          </div>
        );
    }
  };

  const handleSave = async () => {
    setSavingStatus('saving');

    try {
      const response = await fetch(`/api/resumes/${resumeId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: resumeData }),
      });

      if (!response.ok) {
        throw new Error('Failed to save resume');
      }

      setSavingStatus('saved');

      // Reset the saved status after 2 seconds
      setTimeout(() => {
        setSavingStatus('idle');
      }, 2000);
    } catch (error) {
      console.error('Error saving resume:', error);
      setSavingStatus('idle');
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header with Save button */}
      <header className="bg-white shadow py-4 px-6 flex justify-between items-center">
        <h1 className="text-xl font-semibold text-gray-800">Resume Editor</h1>
        <button
          onClick={handleSave}
          disabled={savingStatus === 'saving'}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {savingStatus === 'saving' ? 'Saving...' : savingStatus === 'saved' ? 'Saved!' : 'Save'}
        </button>
      </header>

      {/* Split layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel: Form Area */}
        <div className="w-1/2 bg-white overflow-y-auto p-6 border-r border-gray-200">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Edit Resume</h2>
          <PersonalDetailsForm
            data={resumeData.personalDetail}
            onChange={handlePersonalDetailsChange}
          />

          {/* Render existing sections */}
          {resumeData.sections.map((section, index) => (
            <div key={section.id}>
              {renderSectionForm(section, index)}
            </div>
          ))}

          {/* Add section component */}
          <AddSection onAddSection={handleAddSection} />
        </div>

        {/* Right Panel: Live Preview Area */}
        <div className="w-1/2 bg-gray-200 overflow-y-auto p-6 flex justify-center items-start">
          <ResumePreview data={resumeData} />
        </div>
      </div>
    </div>
  );
}