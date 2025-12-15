'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ResumeCard } from '@/app/components/dashboard/ResumeCard';
import { CreateResumeCard } from '@/app/components/dashboard/CreateResumeCard';
import { Navbar } from '@/app/components/layout/Navbar';
import { FileText } from 'lucide-react';

interface Resume {
  id: string;
  title: string;
  updatedAt: Date;
}

interface DashboardClientProps {
  resumes: Resume[];
}

export function DashboardClient({ resumes: initialResumes }: DashboardClientProps) {
  const [resumes, setResumes] = useState(initialResumes);
  const router = useRouter();

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/resumes/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setResumes(resumes.filter((r) => r.id !== id));
      }
    } catch (error) {
      console.error('Error deleting resume:', error);
    }
  };

  const handleDuplicate = async (id: string) => {
    try {
      const originalResume = resumes.find((r) => r.id === id);
      if (!originalResume) return;

      const response = await fetch('/api/resumes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          title: `${originalResume.title} (Copy)`,
          duplicateFrom: id 
        }),
      });

      if (response.ok) {
        router.refresh();
      }
    } catch (error) {
      console.error('Error duplicating resume:', error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 py-12">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-slate-900 mb-2">My Resumes</h1>
            <p className="text-slate-600">
              Create, manage, and organize your professional resumes
            </p>
          </div>

          {/* Empty State */}
          {resumes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
                <FileText className="h-8 w-8 text-slate-400" />
              </div>
              <h2 className="text-2xl font-semibold text-slate-900 mb-2">
                No resumes yet
              </h2>
              <p className="text-slate-500 mb-8 text-center max-w-md">
                Get started by creating your first resume. Build a professional CV in minutes.
              </p>
              <div className="w-full max-w-sm">
                <CreateResumeCard />
              </div>
            </div>
          ) : (
            /* Resume Grid */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <CreateResumeCard />
              {resumes.map((resume) => (
                <ResumeCard
                  key={resume.id}
                  resume={resume}
                  onDelete={handleDelete}
                  onDuplicate={handleDuplicate}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
