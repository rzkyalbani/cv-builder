'use client';

import { signOut } from 'next-auth/react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    router.push('/login');
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Welcome to FlowCV Clone</h1>
        
        <div className="mb-8 p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">User Information</h2>
          <p className="text-gray-600 dark:text-gray-300"><span className="font-medium">Name:</span> {session?.user?.name || 'N/A'}</p>
          <p className="text-gray-600 dark:text-gray-300"><span className="font-medium">Email:</span> {session?.user?.email || 'N/A'}</p>
        </div>

        <div className="flex justify-end">
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors duration-200"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}