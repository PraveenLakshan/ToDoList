import { motion } from 'framer-motion';

export function Progress({ percentage }: { percentage: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="mb-8 p-5 rounded-2xl bg-white/70 border border-white/60 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
    >
      <div className="w-full">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Overall Progress</span>
          <span className="text-sm font-bold gradient-text">{Math.round(percentage)}%</span>
        </div>
        <div className="h-3 rounded-full bg-slate-100 border border-slate-200/50 overflow-hidden inset-shadow-sm">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="h-full rounded-full bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-500 progress-glow"
          />
        </div>
      </div>
    </motion.div>
  );
}
