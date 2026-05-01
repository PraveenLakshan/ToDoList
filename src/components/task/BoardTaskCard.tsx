import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Calendar, GripVertical, CheckCircle2 } from 'lucide-react';
import type { Task } from '../../types';
import { PriorityBadge } from '../ui/PriorityBadge';
import { cn, formatDate, isOverdue } from '../../utils/helpers';

interface BoardTaskCardProps {
  task: Task;
  onSelect: () => void;
  onToggle: () => void;
}

export function BoardTaskCard({ task, onSelect, onToggle }: BoardTaskCardProps) {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: 'Task',
      task,
    },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging) {
    return (
      <div 
        ref={setNodeRef} 
        style={style} 
        className="opacity-30 bg-white border-2 border-purple-400 border-dashed rounded-2xl h-[120px]"
      />
    );
  }

  const overdue = isOverdue(task.dueDate);

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={(e) => {
        if ((e.target as HTMLElement).closest('input') || (e.target as HTMLElement).closest('.cursor-grab')) return;
        onSelect();
      }}
      className={cn(
        "group relative flex flex-col p-4 rounded-2xl border transition-all duration-200 cursor-pointer shadow-sm bg-white hover:shadow-md hover:border-purple-200",
        task.status === 'completed' && "opacity-60 bg-slate-50"
      )}
    >
      <div className="flex items-start gap-3 w-full">
        <div 
          {...attributes} 
          {...listeners} 
          className="mt-0.5 cursor-grab active:cursor-grabbing text-slate-300 hover:text-slate-500 shrink-0"
        >
          <GripVertical className="w-4 h-4" />
        </div>

        <div className="flex-1 min-w-0 flex flex-col gap-2">
          <div className="flex items-start justify-between gap-2">
            <h4 className={cn(
              "text-[14px] font-semibold leading-tight",
              task.status === 'completed' ? "text-slate-400 line-through" : "text-slate-800"
            )}>
              {task.title}
            </h4>
            <input
              type="checkbox"
              checked={task.status === 'completed'}
              onChange={onToggle}
              className="mt-0.5 custom-checkbox shrink-0"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 mt-1">
            <PriorityBadge priority={task.priority} />
            
            {task.subtasks && task.subtasks.length > 0 && (
              <div className="flex items-center gap-1 text-[11px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded-md">
                <CheckCircle2 className="w-3 h-3" />
                {task.subtasks.filter(st => st.completed).length}/{task.subtasks.length}
              </div>
            )}

            {task.dueDate && (
              <div className={cn(
                "flex items-center gap-1.5 text-[11px] font-bold px-2 py-0.5 rounded-md",
                overdue && task.status !== 'completed'
                  ? "text-red-600 bg-red-50 border border-red-100"
                  : "text-slate-500 bg-slate-50 border border-slate-200"
              )}>
                <Calendar className="w-3 h-3" />
                {formatDate(task.dueDate)}
              </div>
            )}
          </div>
          
          {task.tags && task.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {task.tags.map(tag => (
                <div key={tag.id} className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded border", tag.color)}>
                  {tag.name}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
