import { AlertTriangle, Clock, Zap, type LucideIcon } from 'lucide-react';
import type { Priority } from '../types';

export const STORAGE_KEY = 'taskflow-premium-tasks-v2';

export const PRIORITY_CONFIG: Record<Priority, { color: string; bg: string; glow: string; icon: LucideIcon }> = {
  High: {
    color: 'text-red-700',
    bg: 'bg-red-50 border-red-200',
    glow: '',
    icon: AlertTriangle,
  },
  Medium: {
    color: 'text-amber-700',
    bg: 'bg-amber-50 border-amber-200',
    glow: '',
    icon: Clock,
  },
  Low: {
    color: 'text-emerald-700',
    bg: 'bg-emerald-50 border-emerald-200',
    glow: '',
    icon: Zap,
  },
};

export const AVAILABLE_TAGS = [
  { id: '1', name: 'Work', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  { id: '2', name: 'Personal', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  { id: '3', name: 'Urgent', color: 'bg-red-50 text-red-700 border-red-200' },
  { id: '4', name: 'Health', color: 'bg-green-50 text-green-700 border-green-200' },
];
