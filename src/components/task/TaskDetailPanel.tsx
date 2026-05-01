import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar as CalendarIcon, AlignLeft, CheckSquare, Tag as TagIcon, Plus, Flag, Clock, Play, Pause, RotateCcw, Trash2 } from 'lucide-react';
import type { Task, Subtask, Priority } from '../../types';
import { cn, formatDate } from '../../utils/helpers';
import { SelectMenu } from '../ui/SelectMenu';

interface TaskDetailPanelProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (id: string, updates: Partial<Task>) => void;
  onDelete?: (id: string) => void;
}

export function TaskDetailPanel({ task, isOpen, onClose, onUpdate, onDelete }: TaskDetailPanelProps) {
  const [description, setDescription] = useState('');
  const [newSubtask, setNewSubtask] = useState('');
  const [title, setTitle] = useState('');
  const [timerActive, setTimerActive] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);

  // Sync local state when task changes
  useEffect(() => {
    if (task) {
      setDescription(task.description || '');
      setTitle(task.title);
      setTimeSpent(task.timeSpent || 0);
      setTimerActive(false); // Reset active state on task switch
    }
  }, [task]);

  // Timer logic
  useEffect(() => {
    let interval: number;
    if (timerActive) {
      interval = window.setInterval(() => {
        setTimeSpent((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive]);

  // Save timer data when panel closes or unmounts
  useEffect(() => {
    if (!isOpen && task) {
      if (timeSpent !== (task.timeSpent || 0)) {
        onUpdate(task.id, { timeSpent });
      }
      setTimerActive(false);
    }
  }, [isOpen, task, timeSpent, onUpdate]);

  if (!task) return null;

  const handleUpdateDescription = () => {
    if (description !== task.description) {
      onUpdate(task.id, { description });
    }
  };

  const handleUpdateTitle = () => {
    if (title.trim() && title !== task.title) {
      onUpdate(task.id, { title: title.trim() });
    } else {
      setTitle(task.title);
    }
  };

  const handlePriorityChange = (val: string) => {
    onUpdate(task.id, { priority: val as Priority });
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}h ${m}m ${s}s`;
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
  };

  const handleAddSubtask = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newSubtask.trim()) {
      const subtask: Subtask = {
        id: crypto.randomUUID(),
        title: newSubtask.trim(),
        completed: false
      };
      onUpdate(task.id, {
        subtasks: [...(task.subtasks || []), subtask]
      });
      setNewSubtask('');
    }
  };

  const toggleSubtask = (subtaskId: string) => {
    const updatedSubtasks = task.subtasks?.map(st => 
      st.id === subtaskId ? { ...st, completed: !st.completed } : st
    );
    onUpdate(task.id, { subtasks: updatedSubtasks });
  };

  const deleteSubtask = (subtaskId: string) => {
     const updatedSubtasks = task.subtasks?.filter(st => st.id !== subtaskId);
     onUpdate(task.id, { subtasks: updatedSubtasks });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%', opacity: 0.5 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0.5 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white/90 backdrop-blur-xl border-l border-[var(--glass-border)] shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 pl-6 border-b border-[var(--color-border-subtle)] bg-white/50">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={handleUpdateTitle}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.currentTarget.blur();
                  }
                }}
                className="text-xl font-bold text-[var(--color-text-main)] truncate pr-4 bg-transparent border-none outline-none focus:ring-2 focus:ring-purple-500/20 rounded px-1 -ml-1 transition-all w-full"
              />
              <div className="flex items-center gap-1 shrink-0">
                {onDelete && (
                  <button
                    onClick={() => {
                      onDelete(task.id);
                      onClose();
                    }}
                    title="Delete Task"
                    className="p-2 rounded-full hover:bg-red-50 text-[var(--color-text-muted)] hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-slate-100 text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
              
              {/* Properties */}
              <div className="space-y-4">
                <div className="flex items-center grid grid-cols-[100px_1fr] gap-4">
                  <div className="flex items-center gap-2 text-[var(--color-text-muted)] text-sm font-medium">
                    <Flag className="w-4 h-4" />
                    Priority
                  </div>
                  <div>
                    <SelectMenu
                      value={task.priority}
                      onChange={handlePriorityChange}
                      options={[
                        { value: 'High', label: 'High Priority', color: 'bg-red-500' },
                        { value: 'Medium', label: 'Medium Priority', color: 'bg-orange-500' },
                        { value: 'Low', label: 'Low Priority', color: 'bg-green-500' },
                      ]}
                      className="-ml-3"
                    />
                  </div>
                </div>

                <div className="flex items-center grid grid-cols-[100px_1fr] gap-4">
                  <div className="flex items-center gap-2 text-[var(--color-text-muted)] text-sm font-medium">
                    <CalendarIcon className="w-4 h-4" />
                    Due Date
                  </div>
                  <div className="text-sm font-semibold text-[var(--color-text-main)]">
                    {task.dueDate ? formatDate(task.dueDate) : 'No due date'}
                  </div>
                </div>

                <div className="flex items-center grid grid-cols-[100px_1fr] gap-4">
                  <div className="flex items-center gap-2 text-[var(--color-text-muted)] text-sm font-medium">
                    <TagIcon className="w-4 h-4" />
                    Tags
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {task.tags && task.tags.length > 0 ? (
                      task.tags.map(tag => (
                        <span key={tag.id} className={cn("text-xs font-bold px-2 py-1 rounded-md border", tag.color)}>
                          {tag.name}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-[var(--color-text-muted)]">No tags</span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-2 mt-4 bg-slate-50 border border-[var(--color-border-subtle)] rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[var(--color-text-main)] text-sm font-semibold">
                      <Clock className="w-4 h-4 text-blue-500" />
                      Time Tracker
                    </div>
                    <div className="text-lg font-mono font-bold tracking-tight text-blue-600 bg-blue-50 px-3 py-1 rounded-md">
                      {formatTime(timeSpent)}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => setTimerActive(!timerActive)}
                      className={cn(
                        "flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition-all",
                        timerActive 
                          ? "bg-amber-100 text-amber-700 hover:bg-amber-200" 
                          : "bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
                      )}
                    >
                      {timerActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      {timerActive ? 'Pause' : 'Start'}
                    </button>
                    <button
                      onClick={() => { setTimerActive(false); setTimeSpent(0); onUpdate(task.id, { timeSpent: 0 }); }}
                      className="p-2 rounded-lg bg-slate-200 text-slate-600 hover:bg-slate-300 transition-all"
                      title="Reset Timer"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              <hr className="border-[var(--color-border-subtle)]" />

              {/* Description */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-[var(--color-text-main)] font-semibold">
                  <AlignLeft className="w-5 h-5 text-[var(--color-text-muted)]" />
                  Description
                </div>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  onBlur={handleUpdateDescription}
                  placeholder="Add a more detailed description..."
                  className="w-full min-h-[120px] p-4 rounded-xl bg-slate-50 border border-[var(--color-border-subtle)] focus:bg-white focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-sm resize-y text-[var(--color-text-main)] placeholder-[var(--color-text-muted)]"
                />
              </div>

              {/* Subtasks */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[var(--color-text-main)] font-semibold">
                    <CheckSquare className="w-5 h-5 text-[var(--color-text-muted)]" />
                    Subtasks
                  </div>
                  <span className="text-xs font-bold text-[var(--color-text-muted)] bg-slate-100 px-2 py-1 rounded-md">
                    {task.subtasks?.filter(st => st.completed).length || 0}/{task.subtasks?.length || 0}
                  </span>
                </div>

                <div className="space-y-2">
                  {task.subtasks?.map(st => (
                    <div key={st.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 group border border-transparent hover:border-[var(--color-border-subtle)] transition-all">
                      <input
                        type="checkbox"
                        checked={st.completed}
                        onChange={() => toggleSubtask(st.id)}
                        className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 border-slate-300"
                      />
                      <span className={cn(
                        "flex-1 text-sm transition-all",
                        st.completed ? "text-[var(--color-text-muted)] line-through" : "text-[var(--color-text-main)]"
                      )}>
                        {st.title}
                      </span>
                      <button 
                        onClick={() => deleteSubtask(st.id)}
                        className="opacity-0 group-hover:opacity-100 p-1.5 text-[var(--color-text-muted)] hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}

                  <div className="relative mt-2">
                    <input
                      type="text"
                      value={newSubtask}
                      onChange={(e) => setNewSubtask(e.target.value)}
                      onKeyDown={handleAddSubtask}
                      placeholder="Add an item..."
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-transparent focus:bg-white focus:border-purple-300 focus:ring-4 focus:ring-purple-500/10 transition-all text-sm placeholder-[var(--color-text-muted)]"
                    />
                    <Plus className="w-4 h-4 text-[var(--color-text-muted)] absolute left-4 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
              </div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
