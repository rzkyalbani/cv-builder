'use client';

import { ResumeContent, ResumeSection } from '@/types/resume';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/app/components/ui/accordion';
import PersonalDetailsForm from '@/app/components/editor/forms/PersonalDetailsForm';
import ExperienceForm from '@/app/components/editor/forms/ExperienceForm';
import EducationForm from '@/app/components/editor/forms/EducationForm';
import SkillsForm from '@/app/components/editor/forms/SkillsForm';
import ProjectsForm from '@/app/components/editor/forms/ProjectsForm';
import CustomSectionForm from '@/app/components/editor/forms/CustomSectionForm';
import { Button } from '@/app/components/ui/button';
import { Plus } from 'lucide-react';

interface EditorSidebarProps {
  resumeData: ResumeContent;
  setResumeData: React.Dispatch<React.SetStateAction<ResumeContent>>;
}

export function EditorSidebar({ resumeData, setResumeData }: EditorSidebarProps) {
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
    const existingSection = resumeData.sections.find(section => section.type === type);
    if (existingSection) return;

    const newSection: ResumeSection = {
      id: Date.now().toString(),
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
            items={section.items as any}
            onChange={(items) => handleSectionChange(index, items)}
            droppableId={section.id}
          />
        );
      case 'education':
        return (
          <EducationForm
            items={section.items as any}
            onChange={(items) => handleSectionChange(index, items)}
            droppableId={section.id}
          />
        );
      case 'skills':
        return (
          <SkillsForm
            items={section.items as any}
            onChange={(items) => handleSectionChange(index, items)}
            droppableId={section.id}
          />
        );
      case 'projects':
        return (
          <ProjectsForm
            items={section.items as any}
            onChange={(items) => handleSectionChange(index, items)}
            droppableId={section.id}
          />
        );
      case 'custom':
        return (
          <CustomSectionForm
            items={section.items as any}
            onChange={(items) => handleSectionChange(index, items)}
            title={section.title}
            droppableId={section.id}
          />
        );
      default:
        return <div className="text-slate-500 text-sm">Form coming soon</div>;
    }
  };

  const availableSections = [
    { type: 'experience' as const, label: 'Experience' },
    { type: 'education' as const, label: 'Education' },
    { type: 'skills' as const, label: 'Skills' },
    { type: 'projects' as const, label: 'Projects' },
    { type: 'custom' as const, label: 'Custom Section' },
  ];

  const existingSectionTypes = resumeData.sections.map(s => s.type);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-slate-900 mb-1">Edit Resume</h2>
        <p className="text-sm text-slate-500">Build your resume section by section</p>
      </div>

      <Accordion type="multiple" className="space-y-2">
        {/* Personal Details Section */}
        <AccordionItem value="personal-details" className="border border-slate-200 rounded-lg px-4 bg-white">
          <AccordionTrigger className="hover:no-underline">
            <span className="font-medium text-slate-900">Personal Details</span>
          </AccordionTrigger>
          <AccordionContent>
            <PersonalDetailsForm
              data={resumeData.personalDetail}
              onChange={handlePersonalDetailsChange}
            />
          </AccordionContent>
        </AccordionItem>

        {/* Dynamic Sections */}
        {resumeData.sections.map((section, index) => (
          <AccordionItem
            key={section.id}
            value={section.id}
            className="border border-slate-200 rounded-lg px-4 bg-white"
          >
            <AccordionTrigger className="hover:no-underline">
              <span className="font-medium text-slate-900">
                {section.title || section.type.charAt(0).toUpperCase() + section.type.slice(1)}
              </span>
            </AccordionTrigger>
            <AccordionContent>
              {renderSectionForm(section, index)}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      {/* Add Section */}
      <div className="pt-4">
        <p className="text-sm font-medium text-slate-700 mb-3">Add Section</p>
        <div className="flex flex-wrap gap-2">
          {availableSections.map(({ type, label }) => (
            <Button
              key={type}
              variant="outline"
              size="sm"
              onClick={() => handleAddSection(type)}
              disabled={existingSectionTypes.includes(type) && type !== 'custom'}
              className="text-xs"
            >
              <Plus className="h-3 w-3 mr-1" />
              {label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
