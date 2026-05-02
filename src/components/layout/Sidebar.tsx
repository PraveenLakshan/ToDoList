import { motion, AnimatePresence } from 'framer-motion';
import { Plus, LayoutGrid, CheckCircle2, CircleDashed, Hash, X } from 'lucide-react';
import type { FilterStatus } from '../../types';
import { AVAILABLE_TAGS } from '../../utils/constants';

interface SidebarProps {
  statusFilter: FilterStatus;
  setStatusFilter: (s: FilterStatus) => void;
  onAddTaskClick: () => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ statusFilter, setStatusFilter, onAddTaskClick, isOpen = false, onClose }: SidebarProps) {
  const navItems = [
    { id: 'All', label: 'All Tasks', icon: LayoutGrid },
    { id: 'Active', label: 'In Progress', icon: CircleDashed },
    { id: 'Completed', label: 'Completed', icon: CheckCircle2 },
  ] as const;

  return (
    <>
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      <aside className={`fixed inset-y-0 left-0 z-50 w-64 h-full vision-glass flex flex-col pt-8 pb-6 px-4 shrink-0 rounded-r-[2rem] lg:rounded-[2rem] transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between px-2 mb-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center shadow-sm">
              <CheckCircle2 className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-indigo-700">
              TaskFlow
            </h1>
          </div>
          {onClose && (
            <button 
              onClick={onClose}
              className="lg:hidden p-2 rounded-full hover:bg-slate-100 text-[var(--color-text-muted)] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onAddTaskClick}
        className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white py-2.5 rounded-xl font-semibold text-sm shadow-[0_4px_14px_rgba(0,0,0,0.1)] hover:bg-slate-800 transition-colors mb-8"
      >
        <Plus className="w-4 h-4" /> New Task
      </motion.button>

      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        <div className="space-y-1 mb-8">
          <p className="px-3 text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">Views</p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = statusFilter === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setStatusFilter(item.id as FilterStatus)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive 
                    ? 'bg-purple-50 text-purple-700' 
                    : 'text-[var(--color-text-muted)] hover:bg-slate-50 hover:text-[var(--color-text-main)]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-purple-600' : 'text-slate-400'}`} />
                {item.label}
              </button>
            );
          })}
        </div>

        <div>
          <p className="px-3 text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-wider mb-2 flex items-center gap-1">
            <Hash className="w-3.5 h-3.5" /> Tags
          </p>
          <div className="space-y-1">
            {AVAILABLE_TAGS.map(tag => (
              <div key={tag.id} className="flex items-center gap-2 px-3 py-1.5 group cursor-default">
                <div className={`w-2 h-2 rounded-full ${tag.color.split(' ')[0].replace('bg-', 'bg-').replace('50', '400')}`} />
                <span className="text-sm font-medium text-[var(--color-text-muted)] group-hover:text-[var(--color-text-main)] transition-colors">
                  {tag.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
    </>
  );
}
