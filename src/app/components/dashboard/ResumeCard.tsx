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

interface ResumeCardProps {
  resume: {
    id: string;
    title: string;
    updatedAt: Date;
  };
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
}

export function ResumeCard({ resume, onDelete, onDuplicate }: ResumeCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  return (
    <>
      <div className="group relative flex flex-col rounded-lg border border-slate-200 bg-white hover:border-slate-300 hover:shadow-md transition-all duration-200">
        <Link
          href={`/editor/${resume.id}`}
          className="flex-1 p-6 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 rounded-lg"
        >
          <div className="aspect-[210/297] mb-4 rounded border border-slate-200 bg-slate-50 flex items-center justify-center">
            <span className="text-slate-400 text-sm">Resume Preview</span>
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
