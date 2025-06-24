import React, { useState, useEffect } from 'react';
import type { StatusFilter } from './TaskHeader';
import { DndContext, closestCenter } from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import type { Task, TaskCategory, TaskStatus } from '../types/task';

import TaskHeader from './TaskHeader';
import TaskModal from './TaskModal';
import TaskCard from './TaskCard';
import { BriefcaseIcon, CalendarIcon, UserIcon } from '@heroicons/react/16/solid';

const CATEGORIES: TaskCategory[] = ['Work', 'Personal', 'Other'];

const DroppableColumn: React.FC<{
  category: TaskCategory;
  children: React.ReactNode;
}> = ({ category, children }) => {
  const { setNodeRef } = useDroppable({
    id: category,
  });

  const containerStyle = {
    borderRadius: '0.5rem',
    padding: '0.8rem',
    paddingTop: '1rem',
    transition: 'background-color 0.2s ease',
    minHeight: '200px',
  };

  return (
    <div
      ref={setNodeRef}
      className="rounded-lg shadow-sm"
      style={{
        backgroundColor: 'var(--bg)',
        ...containerStyle,
        border: '1px solid var(--text)',
        boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)',
      }}
    >
      {children}
    </div>
  );
};

const BoardArea: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  // Initialize boardTitle with saved value or default
  const [boardTitle, setBoardTitle] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('boardTitle') || 'My Tasks';
    }
    return 'My Tasks';
  });

  // Save board title to localStorage when it changes
  const handleTitleChange = (newTitle: string) => {
    setBoardTitle(newTitle);
    localStorage.setItem('boardTitle', newTitle);
  };
  
  // Load status filter from localStorage if available
  useEffect(() => {
    try {
      const savedFilter = localStorage.getItem('statusFilter');
      if (savedFilter && ['all', 'pending', 'completed'].includes(savedFilter)) {
        setStatusFilter(savedFilter as StatusFilter);
      }
    } catch (error) {
      console.error('Failed to load status filter from localStorage:', error);
    }
  }, []);
  
  // Save status filter to localStorage when it changes
  useEffect(() => {
    try {
      localStorage.setItem('statusFilter', statusFilter);
    } catch (error) {
      console.error('Failed to save status filter to localStorage:', error);
    }
  }, [statusFilter]);

  // Load tasks from localStorage on initial render
  useEffect(() => {
    try {
      const savedTasks = localStorage.getItem('tasks');
      if (savedTasks) {
        const parsedTasks = JSON.parse(savedTasks);
        // Ensure we have valid tasks before setting state
        if (Array.isArray(parsedTasks) && parsedTasks.length > 0) {
          setTasks(parsedTasks);
        }
      }
    } catch (error) {
      console.error('Failed to load tasks from localStorage:', error);
      // Clear invalid data
      localStorage.removeItem('tasks');
    }
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    try {
      if (tasks.length > 0) {
        localStorage.setItem('tasks', JSON.stringify(tasks));
      } else {
        localStorage.removeItem('tasks');
      }
    } catch (error) {
      console.error('Failed to save tasks to localStorage:', error);
    }
  }, [tasks]);

  const handleTaskSubmit = (taskData: Omit<Task, 'id' | 'status' | 'createdAt'>) => {
    if (editingTask) {
      // Update existing task
      setTasks(tasks.map(t => 
        t.id === editingTask.id 
          ? { ...taskData, id: editingTask.id, status: editingTask.status, createdAt: editingTask.createdAt }
          : t
      ));
      setEditingTask(null);
    } else {
      // Add new task
      const newTask: Task = {
        ...taskData,
        id: Date.now().toString(),
        status: 'pending',
        createdAt: new Date().toISOString(),
      };
      setTasks([...tasks, newTask]);
    }
    setIsModalOpen(false);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleAddTask = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleStatusChange = (taskId: string, newStatus: TaskStatus) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    ));
  };

  const handleDeleteTask = (taskId: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setTasks(tasks.filter(task => task.id !== taskId));
    }
  };

  const filteredTasks = (category: TaskCategory) => {
    return tasks
      .filter(task => {
        // Filter by category first
        if (task.category !== category) return false;
        
        // Then apply status filter if not 'all'
        if (statusFilter !== 'all' && task.status !== statusFilter) return false;
        
        return true;
      })
      .sort((a, b) => {
        // Sort high priority to the top
        if (a.priority === 'High' && b.priority !== 'High') return -1;
        if (a.priority !== 'High' && b.priority === 'High') return 1;
        // Sort completed tasks to the bottom
        if (a.status === 'completed' && b.status !== 'completed') return 1;
        if (a.status !== 'completed' && b.status === 'completed') return -1;
        // Sort by creation date (newest first) if priorities are the same
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    // If dropped on the same category, do nothing
    if (activeId === overId) return;

    // Find the task being dragged
    const draggedTask = tasks.find(t => t.id === activeId);
    if (!draggedTask) return;

    // If dropped on a category column
    if (CATEGORIES.includes(overId as TaskCategory)) {
      // Update the category of the dragged task
      setTasks(prev =>
        prev.map(task =>
          task.id === activeId
            ? { ...task, category: overId as TaskCategory }
            : task
        )
      );
    }
  };

  return (
    <div className="p-6">
      <TaskModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleTaskSubmit}
        task={editingTask}
      />
      <TaskHeader 
        initialTitle={boardTitle}
        onTitleChange={handleTitleChange}
        onAddTask={handleAddTask} 
        statusFilter={statusFilter}
        onStatusFilterChange={(filter) => setStatusFilter(filter)}
      />

      <DndContext 
        collisionDetection={closestCenter} 
        onDragEnd={handleDragEnd}
      >
        <main className="grid grid-cols-1 md:grid-cols-3 gap-2 min-h-[calc(100vh-280px)]">
          {CATEGORIES.map(category => {
            const tasksInCategory = filteredTasks(category);
            return (
              <DroppableColumn key={category} category={category}>
                <div className="flex items-center mb-4">
                  {category === 'Work' && <BriefcaseIcon className="h-6 w-6 mr-2" />}
                  {category === 'Personal' && <UserIcon className="h-6 w-6 mr-2" />}
                  {category === 'Other' && <CalendarIcon className="h-6 w-6 mr-2" />}
                  <h3 className="font-semibold">{category}</h3>
                </div>
                <SortableContext
                  items={tasksInCategory.map(t => t.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-3">
                    {tasksInCategory.length === 0 ? (
                      <div
                        className="p-2 rounded-lg border-2 border-dashed text-center"
                        style={{
                          borderColor: 'var(--border-muted)',
                          color: 'var(--text-muted)',
                        }}
                        role="region"
                        aria-label="Drop area"
                      >
                        <p className="text-sm">No tasks in {category} category</p>
                      </div>
                    ) : (
                      tasksInCategory.map(task => (
                        <TaskCard
                          key={task.id}
                          id={task.id}
                          task={task}
                          onEdit={handleEditTask}
                          onDelete={handleDeleteTask}
                          onStatusChange={handleStatusChange}
                        />
                      ))
                    )}
                  </div>
                </SortableContext>
              </DroppableColumn>
            );
          })}
        </main>
      </DndContext>
    </div>
  );
};

export default BoardArea;
