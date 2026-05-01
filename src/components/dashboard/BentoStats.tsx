import { motion } from 'framer-motion';
import { CheckCircle2, TrendingUp } from 'lucide-react';

interface BentoStatsProps {
  stats: { total: number; completed: number; pending: number; percentage: number };
}

export function BentoStats({ stats }: BentoStatsProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
    >
      {/* Progress Ring (Spans 2 columns) */}
      <div className="md:col-span-2 bg-[var(--color-bg-card)] rounded-2xl p-6 border border-[var(--color-border-subtle)] shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex items-center justify-between">
        <div>
          <h3 className="text-[var(--color-text-main)] font-bold text-lg">Your Progress</h3>
          <p className="text-[var(--color-text-muted)] text-sm font-medium mt-1">Keep it up! You're doing great.</p>
        </div>
        
        <div className="relative w-16 h-16 flex items-center justify-center shrink-0">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-slate-100"
              strokeWidth="3"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <motion.path
              className="text-purple-500 drop-shadow-[0_2px_4px_rgba(168,85,247,0.3)]"
              strokeWidth="3"
              strokeDasharray={`${stats.percentage}, 100`}
              strokeLinecap="round"
              stroke="currentColor"
              fill="none"
              initial={{ strokeDasharray: "0, 100" }}
              animate={{ strokeDasharray: `${stats.percentage}, 100` }}
              transition={{ duration: 1, ease: "easeOut" }}
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[11px] font-bold text-[var(--color-text-main)]">
              {Math.round(stats.percentage)}%
            </span>
          </div>
        </div>
      </div>

      {/* Done Stat */}
      <div className="col-span-1 bg-[var(--color-bg-card)] rounded-2xl p-5 border border-[var(--color-border-subtle)] shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col justify-between">
        <div className="w-10 h-10 rounded-xl bg-emerald-50 shadow-sm flex items-center justify-center text-emerald-500 mb-2">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <div>
          <p className="text-[var(--color-text-muted)] text-xs font-bold uppercase tracking-wider">Done</p>
          <p className="text-3xl font-black text-[var(--color-text-main)] tracking-tight mt-1">{stats.completed}</p>
        </div>
      </div>

      {/* Pending Stat */}
      <div className="col-span-1 bg-[var(--color-bg-card)] rounded-2xl p-5 border border-[var(--color-border-subtle)] shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col justify-between">
         <div className="w-10 h-10 rounded-xl bg-amber-50 shadow-sm flex items-center justify-center text-amber-500 mb-2">
          <TrendingUp className="w-5 h-5" />
        </div>
        <div>
          <p className="text-[var(--color-text-muted)] text-xs font-bold uppercase tracking-wider">Pending</p>
          <p className="text-3xl font-black text-[var(--color-text-main)] tracking-tight mt-1">{stats.pending}</p>
        </div>
      </div>
    </motion.div>
  );
}
