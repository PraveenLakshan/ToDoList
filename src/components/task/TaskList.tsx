import { Reorder, AnimatePresence, motion } from 'framer-motion';
import { Inbox } from 'lucide-react';
import { TaskItem } from './TaskItem';
import type { Task } from '../../types';

interface TaskListProps {
  tasks: Task[];
  onReorder: (newTasks: Task[]) => void;
  onToggle: (id: string) => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
  onDelete: (id: string) => void;
  onSelect: (task: Task) => void;
}

export function TaskList({ tasks, onReorder, onToggle, onToggleSubtask, onDelete, onSelect }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-20 px-8"
      >
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-200 to-cyan-200 rounded-full blur-2xl opacity-50" />
          <div className="relative p-6 rounded-2xl bg-white/70 border border-white/60 shadow-sm backdrop-blur-xl">
            <Inbox className="w-12 h-12 text-slate-300" />
          </div>
        </div>
        <h3 className="text-xl font-bold text-slate-700 mb-2">No tasks found</h3>
        <p className="text-sm text-slate-500 text-center max-w-xs leading-relaxed">
          Looks like you're all caught up or your filter is too strict.
        </p>
      </motion.div>
    );
  }

  return (
    <Reorder.Group axis="y" values={tasks} onReorder={onReorder} className="flex flex-col gap-3">
      <AnimatePresence mode="popLayout">
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onToggle={onToggle}
            onToggleSubtask={onToggleSubtask}
            onDelete={onDelete}
            onSelect={() => onSelect(task)}
          />
        ))}
      </AnimatePresence>
    </Reorder.Group>
  );
}
