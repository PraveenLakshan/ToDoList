import { useState } from 'react';
import { 
  DndContext, 
  DragOverlay, 
  pointerWithin, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
} from '@dnd-kit/core';
import type {
  DragStartEvent,
  DragEndEvent
} from '@dnd-kit/core';
import { 
  SortableContext, 
  arrayMove, 
  sortableKeyboardCoordinates,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import type { Task, TaskStatus } from '../../types';
import { BoardColumn } from './BoardColumn';
import { BoardTaskCard } from './BoardTaskCard';

interface TaskBoardProps {
  tasks: Task[];
  onUpdateStatus: (id: string, newStatus: TaskStatus) => void;
  onReorderTasks: (tasks: Task[]) => void;
  onSelectTask: (task: Task) => void;
  onToggleTask: (id: string) => void;
}

export function TaskBoard({ tasks, onUpdateStatus, onReorderTasks, onSelectTask, onToggleTask }: TaskBoardProps) {
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const columns: { id: TaskStatus; title: string }[] = [
    { id: 'todo', title: 'To Do' },
    { id: 'in_progress', title: 'In Progress' },
    { id: 'completed', title: 'Completed' },
  ];

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = tasks.find(t => t.id === active.id);
    if (task) setActiveTask(task);
  };


  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const activeTask = tasks.find(t => t.id === activeId);
    if (!activeTask) return;

    const isOverTask = over.data.current?.type === 'Task';
    const isOverColumn = over.data.current?.type === 'Column';

    if (isOverTask) {
      const overTask = tasks.find(t => t.id === overId);
      if (!overTask) return;

      if (activeTask.status !== overTask.status) {
        onUpdateStatus(activeTask.id, overTask.status);
        return;
      }

      // Reorder within the same column
      const statusTasks = tasks.filter(t => t.status === activeTask.status);
      const activeIndex = statusTasks.findIndex(t => t.id === activeId);
      const overIndex = statusTasks.findIndex(t => t.id === overId);
      
      const newStatusTasks = arrayMove(statusTasks, activeIndex, overIndex);
      const otherTasks = tasks.filter(t => t.status !== activeTask.status);
      onReorderTasks([...otherTasks, ...newStatusTasks]);
    } else if (isOverColumn) {
      const overColumnId = over.id as TaskStatus;
      if (activeTask.status !== overColumnId) {
        onUpdateStatus(activeTask.id, overColumnId);
      }
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={pointerWithin}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-6 h-full overflow-x-auto pb-4 custom-scrollbar">
        {columns.map((col) => {
          const columnTasks = tasks.filter((task) => task.status === col.id);
          return (
            <BoardColumn key={col.id} column={col} tasks={columnTasks}>
              <SortableContext 
                items={columnTasks.map(t => t.id)} 
                strategy={verticalListSortingStrategy}
              >
                <div className="flex flex-col gap-3 min-h-[150px]">
                  {columnTasks.map(task => (
                    <BoardTaskCard 
                      key={task.id} 
                      task={task} 
                      onSelect={() => onSelectTask(task)}
                      onToggle={() => onToggleTask(task.id)}
                    />
                  ))}
                </div>
              </SortableContext>
            </BoardColumn>
          );
        })}
      </div>

      <DragOverlay>
        {activeTask ? (
          <div className="opacity-80 rotate-2 scale-105 transition-transform cursor-grabbing shadow-2xl">
            <BoardTaskCard 
              task={activeTask} 
              onSelect={() => {}} 
              onToggle={() => {}} 
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
