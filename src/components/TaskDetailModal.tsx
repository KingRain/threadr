import React from 'react';
import { XMarkIcon, PencilIcon } from '@heroicons/react/24/outline';
import type { Task } from '../types/task';

interface TaskDetailModalProps {
  task: Task | null;
  onClose: () => void;
  isOpen: boolean;
  onEdit?: (id: string) => void;
  onDelete?: () => void;
}

const TaskDetailModal: React.FC<TaskDetailModalProps> = ({ task, onClose, isOpen, onEdit, onDelete }) => {
  if (!task || !isOpen) return null;

  const priorityColors = {
    High: 'bg-red-100 text-red-800',
    Medium: 'bg-yellow-100 text-yellow-800',
    Low: 'bg-green-100 text-green-800',
  } as const;

  const statusLabels = {
    'pending': 'Pending',
    'in-progress': 'In Progress',
    'completed': 'Completed',
  } as const;

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto" 
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={onClose}
    >
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          aria-hidden="true"
          style={{ backgroundColor: 'var(--bg)' }}
        ></div> */}

        {/* Modal panel */}
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
          &#8203;
        </span>
        
        <div
          className="inline-block align-bottom rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full"
          style={{
            backgroundColor: 'var(--background)',
            border: '1px solid var(--border)',
          }}
          onClick={(e) => e.stopPropagation()}
          role="document"
        >
          <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="w-full">
              <div className="flex justify-between items-center w-full">
                <h3 className="text-xl font-semibold" id="modal-title" style={{ color: 'var(--heading)' }}>
                  {task.title}
                </h3>
                <div className="flex space-x-2">
                  {onEdit && (
                    <button
                      type="button"
                      className="text-gray-400 hover:text-blue-500 rounded-full p-1 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(task.id);
                      }}
                    >
                      <PencilIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                  )}
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-500 rounded-full p-1 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      onClose();
                    }}
                  >
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
              </div>
              
              <div className="mt-6 space-y-6 w-full">
                {!task.description && (
                  <div>
                    <h4 className="text-sm font-medium mb-1" style={{ color: 'var(--text)' }}>No description</h4>
                  </div>
                )}
                {task.description && (
                  <div>
                    <h4 className="text-sm font-medium mb-1" style={{ color: 'var(--text)' }}>Description</h4>
                    <p className="whitespace-pre-line" style={{ color: 'var(--text)' }}>
                      {task.description}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg">
                    <h4 className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text)' }}>Due Date</h4>
                    <p className="mt-1 text-sm" style={{ color: 'var(--text)' }}>
                      {task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      }) : 'No due date'}
                    </p>
                  </div>
                  
                  <div className="p-3 rounded-lg">
                    <h4 className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text)' }}>Category</h4>
                    <p className="mt-1 text-sm" style={{ color: 'var(--text)' }}>{task.category || 'Uncategorized'}</p>
                  </div>
                  
                  <div className="p-3 rounded-lg">
                    <h4 className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text)' }}>Priority</h4>
                    <span 
                      className={`inline-flex items-center px-3 py-1 mt-1 rounded-full text-xs font-medium ${
                        priorityColors[task.priority as keyof typeof priorityColors] || 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {task.priority}
                    </span>
                  </div>
                  
                  <div className="p-3 rounded-lg">
                    <h4 className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text)' }}>Status</h4>
                    <p className="mt-1 text-sm" style={{ color: 'var(--text)' }}>
                      {statusLabels[task.status] || task.status}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-b border-t border-gray-200"></div>
          
          <div className="px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-500 text-base font-medium text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>);  
};

export default TaskDetailModal;
