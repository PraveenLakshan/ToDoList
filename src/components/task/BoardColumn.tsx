import { useDroppable } from '@dnd-kit/core';
import type { Task, TaskStatus } from '../../types';

interface BoardColumnProps {
  column: { id: TaskStatus; title: string };
  tasks: Task[];
  children: React.ReactNode;
}

export function BoardColumn({ column, tasks, children }: BoardColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    data: {
      type: 'Column',
      column,
    },
  });

  return (
    <div className="flex flex-col w-full md:flex-1 md:min-w-[280px] md:max-w-[350px]">
      <div className="flex items-center justify-between mb-4 px-1">
        <h3 className="font-bold text-[var(--color-text-main)] text-sm tracking-wide flex items-center gap-2">
          {column.title}
          <span className="bg-slate-100 text-[var(--color-text-muted)] text-xs px-2 py-0.5 rounded-full font-semibold">
            {tasks.length}
          </span>
        </h3>
      </div>
      
      <div 
        ref={setNodeRef}
        className={`flex-1 p-3 rounded-2xl transition-colors duration-200 border ${
          isOver 
            ? 'bg-purple-50/50 border-purple-200' 
            : 'bg-slate-50/50 border-[var(--color-border-subtle)]'
        }`}
      >
        {children}
      </div>
    </div>
  );
}
