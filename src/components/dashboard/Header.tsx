import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="text-center mb-10"
    >
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/60 border border-white/80 shadow-[0_2px_10px_rgb(0,0,0,0.02)] backdrop-blur-md text-xs font-semibold text-slate-500 mb-6">
        <Sparkles className="w-3.5 h-3.5 text-purple-500" />
        Premium Task Dashboard v2
      </div>
      <h1 className="text-4xl sm:text-5xl font-extrabold gradient-text tracking-tight pb-1">
        TaskFlow
      </h1>
      <p className="mt-3 text-base text-slate-500 font-medium max-w-md mx-auto leading-relaxed">
        Organize, prioritize, and conquer your tasks with a stunning interface.
      </p>
    </motion.header>
  );
}
