import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTasks } from './hooks/useTasks';

import { Sidebar } from './components/layout/Sidebar';
import { TopBar } from './components/layout/TopBar';
import { BentoStats } from './components/dashboard/BentoStats';
import { TaskForm } from './components/task/TaskForm';
import { TaskList } from './components/task/TaskList';
import { TaskBoard } from './components/task/TaskBoard';
import { TaskDetailPanel } from './components/task/TaskDetailPanel';
import { LayoutList, KanbanSquare } from 'lucide-react';

export default function App() {
  const {
    tasks,
    updateTask,
    updateTaskStatus,
    filteredTasks,
    stats,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
    addTask,
    toggleTask,
    toggleSubtask,
    deleteTask,
    reorderTasks,
  } = useTasks();

  const [isTaskFormVisible, setIsTaskFormVisible] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'board'>('list');

  const selectedTask = tasks.find(t => t.id === selectedTaskId) || null;

  return (
    <div className={`flex h-screen w-screen overflow-hidden bg-[var(--color-bg-deep)] p-4 sm:p-6 gap-6 text-[var(--color-text-main)] selection:bg-purple-500/30 selection:text-purple-900 transition-colors duration-300 relative`}>
      {/* Fluid Background Orbs */}
      <div className="fluid-bg-orb w-[800px] h-[800px] top-[-10%] left-[-10%] bg-purple-300/40" style={{ animationDelay: '0s' }} />
      <div className="fluid-bg-orb w-[600px] h-[600px] top-[20%] right-[-5%] bg-blue-200/40" style={{ animationDelay: '-5s' }} />
      <div className="fluid-bg-orb w-[700px] h-[700px] bottom-[-10%] left-[20%] bg-pink-200/40" style={{ animationDelay: '-10s' }} />

      <Sidebar 
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        onAddTaskClick={() => setIsTaskFormVisible(true)}
      />

      <main className="flex-1 flex flex-col relative z-10 overflow-hidden vision-glass rounded-[2rem]">
        <TopBar 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          priorityFilter={priorityFilter}
          setPriorityFilter={setPriorityFilter}
        />

        <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
          <div className="max-w-5xl mx-auto pb-12">
            
            <BentoStats stats={stats} />

            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-bold text-[var(--color-text-main)]">Tasks</h2>
                
                <div className="flex items-center p-1 bg-slate-100 rounded-lg">
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded-md transition-all ${
                      viewMode === 'list' 
                        ? 'bg-white text-purple-600 shadow-sm' 
                        : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-main)]'
                    }`}
                  >
                    <LayoutList className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('board')}
                    className={`p-1.5 rounded-md transition-all ${
                      viewMode === 'board' 
                        ? 'bg-white text-purple-600 shadow-sm' 
                        : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-main)]'
                    }`}
                  >
                    <KanbanSquare className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {!isTaskFormVisible && (
                <button 
                  onClick={() => setIsTaskFormVisible(true)}
                  className="text-sm font-semibold text-purple-600 hover:text-purple-700 transition-colors bg-purple-50 px-4 py-1.5 rounded-lg"
                >
                  + Add New Task
                </button>
              )}
            </div>

            <AnimatePresence>
              {isTaskFormVisible && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  className="overflow-hidden"
                >
                  <TaskForm onAdd={(task) => {
                    addTask(task);
                    setIsTaskFormVisible(false);
                  }} />
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={viewMode === 'board' ? "h-[500px]" : ""}
            >
              {viewMode === 'list' ? (
                <TaskList
                  tasks={filteredTasks}
                  onReorder={reorderTasks}
                  onToggle={toggleTask}
                  onToggleSubtask={toggleSubtask}
                  onDelete={deleteTask}
                  onSelect={(task) => setSelectedTaskId(task.id)}
                />
              ) : (
                <TaskBoard
                  tasks={filteredTasks}
                  onUpdateStatus={updateTaskStatus}
                  onReorderTasks={reorderTasks}
                  onSelectTask={(task) => setSelectedTaskId(task.id)}
                  onToggleTask={toggleTask}
                />
              )}
            </motion.div>

          </div>
        </div>

        <TaskDetailPanel
          task={selectedTask}
          isOpen={selectedTaskId !== null}
          onClose={() => setSelectedTaskId(null)}
          onUpdate={updateTask}
          onDelete={deleteTask}
        />
      </main>
    </div>
  );
}
