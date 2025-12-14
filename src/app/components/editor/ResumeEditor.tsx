'use client';

import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { ResumeContent, ResumeSection } from '@/types/resume';
import PersonalDetailsForm from '@/app/components/editor/forms/PersonalDetailsForm';
import ResumePreview from '@/app/components/preview/ResumePreview';
import ExperienceForm from '@/app/components/editor/forms/ExperienceForm';
import EducationForm from '@/app/components/editor/forms/EducationForm';
import SkillsForm from '@/app/components/editor/forms/SkillsForm';
import ProjectsForm from '@/app/components/editor/forms/ProjectsForm';
import CustomSectionForm from '@/app/components/editor/forms/CustomSectionForm';
import AddSection from '@/app/components/editor/AddSection';
import SectionWrapper from '@/app/components/editor/SectionWrapper';

interface ResumeEditorProps {
  initialData: ResumeContent;
  resumeId: string;
}

export default function ResumeEditor({ initialData, resumeId }: ResumeEditorProps) {
  const [resumeData, setResumeData] = useState<ResumeContent>(initialData);
  const [savingStatus, setSavingStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [activeSection, setActiveSection] = useState<string | null>('personal-details');

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
      setActiveSection(existingSection.id);
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

    // Set the new section as active
    setActiveSection(newSection.id);
  };

  const handleSectionToggle = (sectionId: string) => {
    setActiveSection(activeSection === sectionId ? null : sectionId);
  };

  const handleDeleteSection = (sectionId: string) => {
    setResumeData(prev => ({
      ...prev,
      sections: prev.sections.filter(section => section.id !== sectionId)
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
      case 'education':
        return (
          <EducationForm
            items={section.items}
            onChange={(items) => handleSectionChange(index, items)}
          />
        );
      case 'skills':
        return (
          <SkillsForm
            items={section.items}
            onChange={(items) => handleSectionChange(index, items)}
          />
        );
      case 'projects':
        return (
          <ProjectsForm
            items={section.items}
            onChange={(items) => handleSectionChange(index, items)}
          />
        );
      case 'custom':
        return (
          <CustomSectionForm
            items={section.items}
            onChange={(items) => handleSectionChange(index, items)}
            title={section.title}
          />
        );
      default:
        return (
          <div>
            <p className="text-gray-500 italic">Form for this section type is coming soon</p>
          </div>
        );
    }
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return; // dropped outside the list

    const items = Array.from(resumeData.sections);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setResumeData(prev => ({
      ...prev,
      sections: items
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
        body: JSON.stringify({
          content: resumeData,
          title: resumeData.title
        }),
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

  const updateTitle = (newTitle: string) => {
    setResumeData(prev => ({
      ...prev,
      title: newTitle
    }));
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header with Save button and editable title */}
      <header className="bg-white shadow py-4 px-6 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold text-gray-800">Resume Editor</h1>
          <input
            type="text"
            value={resumeData.title ?? ""}
            onChange={(e) => updateTitle(e.target.value)}
            placeholder="Untitled Resume"
            className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>
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

          {/* Personal Details Section with SectionWrapper */}
          <SectionWrapper
            title="Personal Details"
            isOpen={activeSection === 'personal-details'}
            onToggle={() => setActiveSection(activeSection === 'personal-details' ? null : 'personal-details')}
          >
            <PersonalDetailsForm
              data={resumeData.personalDetail}
              onChange={handlePersonalDetailsChange}
            />
          </SectionWrapper>

          {/* Render existing sections with Drag & Drop functionality */}
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="sections">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {resumeData.sections.map((section, index) => (
                    <Draggable key={section.id} draggableId={section.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`${snapshot.isDragging ? 'shadow-lg rounded-md' : ''}`}
                        >
                          <SectionWrapper
                            title={section.title || section.type.charAt(0).toUpperCase() + section.type.slice(1)}
                            isOpen={activeSection === section.id}
                            onToggle={() => handleSectionToggle(section.id)}
                            onDelete={() => handleDeleteSection(section.id)}
                            canDelete={true}
                            dragHandleProps={provided.dragHandleProps} // Pass the drag handle props
                          >
                            {renderSectionForm(section, index)}
                          </SectionWrapper>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>

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