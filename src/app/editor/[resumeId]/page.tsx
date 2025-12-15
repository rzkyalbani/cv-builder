import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import ResumeEditor from '@/app/components/editor/ResumeEditorNew';
import { ResumeContent } from '@/types/resume';

interface PageProps {
  params: Promise<{ resumeId: string }>;
}

export default async function EditorPage({ params }: PageProps) {
  const { resumeId } = await params;
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    // In a real app, you might want to redirect to login
    return <div>Unauthorized</div>;
  }

  const resume = await prisma.resume.findUnique({
    where: {
      id: resumeId,
      userId: session.user.id, // Security check: ensure resume belongs to current user
    },
  });

  if (!resume) {
    return <div>Resume not found</div>; // Could be 404 page
  }

  // Safely cast the database content to ResumeContent, handling potential null values
  const resumeContent: ResumeContent = resume.content as unknown as ResumeContent || {
    personalDetail: {
      fullName: '',
      email: '',
      phone: '',
      headline: '',
      address: '',
      photoUrl: '',
      socialLinks: {
        linkedin: '',
        github: '',
        portfolio: '',
        twitter: '',
        website: '',
      },
    },
    sections: [],
  };

  return <ResumeEditor initialData={resumeContent} resumeId={resume.id} />;
}