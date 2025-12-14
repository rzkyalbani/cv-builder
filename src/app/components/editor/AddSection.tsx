interface AddSectionProps {
  onAddSection: (type: 'experience' | 'education' | 'skills' | 'projects' | 'custom') => void;
}

export default function AddSection({ onAddSection }: AddSectionProps) {
  const sectionOptions = [
    { type: 'experience', label: 'Professional Experience', description: 'Add work history and job details' },
    { type: 'education', label: 'Education', description: 'Add schools, degrees, and certifications' },
    { type: 'skills', label: 'Skills', description: 'Add technical and soft skills' },
    { type: 'projects', label: 'Projects', description: 'Add personal or professional projects' },
    { type: 'custom', label: 'Custom Section', description: 'Add a custom section' },
  ];

  return (
    <div className="mt-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Add Content</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sectionOptions.map((option) => (
          <button
            key={option.type}
            onClick={() => onAddSection(option.type as any)}
            className="text-left p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <h4 className="font-medium text-gray-900">{option.label}</h4>
            <p className="text-sm text-gray-500 mt-1">{option.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}