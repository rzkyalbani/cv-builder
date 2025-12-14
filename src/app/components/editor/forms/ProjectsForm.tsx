import { useState } from 'react';
import { ProjectItem } from '@/types/resume';

interface ProjectsFormProps {
  items: ProjectItem[];
  onChange: (newItems: ProjectItem[]) => void;
}

export default function ProjectsForm({ items, onChange }: ProjectsFormProps) {
  const [expandedItemIndex, setExpandedItemIndex] = useState<number | null>(null);

  const handleItemChange = (index: number, field: keyof ProjectItem, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    onChange(newItems);
  };

  const handleAddItem = () => {
    const newItem: ProjectItem = {
      id: Date.now().toString(), // Simple ID generation
      title: '',
      description: '',
      startDate: '',
      endDate: '',
      url: '',
      technologies: [],
      achievements: [],
    };
    onChange([...items, newItem]);
    // Automatically expand the new item
    setExpandedItemIndex(items.length);
  };

  const handleDeleteItem = (index: number) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    onChange(newItems);
    // If the deleted item was expanded, reset the expanded index
    if (expandedItemIndex === index) {
      setExpandedItemIndex(null);
    } else if (expandedItemIndex !== null && expandedItemIndex > index) {
      setExpandedItemIndex(expandedItemIndex - 1);
    }
  };

  const toggleItem = (index: number) => {
    setExpandedItemIndex(expandedItemIndex === index ? null : index);
  };

  const handleDone = (index: number) => {
    setExpandedItemIndex(null);
  };

  const formatDates = (startDate: string, endDate: string) => {
    if (!startDate) return '';
    const start = startDate ? new Date(startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : '';
    const end = endDate ? new Date(endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : '';
    return start + (end ? ` - ${end}` : '');
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 mb-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Projects</h3>

      {items.length === 0 ? (
        <p className="text-gray-500 italic mb-4">No projects added yet</p>
      ) : (
        <div className="space-y-4">
          {items.map((item, index) => (
            <div key={item.id || index} className="border border-gray-200 rounded-lg overflow-hidden">
              {/* Summary Card */}
              {expandedItemIndex === null || expandedItemIndex !== index ? (
                <div 
                  className="p-4 bg-white hover:bg-gray-50 cursor-pointer"
                  onClick={() => toggleItem(index)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-gray-900">{item.title || 'Untitled Project'}</h4>
                      <p className="text-sm text-gray-500 mt-1">
                        {formatDates(item.startDate, item.endDate)}
                      </p>
                      {item.technologies && item.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {item.technologies.slice(0, 3).map((tech, i) => (
                            <span key={i} className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                              {tech}
                            </span>
                          ))}
                          {item.technologies.length > 3 && (
                            <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded">
                              +{item.technologies.length - 3} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    <button 
                      type="button"
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </button>
                  </div>
                </div>
              ) : (
                /* Full Form */
                <div className="bg-white">
                  <div className="p-4 border-b border-gray-200">
                    <h4 className="font-semibold text-gray-900">Editing Project</h4>
                  </div>
                  
                  <div className="p-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Project Name *
                        </label>
                        <input
                          type="text"
                          value={item.title || ''}
                          onChange={(e) => handleItemChange(index, 'title', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Project name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Project URL
                        </label>
                        <input
                          type="text"
                          value={item.url || ''}
                          onChange={(e) => handleItemChange(index, 'url', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Project URL"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Start Date
                        </label>
                        <input
                          type="month"
                          value={item.startDate || ''}
                          onChange={(e) => handleItemChange(index, 'startDate', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          End Date
                        </label>
                        <input
                          type="month"
                          value={item.endDate || ''}
                          onChange={(e) => handleItemChange(index, 'endDate', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="End date"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Technologies (comma separated)
                      </label>
                      <input
                        type="text"
                        value={item.technologies ? item.technologies.join(', ') : ''}
                        onChange={(e) => handleItemChange(index, 'technologies', e.target.value.split(', ').map(s => s.trim()))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., React, Node.js, PostgreSQL"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Project Description
                      </label>
                      <textarea
                        value={item.description || ''}
                        onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Description of the project"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Key Achievements (comma separated)
                      </label>
                      <textarea
                        value={item.achievements ? item.achievements.join(', ') : ''}
                        onChange={(e) => handleItemChange(index, 'achievements', e.target.value.split(', ').map(s => s.trim()))}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., Improved performance by 30%, Led a team of 5 developers"
                      />
                    </div>

                    <div className="flex justify-between pt-2">
                      <button
                        type="button"
                        onClick={() => handleDeleteItem(index)}
                        className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
                      >
                        Delete Project
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDone(index)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                      >
                        Done
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={handleAddItem}
        className="w-full py-2 px-4 border-2 border-dashed border-gray-300 rounded-md text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors mt-4"
      >
        + Add Project
      </button>
    </div>
  );
}