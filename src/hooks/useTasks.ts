import { useState, useEffect, useCallback, useMemo } from 'react';
import type { Task, FilterStatus, Priority, TaskStatus } from '../types';
import { STORAGE_KEY } from '../utils/constants';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Migrate old data
        return parsed.map((t: any) => ({
          ...t,
          status: t.status || (t.completed ? 'completed' : 'todo'),
          completed: undefined,
        }));
      }
      return [];
    } catch {
      return [];
    }
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('All');
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'All'>('All');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const addTask = useCallback((newTask: Omit<Task, 'id' | 'createdAt' | 'status'> & { status?: TaskStatus }) => {
    const task: Task = {
      ...newTask,
      status: newTask.status || 'todo',
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      subtasks: newTask.subtasks?.map(st => ({ ...st, id: crypto.randomUUID() })) || [],
    };
    setTasks((prev) => [task, ...prev]);
  }, []);

  const updateTask = useCallback((id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
  }, []);

  const toggleSubtask = useCallback((taskId: string, subtaskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId && t.subtasks) {
          return {
            ...t,
            subtasks: t.subtasks.map(st => 
              st.id === subtaskId ? { ...st, completed: !st.completed } : st
            )
          };
        }
        return t;
      })
    );
  }, []);

  const toggleTask = useCallback((id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status: t.status === 'completed' ? 'todo' : 'completed' } : t))
    );
  }, []);

  const updateTaskStatus = useCallback((id: string, status: TaskStatus) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status } : t))
    );
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const reorderTasks = useCallback((reorderedFiltered: Task[]) => {
    setTasks((prev) => {
      if (reorderedFiltered.length === prev.length) {
        return reorderedFiltered;
      }
      // Safely merge reordered subset back into the full list
      const newTasks = [...prev];
      const filteredIds = reorderedFiltered.map(t => t.id);
      const originalIndices = prev
        .map((t, i) => (filteredIds.includes(t.id) ? i : -1))
        .filter(i => i !== -1);

      originalIndices.forEach((originalIndex, i) => {
        newTasks[originalIndex] = reorderedFiltered[i];
      });
      return newTasks;
    });
  }, []);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // Status filter
      if (statusFilter === 'Active' && task.status === 'completed') return false;
      if (statusFilter === 'Completed' && task.status !== 'completed') return false;
      
      // Priority filter
      if (priorityFilter !== 'All' && task.priority !== priorityFilter) return false;
      
      // Search filter
      if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      
      return true;
    });
  }, [tasks, statusFilter, priorityFilter, searchQuery]);

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === 'completed').length;
    const pending = total - completed;
    const percentage = total > 0 ? (completed / total) * 100 : 0;
    return { total, completed, pending, percentage };
  }, [tasks]);

  return {
    tasks,
    filteredTasks,
    stats,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
    addTask,
    updateTask,
    toggleTask,
    updateTaskStatus,
    toggleSubtask,
    deleteTask,
    reorderTasks,
  };
}
