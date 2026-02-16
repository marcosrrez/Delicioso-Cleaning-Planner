import React from 'react';
import { ChevronRight } from 'lucide-react';
import { motion as Motion } from 'framer-motion';
import { ENERGY_ICONS, DAY_LETTERS, DAY_LABELS } from './constants';

export default function TaskBankSidebar({ onClose, taskBank, viewMode, onAddTask, weekKey }) {
  const filtered = taskBank.filter(t =>
    viewMode === 'weekly'
      ? t.frequency === 'daily' || t.frequency === 'weekly'
      : t.frequency === viewMode
  );

  return (
    <>
      <Motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-50 no-print"
        aria-hidden="true"
      />
      <Motion.div
        initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="fixed right-0 top-0 h-full w-full max-w-md bg-white dark:bg-slate-900 shadow-2xl z-50 flex flex-col no-print"
        role="dialog"
        aria-modal="true"
        aria-label="Task library"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4 border-b-2 border-slate-50 dark:border-slate-800">
          <div>
            <h2 className="text-2xl capitalize text-slate-800 dark:text-white">Task Library</h2>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest mt-0.5">
              Martha-approved suggestions
            </p>
          </div>
          <button onClick={onClose} className="p-2 bg-brand-cream dark:bg-slate-800 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors" aria-label="Close task library">
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Task list */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {filtered.map(task => (
            <div
              key={task.id}
              className="p-4 bg-brand-cream dark:bg-slate-800 rounded-2xl border-2 border-white dark:border-slate-700 hover:scale-[1.01] transition-transform"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 font-bold text-sm text-slate-700 dark:text-slate-200">
                  <span aria-hidden="true">{ENERGY_ICONS[task.energy]}</span>
                  <span>{task.text}</span>
                </div>
              </div>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 leading-tight mb-3">
                <strong className="text-slate-500 dark:text-slate-400">WHY:</strong> {task.why}
              </p>
              <div className="flex gap-1">
                {viewMode === 'weekly'
                  ? DAY_LETTERS.map((letter, d) => (
                      <button
                        key={d}
                        onClick={() => onAddTask(weekKey, d, task)}
                        aria-label={`Add "${task.text}" to ${DAY_LABELS[d]}`}
                        className="w-7 h-7 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-600 text-[10px] font-bold hover:bg-brand-accent hover:text-white hover:border-brand-accent transition-colors dark:text-slate-300"
                      >
                        {letter}
                      </button>
                    ))
                  : (
                    <button
                      onClick={() => onAddTask(weekKey, 0, task)}
                      className="btn-primary py-1.5 px-4 text-[10px]"
                      aria-label={`Add "${task.text}" to plan`}
                    >
                      Add to Plan
                    </button>
                  )
                }
              </div>
            </div>
          ))}
        </div>
      </Motion.div>
    </>
  );
}
