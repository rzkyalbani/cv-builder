'use client';

import { useState, useEffect } from 'react';
import { ResumeContent } from '@/types/resume';
import PersonalDetailsForm from '@/app/components/editor/forms/PersonalDetailsForm';
import ResumePreview from '@/app/components/preview/ResumePreview';

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
        </div>

        {/* Right Panel: Live Preview Area */}
        <div className="w-1/2 bg-gray-200 overflow-y-auto p-6 flex justify-center items-start">
          <ResumePreview data={resumeData} />
        </div>
      </div>
    </div>
  );
}