import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import  prisma  from '@/lib/prisma';
import Link from 'next/link';
import CreateNewResumeButton from '../components/CreateNewResumeButton';

async function getResumes() {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    // This should ideally redirect to login, but for now we'll throw an error
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
    },
  });

  return resumes;
}

export default async function DashboardPage() {
  const resumes = await getResumes();

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Resumes</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Manage your resume templates and drafts
        </p>
      </div>

      {resumes.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-12 text-center">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">No resumes yet</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Get started by creating your first resume
          </p>
          <CreateNewResumeButton />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <CreateNewResumeButton />
          
          {resumes.map((resume) => (
            <Link 
              href={`/editor/${resume.id}`} 
              key={resume.id}
              className="block bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-200 border border-gray-200 dark:border-gray-700"
            >
              <h3 className="font-semibold text-lg text-gray-900 dark:text-white truncate">
                {resume.title}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
                Last updated: {new Date(resume.updatedAt).toLocaleDateString()}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}