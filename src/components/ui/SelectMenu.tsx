import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '../../utils/helpers';

interface SelectOption {
  value: string;
  label: string;
  color?: string; // Optional tailwind color class for the dot
}

interface SelectMenuProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  className?: string;
}

export function SelectMenu({ value, onChange, options, className }: SelectMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value) || options[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={cn("relative", className)} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-transparent hover:bg-slate-50 transition-colors text-sm font-semibold text-[var(--color-text-main)] outline-none focus-visible:ring-2 focus-visible:ring-purple-500/50 group"
      >
        {selectedOption?.color && (
          <span className={cn("w-2 h-2 rounded-full", selectedOption.color)} />
        )}
        {selectedOption?.label}
        <ChevronDown className={cn(
          "w-4 h-4 text-[var(--color-text-muted)] transition-transform duration-200 group-hover:text-[var(--color-text-main)]",
          isOpen && "rotate-180"
        )} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute top-full right-0 mt-2 w-48 bg-white/90 backdrop-blur-xl border border-[var(--glass-border)] rounded-xl shadow-[0_12px_40px_rgb(0,0,0,0.08)] py-1.5 z-50 overflow-hidden"
          >
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2 text-sm text-left transition-colors",
                  value === option.value 
                    ? "bg-purple-50 text-purple-700 font-semibold" 
                    : "text-[var(--color-text-main)] hover:bg-slate-50"
                )}
              >
                <div className="flex items-center gap-2">
                  {option.color && (
                    <span className={cn("w-2 h-2 rounded-full", option.color)} />
                  )}
                  {option.label}
                </div>
                {value === option.value && (
                  <Check className="w-4 h-4 text-purple-600" />
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
