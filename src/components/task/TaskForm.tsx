import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Calendar, Tag as TagIcon, AlignLeft, CheckSquare, X } from 'lucide-react';
import type { Task, Priority, Tag, Subtask } from '../../types';
import { AVAILABLE_TAGS } from '../../utils/constants';
import { SelectMenu } from '../ui/SelectMenu';

interface TaskFormProps {
  onAdd: (task: Omit<Task, 'id' | 'createdAt'>) => void;
}

export function TaskForm({ onAdd }: TaskFormProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<Priority>('Medium');
  const [dueDate, setDueDate] = useState('');
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [description, setDescription] = useState('');
  const [subtasks, setSubtasks] = useState<Omit<Subtask, 'id'>[]>([]);
  const [newSubtask, setNewSubtask] = useState('');
  
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleTag = (tag: Tag) => {
    setSelectedTags(prev => 
      prev.find(t => t.id === tag.id) 
        ? prev.filter(t => t.id !== tag.id)
        : [...prev, tag]
    );
  };

  const handleAddSubtask = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ('key' in e && (e as React.KeyboardEvent).key !== 'Enter') return;
    e.preventDefault();
    if (!newSubtask.trim()) return;
    setSubtasks(prev => [...prev, { title: newSubtask.trim(), completed: false }]);
    setNewSubtask('');
  };

  const removeSubtask = (index: number) => {
    setSubtasks(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    const trimmed = title.trim();
    if (!trimmed) return;
    
    onAdd({
      title: trimmed,
      priority,
      status: 'todo',
      dueDate: dueDate ? new Date(dueDate).getTime() : undefined,
      tags: selectedTags.length > 0 ? selectedTags : undefined,
      description: description.trim() || undefined,
      subtasks: subtasks.length > 0 ? subtasks.map(s => ({ ...s, id: crypto.randomUUID() })) : undefined,
    });
    
    // Reset form
    setTitle('');
    setPriority('Medium');
    setDueDate('');
    setSelectedTags([]);
    setDescription('');
    setSubtasks([]);
    setNewSubtask('');
    setIsExpanded(false);
  };

  return (
    <motion.div
      ref={formRef}
      className={`
        relative p-4 rounded-2xl glass-panel shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300
        ${isExpanded ? 'border-purple-300/50 glow-purple bg-white' : 'hover:bg-white/80'}
      `}
    >
      <div className="flex items-center gap-3">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onFocus={() => setIsExpanded(true)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSubmit();
          }}
          placeholder="What needs to be done?"
          className="flex-1 bg-transparent text-[var(--color-text-main)] text-[15px] font-medium placeholder-[var(--color-text-muted)] outline-none py-2 px-1"
        />
        
        {!isExpanded && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsExpanded(true)}
            className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-[var(--glass-border)] text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] transition-all duration-200 shadow-sm"
          >
            <Plus className="w-5 h-5" />
          </motion.button>
        )}
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0, marginTop: 0 }}
            animate={{ height: 'auto', opacity: 1, marginTop: 16 }}
            exit={{ height: 0, opacity: 0, marginTop: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-4 border-t border-[var(--color-border-subtle)] flex flex-col gap-4">
              
              <div className="flex items-start gap-2">
                <AlignLeft className="w-4 h-4 text-[var(--color-text-muted)] mt-2 shrink-0" />
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Add details or notes..."
                  className="w-full bg-transparent text-sm text-[var(--color-text-main)] placeholder-[var(--color-text-muted)] outline-none resize-none min-h-[60px]"
                />
              </div>

              <div className="flex flex-wrap items-center gap-4">
                {/* Priority */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-[var(--color-text-muted)]">Priority</span>
                  <SelectMenu
                    value={priority}
                    onChange={(val) => setPriority(val as Priority)}
                    options={[
                      { value: 'High', label: 'High Priority', color: 'bg-red-500' },
                      { value: 'Medium', label: 'Medium Priority', color: 'bg-orange-500' },
                      { value: 'Low', label: 'Low Priority', color: 'bg-green-500' },
                    ]}
                  />
                </div>

                {/* Due Date */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-[var(--color-text-muted)] flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> Due
                  </span>
                  <input 
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="bg-[var(--glass-bg)] border border-[var(--color-border-subtle)] rounded-lg px-3 py-1.5 text-sm text-[var(--color-text-main)] outline-none focus:border-purple-300 shadow-sm"
                  />
                </div>
              </div>

              {/* Tags */}
              <div className="flex items-center gap-2">
                 <span className="text-xs font-semibold text-[var(--color-text-muted)] flex items-center gap-1 shrink-0">
                    <TagIcon className="w-3.5 h-3.5" /> Tags
                  </span>
                 <div className="flex flex-wrap gap-2">
                    {AVAILABLE_TAGS.map(tag => {
                      const isSelected = selectedTags.some(t => t.id === tag.id);
                      return (
                        <button
                          key={tag.id}
                          onClick={() => toggleTag(tag)}
                          className={`
                            text-xs font-semibold px-2.5 py-1 rounded-md border transition-all duration-200
                            ${isSelected ? tag.color : 'bg-slate-50 border-[var(--color-border-subtle)] text-[var(--color-text-muted)] hover:bg-slate-100'}
                          `}
                        >
                          {tag.name}
                        </button>
                      );
                    })}
                 </div>
              </div>

              {/* Subtasks */}
              <div className="flex flex-col gap-2">
                <span className="text-xs font-semibold text-[var(--color-text-muted)] flex items-center gap-1">
                  <CheckSquare className="w-3.5 h-3.5" /> Subtasks
                </span>
                
                {subtasks.map((st, i) => (
                  <div key={i} className="flex items-center gap-2 px-2 py-1 group">
                    <div className="w-3 h-3 rounded-sm border border-[var(--color-border-subtle)]" />
                    <span className="text-sm text-[var(--color-text-main)] flex-1">{st.title}</span>
                    <button 
                      onClick={() => removeSubtask(i)}
                      className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-all"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
                
                <div className="flex items-center gap-2 px-1">
                  <Plus className="w-4 h-4 text-[var(--color-text-muted)] shrink-0" />
                  <input
                    type="text"
                    value={newSubtask}
                    onChange={(e) => setNewSubtask(e.target.value)}
                    onKeyDown={handleAddSubtask}
                    placeholder="Add a subtask..."
                    className="flex-1 bg-transparent text-sm text-[var(--color-text-main)] placeholder-[var(--color-text-muted)] outline-none py-1"
                  />
                  {newSubtask.trim() && (
                    <button 
                      onClick={handleAddSubtask}
                      className="text-xs font-semibold text-purple-600 hover:text-purple-500 px-2"
                    >
                      Add
                    </button>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 mt-2 border-t border-[var(--color-border-subtle)] pt-4">
                <button 
                  onClick={() => setIsExpanded(false)}
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] hover:bg-slate-100 transition-all"
                >
                  Cancel
                </button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSubmit}
                  disabled={!title.trim()}
                  className={`
                    inline-flex items-center gap-2 px-6 py-2 rounded-xl font-semibold text-sm text-white transition-all duration-300
                    ${title.trim() 
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-[0_4px_14px_rgba(168,85,247,0.4)]' 
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                    }
                  `}
                >
                  <Plus className="w-4 h-4" />
                  Add Task
                </motion.button>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
