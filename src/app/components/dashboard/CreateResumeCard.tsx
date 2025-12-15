'use client';

import { Plus } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/app/components/ui/dialog';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function CreateResumeCard() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const router = useRouter();

  const handleCreate = async () => {
    if (!title.trim()) return;

    setIsCreating(true);
    try {
      const response = await fetch('/api/resumes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title.trim() }),
      });

      if (response.ok) {
        const data = await response.json();
        router.push(`/editor/${data.id}`);
      }
    } catch (error) {
      console.error('Error creating resume:', error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 hover:border-slate-400 hover:bg-slate-100 transition-colors duration-200 p-6 h-full min-h-[300px] focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-slate-900 mb-3">
            <Plus className="h-6 w-6 text-white" />
          </div>
          <h3 className="font-semibold text-slate-900">Create New Resume</h3>
          <p className="text-sm text-slate-500 mt-1">Start from scratch</p>
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Resume</DialogTitle>
          <DialogDescription>
            Give your resume a name. You can always change it later.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Resume Title</Label>
            <Input
              id="title"
              placeholder="e.g., Software Engineer Resume"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleCreate();
                }
              }}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={!title.trim() || isCreating}>
            {isCreating ? 'Creating...' : 'Create Resume'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
