'use client';

import { useState, useEffect, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Save, Download, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ResumeContent } from '@/types/resume';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { ScrollArea } from '@/app/components/ui/scroll-area';
import { Separator } from '@/app/components/ui/separator';
import { EditorSidebar } from '@/app/components/editor/EditorSidebar';
import ResumePreview from '@/app/components/preview/ResumePreview';
import { ClientOnlyDnDWrapper } from '@/app/components/editor/ClientOnlyDnDWrapper';
import { DropResult } from '@hello-pangea/dnd';
import {
  PanelResizeHandle,
  Panel,
  PanelGroup
} from 'react-resizable-panels';

interface ResumeEditorProps {
  initialData: ResumeContent;
  resumeId: string;
}

export default function ResumeEditor({ initialData, resumeId }: ResumeEditorProps) {
  const [resumeData, setResumeData] = useState<ResumeContent>(initialData);
  const [savingStatus, setSavingStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [isMounted, setIsMounted] = useState(false);
  const componentRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: `${resumeData.title || "Resume"}-${resumeId}`,
    pageStyle: `
      @page {
        size: auto;
        margin: 0mm;
      }
    `
  });

  useEffect(() => {
    setResumeData(initialData);
  }, [initialData]);

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

  // Handle drag end for both sections and items
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return; // dropped outside the list

    if (result.type === 'SECTION') {
      // Reorder the sections array
      const items = Array.from(resumeData.sections);
      const [reorderedItem] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, reorderedItem);

      setResumeData(prev => ({
        ...prev,
        sections: items
      }));
    } else if (result.type === 'ITEM') {
      // Reorder the items array within a section
      const sectionId = result.source.droppableId;
      const sectionIndex = resumeData.sections.findIndex(section => section.id === sectionId);

      if (sectionIndex === -1) return;

      const updatedSections = [...resumeData.sections];
      const items = Array.from(updatedSections[sectionIndex].items);
      const [reorderedItem] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, reorderedItem);

      updatedSections[sectionIndex] = {
        ...updatedSections[sectionIndex],
        items: items
      };

      setResumeData(prev => ({
        ...prev,
        sections: updatedSections
      }));
    }
  };

  // Handle section deletion
  const handleDeleteSection = (sectionId: string) => {
    const sectionToDelete = resumeData.sections.find(section => section.id === sectionId);
    const sectionTitle = sectionToDelete?.title || sectionToDelete?.type || 'section';

    const confirmed = window.confirm(`Are you sure you want to delete the "${sectionTitle}" section? This action cannot be undone.`);

    if (confirmed) {
      setResumeData(prev => ({
        ...prev,
        sections: prev.sections.filter(section => section.id !== sectionId)
      }));
    }
  };

  // Prevent hydration mismatch - return null on server
  if (!isMounted) {
    return (
      <div className="flex flex-col min-h-screen bg-white">
        {/* Header */}
        <header className="border-b border-slate-200 bg-white sticky top-0 z-10">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push('/dashboard')}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <Input
                type="text"
                value={resumeData.title ?? ""}
                onChange={(e) => updateTitle(e.target.value)}
                placeholder="Untitled Resume"
                className="w-64 border-none shadow-none focus-visible:ring-0 font-medium text-slate-900 bg-transparent placeholder:text-slate-400"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={handlePrint}
              >
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
              <Button
                onClick={handleSave}
                disabled={savingStatus === 'saving'}
              >
                <Save className="h-4 w-4 mr-2" />
                {savingStatus === 'saving' ? 'Saving...' : savingStatus === 'saved' ? 'Saved!' : 'Save'}
              </Button>
            </div>
          </div>
        </header>

        {/* Loading skeleton for content */}
        <PanelGroup direction="horizontal" className="flex flex-1">
          <Panel
            defaultSize={50}
            minSize={25}
            className="border-r border-slate-200 flex flex-col bg-white md:min-w-[320px]"
          >
            <div className="flex-1 p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-5/6 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-4/6"></div>
              </div>
            </div>
          </Panel>
          <PanelResizeHandle
            className="bg-slate-200 hover:bg-slate-300 transition-colors w-2 data-[panel-group-direction=vertical]:h-2 data-[panel-group-direction=vertical]:w-full data-[panel-group-direction=vertical]:min-h-0 data-[panel-group-direction=vertical]:min-w-full"
          />
          <Panel defaultSize={50} className="bg-slate-50 flex items-start justify-center">
            <div className="w-full max-w-[210mm] pt-4 pb-8 bg-white h-[842px] animate-pulse"></div>
          </Panel>
        </PanelGroup>
      </div>
    );
  }

  return (
    <ClientOnlyDnDWrapper onDragEnd={handleDragEnd}>
      <div className="flex flex-col min-h-screen bg-white">
        {/* Header */}
        <header className="border-b border-slate-200 bg-white sticky top-0 z-10">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push('/dashboard')}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <Separator orientation="vertical" className="h-6" />
              <Input
                type="text"
                value={resumeData.title ?? ""}
                onChange={(e) => updateTitle(e.target.value)}
                placeholder="Untitled Resume"
                className="w-64 border-none shadow-none focus-visible:ring-0 font-medium text-slate-900 bg-transparent placeholder:text-slate-400"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={handlePrint}
              >
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
              <Button
                onClick={handleSave}
                disabled={savingStatus === 'saving'}
              >
                <Save className="h-4 w-4 mr-2" />
                {savingStatus === 'saving' ? 'Saving...' : savingStatus === 'saved' ? 'Saved!' : 'Save'}
              </Button>
            </div>
          </div>
        </header>

        {/* Two-column layout - ALL inside DragDropContext */}
        <PanelGroup direction="horizontal" className="flex flex-1">
          {/* Left: Editor Sidebar */}
          <Panel
            defaultSize={40}
            minSize={25}
            className="border-r border-slate-200 flex flex-col bg-white md:min-w-[320px]"
          >
            <ScrollArea className="flex-1">
              <div className="p-6 text-slate-900">
                <EditorSidebar
                  resumeData={resumeData}
                  setResumeData={setResumeData}
                  onDeleteSection={handleDeleteSection}
                />
              </div>
            </ScrollArea>
          </Panel>

          <PanelResizeHandle
            className="bg-slate-200 hover:bg-slate-300 transition-colors w-2 data-[panel-group-direction=vertical]:h-2 data-[panel-group-direction=vertical]:w-full data-[panel-group-direction=vertical]:min-h-0 data-[panel-group-direction=vertical]:min-w-full"
          />

          {/* Right: Live Preview */}
          <Panel
            defaultSize={60}
            className="bg-slate-50 flex items-start justify-center"
          >
            <div className="w-full max-w-[210mm] pt-4 pb-8"> {/* Added pb-8 for bottom spacing */}
              <ResumePreview ref={componentRef} data={resumeData} />
            </div>
          </Panel>
        </PanelGroup>
      </div>
    </ClientOnlyDnDWrapper>
  );
}