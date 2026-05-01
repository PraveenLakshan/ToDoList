import type { Priority } from '../../types';
import { PRIORITY_CONFIG } from '../../utils/constants';

export function PriorityBadge({ priority, className = '' }: { priority: Priority; className?: string }) {
  const config = PRIORITY_CONFIG[priority];
  const Icon = config.icon;
  return (
    <span
      className={`
        inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase
        border ${config.bg} ${config.color} ${config.glow}
        transition-all duration-200 ${className}
      `}
    >
      <Icon className="w-3 h-3" />
      {priority}
    </span>
  );
}
