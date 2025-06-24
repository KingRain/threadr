import React, { useState, useRef, useEffect } from 'react';
import { PencilIcon, PlusIcon, FunnelIcon, CheckIcon, ClockIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

export type StatusFilter = 'all' | 'pending' | 'completed';

interface TaskHeaderProps {
  statusFilter?: StatusFilter;
  initialTitle?: string;
  onTitleChange?: (newTitle: string) => void;
  onStatusFilterChange?: (status: StatusFilter) => void;
  onAddTask?: () => void;
}

const TaskHeader: React.FC<TaskHeaderProps> = ({
  initialTitle = 'My Tasks',
  onTitleChange,
  onStatusFilterChange,
  onAddTask,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(initialTitle);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleTitleClick = () => {
    setIsEditing(true);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleTitleBlur = () => {
    setIsEditing(false);
    if (onTitleChange && title.trim() !== initialTitle) {
      onTitleChange(title.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      inputRef.current?.blur();
    } else if (e.key === 'Escape') {
      setTitle(initialTitle);
      setIsEditing(false);
    }
  };

  const handleStatusChange = (status: StatusFilter) => {
    setStatusFilter(status);
    if (onStatusFilterChange) {
      onStatusFilterChange(status);
    }
  };

  return (
    <div className="mb-6">
      <h2
        className="text-2xl font-bold mb-4"
        style={{ color: 'var(--text)' }}
      >
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={title}
            onChange={handleTitleChange}
            onBlur={handleTitleBlur}
            onKeyDown={handleKeyDown}
            className="bg-transparent border-b border-transparent focus:border-current focus:outline-none"
          />
        ) : (
          <span className="cursor-pointer flex items-center" onClick={handleTitleClick}>
            {title}
            <PencilIcon className="w-4 h-4 ml-2" />
          </span>
        )}
      </h2>

      <hr className="my-4" />
      <div className="flex items-center justify-between">
        <div className="relative inline-block text-left">
          <div>
            <button
              type="button"
              className="inline-flex items-center justify-between w-full rounded-full border border-gray-200 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500 transition-colors duration-150"
              id="menu-button"
              aria-expanded="true"
              aria-haspopup="true"
              onClick={(e) => {
                const menu = document.getElementById('status-menu');
                menu?.classList.toggle('hidden');
                e.currentTarget.blur();
              }}
            >
              <span className="flex items-center">
                <FunnelIcon className="w-4 h-4 mr-2" />
                Apply Filters ({statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)})
              </span>
              <svg 
                className="w-4 h-4 ml-2 text-gray-500" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          <div
            className="origin-top-left absolute left-0 mt-2 w-56 rounded-xl shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none hidden z-50 overflow-hidden"
            id="status-menu"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="menu-button"
            tabIndex={-1}
            onClick={(e) => e.stopPropagation()}
          >
            {(['all', 'pending', 'completed'] as StatusFilter[]).map((status) => {
              const isSelected = statusFilter === status;
              return (
                <div
                  key={status}
                  className={`py-2 px-3 hover:bg-gray-50 cursor-pointer transition-colors duration-150 ${isSelected ? 'bg-indigo-50' : ''}`}
                  role="menuitem"
                  tabIndex={0}
                  onClick={() => {
                    handleStatusChange(status);
                    document.getElementById('status-menu')?.classList.add('hidden');
                  }}
                >
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      {status === 'pending' && (
                        <ClockIcon className="w-4 h-4 mr-2 text-yellow-500" />
                      )}
                      {status === 'completed' && (
                        <CheckCircleIcon className="w-4 h-4 mr-2 text-green-500" />
                      )}
                      {status === 'all' && (
                        <div className="w-4 h-4 mr-2 rounded-full bg-gray-500" />
                      )}
                      <span className="font-medium">
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </span>
                    </div>
                    {isSelected && <CheckIcon className="w-4 h-4 text-indigo-600" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <button
          onClick={onAddTask}
          className="flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors"
          style={{
            backgroundColor: 'var(--primary)',
            color: 'white',
          }}
        >
          <PlusIcon className="w-4 h-4 mr-2" />
          Add Task
        </button>
      </div>
    </div>
  );
};

export default TaskHeader;
