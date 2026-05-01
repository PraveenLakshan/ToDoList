export type Priority = 'Low' | 'Medium' | 'High';
export type FilterStatus = 'All' | 'Active' | 'Completed';
export type TaskStatus = 'todo' | 'in_progress' | 'completed';

export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  priority: Priority;
  createdAt: number;
  dueDate?: number; // timestamp
  tags?: Tag[];
  description?: string;
  subtasks?: Subtask[];
  projectId?: string;
  timeSpent?: number; // in seconds
}
