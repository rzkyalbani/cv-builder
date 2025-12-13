'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateNewResumeButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateResume = async () => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/resumes', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to create resume');
      }

      const newResume = await response.json();
      
      // Redirect to the editor for the newly created resume
      router.push(`/editor/${newResume.id}`);
    } catch (error) {
      console.error('Error creating resume:', error);
      alert('Failed to create new resume. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleCreateResume}
      disabled={isLoading}
      className={`border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 transition-colors duration-200 flex flex-col items-center justify-center ${
        isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-50'
      }`}
    >
      <div className="text-4xl text-gray-400 mb-2">+</div>
      <h3 className="font-semibold text-gray-700">Create New Resume</h3>
      {isLoading && (
        <div className="mt-2">
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
    </button>
  );
}