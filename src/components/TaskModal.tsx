import React, { useState, useEffect } from 'react';
import { XMarkIcon, ClockIcon, PencilIcon, TagIcon } from '@heroicons/react/24/outline';

type TaskStatus = 'pending' | 'in-progress' | 'completed';
type TaskCategory = 'Work' | 'Personal' | 'Other';
type TaskPriority = 'High' | 'Medium' | 'Low';

interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  category: TaskCategory;
  priority: TaskPriority;
  status: TaskStatus;
}

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (task: Omit<Task, 'id' | 'status' | 'createdAt'>) => void;
  task?: Task | null;
}

const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, onSubmit, task }) => {
  const [formData, setFormData] = useState<Omit<Task, 'id' | 'status'>>(() => {
    if (task) {
      // If editing an existing task, use its values
      const { id, status, ...rest } = task;
      return rest;
    }
    // Default values for new task
    return {
      title: '',
      description: '',
      dueDate: new Date().toISOString().split('T')[0],
      category: 'Work',
      priority: 'High',
    };
  });

  // Update form data when task prop changes
  useEffect(() => {
    if (task) {
      const { id, status, ...rest } = task;
      setFormData(rest);
    } else {
      // Reset to default values for new task
      setFormData({
        title: '',
        description: '',
        dueDate: new Date().toISOString().split('T')[0],
        category: 'Work',
        priority: 'High',
      });
    }
  }, [task]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.dueDate) return;
    
    onSubmit({
      ...formData,
    });
    
    // Reset form
    setFormData({
      title: '',
      description: '',
      dueDate: new Date().toISOString().split('T')[0],
      category: 'Work',
      priority: 'High',
    });
    onClose();
  };

  if (!isOpen) return null;

  // Prevent click propagation to parent elements
  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 transition-opacity" 
          aria-hidden="true"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        {/* Modal panel */}
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        
        <div 
          className="inline-block align-bottom rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full relative z-10 drop-shadow-md"
          onClick={handleModalClick}
          style={{
            backgroundColor: 'var(--background)',
            border: '1px solid var(--border)',
          }}
        >
          <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg leading-6 font-medium" style={{ color: 'var(--text)' }}>Add New Task</h3>
              <button
                type="button"
                className="text-gray-400 hover:text-gray-500"
                onClick={onClose}
                style={{
                  color: 'var(--text)',
                }}
              >
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1 flex items-center"
                style={{
                  color: 'var(--text)',
                }}>
                  <PencilIcon className="h-5 w-5 mr-2" aria-hidden="true" />
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1 flex items-center"
                style={{
                  color: 'var(--text)',
                }}>
                  <TagIcon className="h-5 w-5 mr-2" aria-hidden="true" />
                  Description
                </label>
                <textarea
                  name="description"
                  id="description"
                  rows={3}
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1 flex items-center"
                style={{
                  color: 'var(--text)',
                }}>
                  <TagIcon className="h-5 w-5 mr-2" aria-hidden="true" />
                  Category
                </label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as TaskCategory })}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  {['Work', 'Personal', 'Other'].map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1 flex items-center"
                style={{
                  color: 'var(--text)',
                }}>
                  <ClockIcon className="h-5 w-5 mr-2" aria-hidden="true" />
                  Due Date
                </label>
                <input
                  type="date"
                  name="dueDate"
                  id="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div className="mb-4">
                <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1 flex items-center"
                style={{
                  color: 'var(--text)',
                }}>
                  <PencilIcon className="h-5 w-5 mr-2" aria-hidden="true" />
                  Priority
                </label>
                <select
                  id="priority"
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value as TaskPriority })}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  {['High', 'Medium', 'Low'].map(priority => (
                    <option key={priority} value={priority}>{priority}</option>
                  ))}
                </select>
              </div>

              <div className="mt-5 sm:mt-6">
                <button
                  type="submit"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-500 text-base font-medium text-white hover:bg-indigo-600 sm:text-sm"
                >
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
