import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import type { FilterStatus, Priority } from '../../types';

interface FiltersProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  statusFilter: FilterStatus;
  setStatusFilter: (s: FilterStatus) => void;
  priorityFilter: Priority | 'All';
  setPriorityFilter: (p: Priority | 'All') => void;
}

export function Filters({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  priorityFilter,
  setPriorityFilter,
}: FiltersProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35 }}
      className="flex flex-col sm:flex-row gap-4 mb-6"
    >
      {/* Search */}
      <div className="relative flex-1">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-slate-400" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search tasks..."
          className="w-full bg-white/70 border border-white/60 shadow-[0_2px_10px_rgb(0,0,0,0.02)] backdrop-blur-md rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-700 placeholder-slate-400 focus:border-purple-300 focus:bg-white outline-none transition-all duration-200"
        />
      </div>

      {/* Status Tabs */}
      <div className="flex bg-white/70 border border-white/60 shadow-[0_2px_10px_rgb(0,0,0,0.02)] backdrop-blur-md rounded-xl p-1">
        {(['All', 'Active', 'Completed'] as FilterStatus[]).map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
              statusFilter === status
                ? 'bg-white text-slate-800 shadow-sm border border-slate-100'
                : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Priority Dropdown */}
      <select
        value={priorityFilter}
        onChange={(e) => setPriorityFilter(e.target.value as Priority | 'All')}
        className="bg-white/70 border border-white/60 shadow-[0_2px_10px_rgb(0,0,0,0.02)] backdrop-blur-md rounded-xl px-4 py-2 text-sm text-slate-700 outline-none hover:bg-white focus:border-purple-300 transition-all duration-200 appearance-none cursor-pointer"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', paddingRight: '36px' }}
      >
        <option value="All">All Priorities</option>
        <option value="High">High</option>
        <option value="Medium">Medium</option>
        <option value="Low">Low</option>
      </select>
    </motion.div>
  );
}
