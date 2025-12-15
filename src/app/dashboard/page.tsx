import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import  prisma  from '@/lib/prisma';
import { DashboardClient } from './DashboardClient';

async function getResumes() {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    throw new Error('User not authenticated');
  }

  const resumes = await prisma.resume.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      updatedAt: 'desc',
    },
    select: {
      id: true,
      title: true,
      updatedAt: true,
      content: true,
    },
  });

  return resumes;
}

export default async function DashboardPage() {
  const resumes = await getResumes();

  return <DashboardClient resumes={resumes} />;
}