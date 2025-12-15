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

interface ResumeEditorProps {
  initialData: ResumeContent;
  resumeId: string;
}

export default function ResumeEditor({ initialData, resumeId }: ResumeEditorProps) {
  const [resumeData, setResumeData] = useState<ResumeContent>(initialData);
  const [savingStatus, setSavingStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const componentRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

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

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
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

      {/* Two-column layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Editor Sidebar */}
        <aside className="w-[480px] border-r border-slate-200 flex flex-col bg-white">
          <ScrollArea className="flex-1">
            <div className="p-6 text-slate-900">
              <EditorSidebar
                resumeData={resumeData}
                setResumeData={setResumeData}
              />
            </div>
          </ScrollArea>
        </aside>

        {/* Right: Live Preview */}
        <main className="flex-1 bg-slate-50 overflow-y-auto">
          <div className="flex justify-center py-8 px-6">
            <div className="w-full max-w-[210mm]">
              <ResumePreview ref={componentRef} data={resumeData} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
