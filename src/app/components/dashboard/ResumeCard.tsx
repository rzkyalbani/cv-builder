'use client';

import { useState } from 'react';
import { MoreVertical, Pencil, Copy, Trash2 } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/app/components/ui/alert-dialog';
import Link from 'next/link';
import { ResumeContent } from '@/types/resume';

interface ResumeCardProps {
  resume: {
    id: string;
    title: string;
    updatedAt: Date;
    content?: ResumeContent | any;
  };
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
}

export function ResumeCard({ resume, onDelete, onDuplicate }: ResumeCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Parse content safely
  const content = resume.content as ResumeContent | undefined;
  const personalDetail = content?.personalDetail;

  return (
    <>
      <div className="group relative flex flex-col rounded-lg border border-slate-200 bg-white hover:border-slate-300 hover:shadow-md transition-all duration-200">
        <Link
          href={`/editor/${resume.id}`}
          className="flex-1 p-6 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 rounded-lg"
        >
          {/* Mini Preview */}
          <div className="aspect-[210/297] mb-4 rounded border border-slate-200 bg-white overflow-hidden">
            <div className="scale-[0.25] origin-top-left w-[840px] h-[1188px] p-12 bg-white">
              {/* Header */}
              <div className="mb-6">
                <h1 className="text-4xl font-bold text-slate-900 truncate">
                  {personalDetail?.fullName || 'Your Name'}
                </h1>
                {personalDetail?.headline && (
                  <p className="text-lg text-slate-600 mt-2 truncate">
                    {personalDetail.headline}
                  </p>
                )}
                <div className="flex gap-4 mt-3 text-sm text-slate-600">
                  {personalDetail?.email && <span className="truncate">{personalDetail.email}</span>}
                  {personalDetail?.phone && <span className="truncate">{personalDetail.phone}</span>}
                </div>
              </div>
              
              {/* Sections Preview */}
              <div className="space-y-4">
                {content?.sections?.slice(0, 2).map((section) => (
                  <div key={section.id}>
                    <h2 className="text-xl font-semibold text-slate-900 uppercase tracking-wide border-b border-slate-300 pb-1 mb-2">
                      {section.title}
                    </h2>
                    <div className="text-sm text-slate-700">
                      {section.items?.length > 0 && (
                        <div className="space-y-2">
                          {section.items.slice(0, 2).map((item: any) => (
                            <div key={item.id} className="truncate">
                              {item.role || item.degree || item.title || item.name}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <h3 className="font-semibold text-slate-900 truncate mb-1">
            {resume.title}
          </h3>
          <p className="text-sm text-slate-500">
            {new Date(resume.updatedAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </p>
        </Link>

        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/editor/${resume.id}`} className="flex items-center gap-2 cursor-pointer">
                  <Pencil className="h-4 w-4" />
                  Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDuplicate(resume.id)}
                className="flex items-center gap-2 cursor-pointer"
              >
                <Copy className="h-4 w-4" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setShowDeleteDialog(true)}
                className="flex items-center gap-2 text-red-600 focus:text-red-600 cursor-pointer"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Resume</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{resume.title}&quot;? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                onDelete(resume.id);
                setShowDeleteDialog(false);
              }}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
