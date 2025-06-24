import React, { useState } from 'react';
import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';
import type { Task, TaskStatus, TaskPriority } from '../types/task';
import TaskDetailModal from './TaskDetailModal';

interface TaskCardProps {
  task: Task;
  id: string;
  onEdit?: (task: Task) => void;
  onDelete?: (id: string) => void;
  onStatusChange?: (id: string, newStatus: TaskStatus) => void;
}

const priorityColors: Record<TaskPriority, string> = {
  High: 'bg-red-100 text-red-800',
  Medium: 'bg-yellow-100 text-yellow-800',
  Low: 'bg-green-100 text-green-800',
} as const;

const statusBorders: Record<TaskStatus, string> = {
  pending: 'border-blue-500',
  completed: 'border-green-500',
} as const;

const TaskCard: React.FC<TaskCardProps> = ({ task, id, onEdit, onDelete, onStatusChange }) => {
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  
  const { 
    attributes, 
    listeners, 
    setNodeRef, 
    transform, 
    isDragging 
  } = useSortable({ 
    id, 
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    opacity: isDragging ? 0.8 : 1,
    transition: isDragging ? 'none' : 'transform 250ms ease',
    position: 'relative' as const,
    zIndex: isDragging ? 1 : 'auto',
    cursor: isDragging ? 'grabbing' : 'pointer',
    borderLeftWidth: '4px',
    borderColor: 'var(--secondary)',
    pointerEvents: isDragging ? 'none' : 'auto',
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't open detail if clicking on action buttons or dragging
    if ((e.target as HTMLElement).closest('button') || isDragging) {
      return;
    }
    setIsDetailOpen(true);
  };

  // Handle edit button click in the detail modal
  const handleEditInModal = () => {
    if (onEdit) {
      onEdit(task);
    }
    setIsDetailOpen(false);
  };

  const handleActionButtonClick = (e: React.MouseEvent) => {
    // Don't prevent default, so the button's click event is triggered
    e.stopPropagation();
  };

  const handleCloseDetail = () => {
    setIsDetailOpen(false);
  };

  const handleStatusToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onStatusChange) {
      onStatusChange(
        id,
        task.status === 'completed' ? 'pending' : 'completed'
      );
    }
  };

  return (
    <>
      <div 
        ref={setNodeRef}
        style={{
          ...style,
        }}
        className={`bg-white p-4 rounded-lg shadow-sm border-l-4 ${
        isDragging ? 'opacity-50' : ''
      } ${priorityColors[task.priority]} ${statusBorders[task.status]}`}
        onClick={handleCardClick}
      >
        <div 
          className="absolute top-1/2 -left-1 -translate-y-1/2 p-2 rounded-r hover:bg-gray-100 transition-colors flex flex-col space-y-1.5"
          {...listeners}
          {...attributes}
          onClick={handleActionButtonClick}
        >
          <div className="w-1 h-1 rounded-full bg-gray-300"></div>
          <div className="w-1 h-1 rounded-full bg-gray-300"></div>
          <div className="w-1 h-1 rounded-full bg-gray-300"></div>
        </div>
      <div className="flex justify-between items-start">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <input 
              type="checkbox" 
              className="rounded text-primary border-primary"
              checked={task.status === 'completed'}
              onChange={(e) => onStatusChange?.(task.id, e.target.checked ? 'completed' : 'pending')}
              onClick={(e) => e.stopPropagation()}
            />
            <h4 
              className={`font-medium text-gray-900 truncate ${task.status === 'completed' ? 'line-through opacity-50' : ''}`}
            >
              {task.title}
            </h4>
          </div>
          {task.description && (
            <p className="text-sm text-gray-500 mt-1 line-clamp-2">
              {task.description}
            </p>
          )}
        </div>
        {task.dueDate && (
          <span 
            className={`text-xs px-2 py-0.5 rounded-full ml-2 whitespace-nowrap ${
              (() => {
                const dueDate = new Date(task.dueDate);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const timeDiff = dueDate.getTime() - today.getTime();
                const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
                
                if (daysDiff <= 0) return 'bg-red-100 text-red-800';
                if (daysDiff <= 2) return 'bg-orange-100 text-orange-800';
                return 'bg-green-100 text-green-800';
              })()
            }`}
          >
            Due: {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
        )}
      </div>
      
      <div className="flex justify-between items-center mt-3">
        <div className="flex items-center space-x-2">
          {task.priority && (
            <span 
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                priorityColors[task.priority] || 'bg-gray-100 text-gray-800'
              }`}
            >
              {task.priority}
            </span>
          )}
          <span 
            className="inline-block px-2 py-1 text-xs rounded-full"
            style={{
              backgroundColor: 'var(--bg-light)',
              color: 'var(--text-muted)'
            }}
          >
            {task.category}
          </span>
        </div>
        
        <div className="flex space-x-1">
          {onDelete && (
            <button 
              onClick={() => onDelete(task.id)}
              className="p-1 text-gray-400 hover:text-red-500"
              aria-label="Delete task"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
        </div>
      </div>
      </div>
      
      <TaskDetailModal 
        task={task}
        onClose={handleCloseDetail}
        isOpen={isDetailOpen}
        onEdit={handleEditInModal}
        onDelete={onDelete ? () => onDelete(id) : undefined}
      />
    </>
  );
};

export default TaskCard;
