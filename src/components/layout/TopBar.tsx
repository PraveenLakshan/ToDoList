import { useEffect, useRef } from 'react';
import { Search, Settings, Bell, Menu } from 'lucide-react';
import type { Priority } from '../../types';
import { SelectMenu } from '../ui/SelectMenu';

interface TopBarProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  priorityFilter: Priority | 'All';
  setPriorityFilter: (p: Priority | 'All') => void;
  onOpenMenu?: () => void;
}

export function TopBar({ searchQuery, setSearchQuery, priorityFilter, setPriorityFilter, onOpenMenu }: TopBarProps) {
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);
  return (
    <header className="h-16 border-b border-[var(--glass-border)] bg-transparent backdrop-blur-sm sticky top-0 z-10 px-4 sm:px-8 flex items-center justify-between gap-4 transition-colors duration-300">
      
      <div className="flex items-center gap-2 sm:gap-4 w-full max-w-md">
        {/* Mobile Menu Button */}
        {onOpenMenu && (
          <button 
            onClick={onOpenMenu}
            className="lg:hidden p-2 -ml-2 rounded-lg text-[var(--color-text-muted)] hover:bg-[var(--glass-bg)] hover:text-[var(--color-text-main)] transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        {/* Left side Search */}
        <div className="flex items-center w-full relative group">
          <Search className="w-4 h-4 text-[var(--color-text-muted)] absolute left-3 group-focus-within:text-purple-500 transition-colors" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search your tasks..."
            className="w-full bg-[var(--color-bg-deep)] border border-transparent rounded-lg py-1.5 pl-9 pr-12 text-sm text-[var(--color-text-main)] placeholder-[var(--color-text-muted)] focus:bg-[var(--color-bg-card)] focus:border-purple-200 focus:shadow-[0_0_0_2px_rgba(168,85,247,0.1)] outline-none transition-all"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 pointer-events-none">
            <kbd className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded border border-[var(--color-border-subtle)] bg-[var(--color-bg-card)] text-[10px] font-medium text-[var(--color-text-muted)]">
              <span className="text-[11px]">⌘</span>K
            </kbd>
          </div>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
        <div className="hidden sm:block">
          <SelectMenu
            value={priorityFilter}
            onChange={(val) => setPriorityFilter(val as Priority | 'All')}
            options={[
              { value: 'All', label: 'All Priorities' },
              { value: 'High', label: 'High Priority', color: 'bg-red-500' },
              { value: 'Medium', label: 'Medium Priority', color: 'bg-orange-500' },
              { value: 'Low', label: 'Low Priority', color: 'bg-green-500' },
            ]}
          />
        </div>

        <div className="hidden sm:block h-4 w-px bg-[var(--color-border-subtle)]" />
        
        <button className="p-1.5 sm:p-2 rounded-lg text-[var(--color-text-muted)] hover:bg-[var(--glass-bg)] hover:text-[var(--color-text-main)] transition-colors">
          <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
        <button className="hidden sm:block p-1.5 sm:p-2 rounded-lg text-[var(--color-text-muted)] hover:bg-[var(--glass-bg)] hover:text-[var(--color-text-main)] transition-colors">
          <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-tr from-purple-100 to-cyan-100 border border-[var(--glass-border)] ml-1 sm:ml-2 shrink-0" />
      </div>
    </header>
  );
}
