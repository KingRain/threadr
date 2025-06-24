// src/types/task.ts
export type TaskStatus = 'pending' | 'completed';
export type TaskCategory = 'Work' | 'Personal' | 'Other' ;
export type TaskPriority = 'High' | 'Medium' | 'Low';

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: TaskPriority;
  category: TaskCategory;
  status: TaskStatus;
  createdAt: string;
}