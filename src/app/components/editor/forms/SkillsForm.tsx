import { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { SkillItem } from '@/types/resume';

interface SkillsFormProps {
  items: SkillItem[];
  onChange: (newItems: SkillItem[]) => void;
  droppableId: string;
}

export default function SkillsForm({ items, onChange, droppableId }: SkillsFormProps) {
  const [expandedItemIndex, setExpandedItemIndex] = useState<number | null>(null);

  const handleItemChange = (index: number, field: keyof SkillItem, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    onChange(newItems);
  };

  const handleAddItem = () => {
    const newItem: SkillItem = {
      id: Date.now().toString(), // Simple ID generation
      name: '',
      level: 'Beginner',
      category: '',
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

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const itemsCopy = Array.from(items);
    const [reorderedItem] = itemsCopy.splice(result.source.index, 1);
    itemsCopy.splice(result.destination.index, 0, reorderedItem);

    onChange(itemsCopy);
  };

  const getLevelColor = (level?: string) => {
    switch (level) {
      case 'Beginner': return 'bg-red-100 text-red-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-blue-100 text-blue-800';
      case 'Expert': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 mb-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Skills</h3>

      {items.length === 0 ? (
        <p className="text-gray-500 italic mb-4">No skills added yet</p>
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId={droppableId} type="ITEM">
            {(provided) => (
              <div 
                {...provided.droppableProps} 
                ref={provided.innerRef}
                className="space-y-4"
              >
                {items.map((item, index) => (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`${snapshot.isDragging ? 'shadow-lg rounded-md opacity-90' : ''} border border-gray-200 rounded-lg overflow-hidden`}
                      >
                        {/* Summary Card */}
                        {expandedItemIndex === null || expandedItemIndex !== index ? (
                          <div
                            className="p-4 bg-white hover:bg-gray-50 cursor-pointer"
                            onClick={() => toggleItem(index)}
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex items-center">
                                {/* Drag Handle */}
                                <div 
                                  {...provided.dragHandleProps}
                                  className="mr-3 cursor-move text-gray-400 hover:text-gray-600"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v2.586L7.707 6.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l2-2A1 1 0 0011 8.586V6z" clipRule="evenodd" />
                                  </svg>
                                </div>
                                <div>
                                  <h4 className="font-semibold text-gray-900">{item.name || 'Untitled Skill'}</h4>
                                  {item.category && (
                                    <p className="text-sm text-gray-600">{item.category}</p>
                                  )}
                                  {item.level && (
                                    <span className={`inline-block px-2 py-1 text-xs rounded-full mt-1 ${getLevelColor(item.level)}`}>
                                      {item.level}
                                    </span>
                                  )}
                                </div>
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
                            <div className="p-4 border-b border-gray-200 flex justify-between items-start">
                              <div className="flex items-center">
                                {/* Drag Handle */}
                                <div 
                                  {...provided.dragHandleProps}
                                  className="mr-3 cursor-move text-gray-400 hover:text-gray-600"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v2.586L7.707 6.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l2-2A1 1 0 0011 8.586V6z" clipRule="evenodd" />
                                  </svg>
                                </div>
                                <h4 className="font-semibold text-gray-900">Editing Skill</h4>
                              </div>
                            </div>

                            <div className="p-4 space-y-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Skill Name *
                                </label>
                                <input
                                  type="text"
                                  value={item.name || ''}
                                  onChange={(e) => handleItemChange(index, 'name', e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  placeholder="Skill name"
                                />
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Level
                                  </label>
                                  <select
                                    value={item.level || 'Beginner'}
                                    onChange={(e) => handleItemChange(index, 'level', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  >
                                    <option value="Beginner">Beginner</option>
                                    <option value="Intermediate">Intermediate</option>
                                    <option value="Advanced">Advanced</option>
                                    <option value="Expert">Expert</option>
                                  </select>
                                </div>

                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Category
                                  </label>
                                  <input
                                    type="text"
                                    value={item.category || ''}
                                    onChange={(e) => handleItemChange(index, 'category', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g., Technical, Soft, Language"
                                  />
                                </div>
                              </div>

                              <div className="flex justify-between pt-2">
                                <button
                                  type="button"
                                  onClick={() => handleDeleteItem(index)}
                                  className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
                                >
                                  Delete Skill
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
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}

      <button
        type="button"
        onClick={handleAddItem}
        className="w-full py-2 px-4 border-2 border-dashed border-gray-300 rounded-md text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors mt-4"
      >
        + Add Skill
      </button>
    </div>
  );
}