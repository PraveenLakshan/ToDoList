import { useState } from 'react';
import { motion, Reorder, AnimatePresence } from 'framer-motion';
import { Trash2, GripVertical, Calendar, Tag as TagIcon, ChevronDown, CheckCircle2, Circle } from 'lucide-react';
import type { Task } from '../../types';
import { PriorityBadge } from '../ui/PriorityBadge';
import { formatDate, isOverdue, cn } from '../../utils/helpers';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
  onDelete: (id: string) => void;
  onSelect?: () => void;
}

export function TaskItem({ task, onToggle, onToggleSubtask, onDelete, onSelect }: TaskItemProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const overdue = isOverdue(task.dueDate);

  return (
    <Reorder.Item
      value={task}
      id={task.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      whileDrag={{ scale: 1.02, boxShadow: "0 20px 40px rgba(0,0,0,0.08)", zIndex: 50 }}
      whileTap={{ scale: 0.99 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "group relative flex flex-col p-4 rounded-3xl border transition-all duration-300 glass-panel shadow-[0_2px_10px_rgb(0,0,0,0.02)]",
        task.status === 'completed'
          ? 'bg-slate-50/50 border-[var(--color-border-subtle)] opacity-60'
          : 'border-[var(--glass-border)] hover:bg-[var(--glass-bg)] hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgb(0,0,0,0.06)]',
        onSelect && 'cursor-pointer'
      )}
      onClick={(e) => {
        // Prevent selection if clicking drag handle, checkbox, or delete button
        if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('input') || (e.target as HTMLElement).closest('.cursor-grab')) {
          return;
        }
        onSelect?.();
      }}
    >
      <div className="flex items-center gap-4 w-full">
        {/* Drag Handle & Checkbox */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="cursor-grab active:cursor-grabbing text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] shrink-0">
            <GripVertical className="w-5 h-5" />
          </div>
        <input
          type="checkbox"
          id={`task-${task.id}`}
          checked={task.status === 'completed'}
          onChange={() => onToggle(task.id)}
          className="custom-checkbox shrink-0"
        />
      </div>

        {/* Content */}
        <div className="flex-1 flex flex-col xl:flex-row xl:items-center justify-between gap-3 min-w-0">
          <div className="flex-1 min-w-0 flex items-center gap-2">
            <label
              htmlFor={`task-${task.id}`}
              className={cn(
                "text-[15px] font-semibold cursor-pointer select-none transition-all duration-300 block truncate",
                task.status === 'completed' ? 'line-through text-[var(--color-text-muted)]' : 'text-[var(--color-text-main)]'
              )}
            >
              {task.title}
            </label>
            {(task.description || (task.subtasks && task.subtasks.length > 0)) && (
              <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1 rounded-md text-[var(--color-text-muted)] hover:bg-slate-100 transition-colors"
              >
                <ChevronDown className={cn("w-4 h-4 transition-transform", isExpanded && "rotate-180")} />
              </button>
            )}
          </div>

        {/* Metadata Row */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <div className="shrink-0 mr-1">
            <PriorityBadge priority={task.priority} />
          </div>

            {(task.dueDate || (task.tags && task.tags.length > 0) || (task.subtasks && task.subtasks.length > 0)) && (
              <div className="flex items-center gap-2">
                {task.subtasks && task.subtasks.length > 0 && (
                  <div className="text-[11px] font-bold text-[var(--color-text-muted)]">
                    {task.subtasks.filter(st => st.completed).length}/{task.subtasks.length}
                  </div>
                )}
                {task.dueDate && (
                  <div className={cn(
                    "flex items-center gap-1.5 text-[11px] font-bold px-2 py-0.5 rounded-full border",
                    overdue && task.status !== 'completed'
                      ? "text-red-600 bg-red-50 border-red-200"
                      : "text-[var(--color-text-muted)] bg-slate-50 border-[var(--color-border-subtle)]"
                  )}>
                  <Calendar className="w-3 h-3" />
                  {formatDate(task.dueDate)}
                </div>
              )}

              {task.tags?.map(tag => (
                <div key={tag.id} className={cn("flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md border", tag.color)}>
                  <TagIcon className="w-3 h-3" />
                  {tag.name}
                </div>
              ))}
            </div>
          )}
        </div>
        </div>

        {/* Delete Button */}
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0.8 }}
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          onClick={(e) => {
            e.stopPropagation();
            onDelete(task.id);
          }}
          className="p-2 rounded-xl bg-red-50 border border-red-100 text-red-500 hover:bg-red-100 hover:border-red-200 transition-all duration-200 shrink-0 shadow-sm ml-1"
        >
          <Trash2 className="w-4 h-4" />
        </motion.button>
      </div>

      {/* Expanded Content (Description & Subtasks) */}
      <AnimatePresence>
        {(isExpanded || (isHovered && task.status !== 'completed' && !isExpanded)) && (task.description || (task.subtasks && task.subtasks.length > 0)) && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="pl-12 pr-4 pt-2 pb-1 overflow-hidden"
          >
            {task.description && (
              <p className="text-sm text-[var(--color-text-muted)] whitespace-pre-wrap mb-3 leading-relaxed">
                {task.description}
              </p>
            )}

            {task.subtasks && task.subtasks.length > 0 && (
              <div className="flex flex-col gap-2">
                {task.subtasks.map((st) => (
                  <div key={st.id} className="flex items-center gap-2 group/subtask cursor-pointer" onClick={(e) => { e.stopPropagation(); onToggleSubtask(task.id, st.id); }}>
                    {st.completed ? (
                      <CheckCircle2 className="w-4 h-4 text-purple-500 shrink-0 transition-colors" />
                    ) : (
                      <Circle className="w-4 h-4 text-[var(--color-border-subtle)] group-hover/subtask:text-purple-400 shrink-0 transition-colors" />
                    )}
                    <span className={cn(
                      "text-sm transition-all",
                      st.completed ? "text-[var(--color-text-muted)] line-through" : "text-[var(--color-text-main)]"
                    )}>
                      {st.title}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </Reorder.Item>
  );
}
