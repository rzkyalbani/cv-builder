import { ExperienceItem } from '@/types/resume';

interface ExperienceFormProps {
  items: ExperienceItem[];
  onChange: (newItems: ExperienceItem[]) => void;
}

export default function ExperienceForm({ items, onChange }: ExperienceFormProps) {
  const handleItemChange = (index: number, field: keyof ExperienceItem, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    onChange(newItems);
  };

  const handleAddItem = () => {
    const newItem: ExperienceItem = {
      id: Date.now().toString(), // Simple ID generation
      company: '',
      role: '',
      startDate: '',
      endDate: '',
      description: '',
      currentlyWorking: false,
    };
    onChange([...items, newItem]);
  };

  const handleDeleteItem = (index: number) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    onChange(newItems);
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 mb-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Professional Experience</h3>
      
      {items.length === 0 ? (
        <p className="text-gray-500 italic mb-4">No experience added yet</p>
      ) : (
        <div className="space-y-6">
          {items.map((item, index) => (
            <div key={item.id || index} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company *
                  </label>
                  <input
                    type="text"
                    value={item.company}
                    onChange={(e) => handleItemChange(index, 'company', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Company name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role *
                  </label>
                  <input
                    type="text"
                    value={item.role}
                    onChange={(e) => handleItemChange(index, 'role', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Job title"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="month"
                    value={item.startDate}
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
                    value={item.endDate}
                    onChange={(e) => handleItemChange(index, 'endDate', e.target.value)}
                    disabled={item.currentlyWorking}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                    placeholder="End date"
                  />
                  <div className="mt-2">
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        checked={item.currentlyWorking}
                        onChange={(e) => handleItemChange(index, 'currentlyWorking', e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">I currently work here</span>
                    </label>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={item.description}
                  onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Job description and responsibilities"
                />
              </div>
              
              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => handleDeleteItem(index)}
                  className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
                >
                  Delete Position
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <button
        type="button"
        onClick={handleAddItem}
        className="w-full py-2 px-4 border-2 border-dashed border-gray-300 rounded-md text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors"
      >
        + Add Position
      </button>
    </div>
  );
}