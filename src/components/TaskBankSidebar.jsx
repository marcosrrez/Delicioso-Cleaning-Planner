import React from 'react';
import { ChevronRight } from 'lucide-react';
import { motion as Motion } from 'framer-motion';
import { ENERGY_ICONS, DAY_LETTERS } from './constants';

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
      />
      <Motion.div
        initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col no-print"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4 border-b-2 border-slate-50">
          <div>
            <h2 className="text-2xl capitalize text-slate-800">Task Library</h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
              Martha-approved suggestions
            </p>
          </div>
          <button onClick={onClose} className="p-2 bg-brand-cream rounded-full hover:bg-slate-100 transition-colors">
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Task list */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {filtered.map(task => (
            <div
              key={task.id}
              className="p-4 bg-brand-cream rounded-2xl border-2 border-white hover:scale-[1.01] transition-transform"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 font-bold text-sm text-slate-700">
                  {ENERGY_ICONS[task.energy]}
                  <span>{task.text}</span>
                </div>
              </div>
              <p className="text-[10px] text-slate-400 leading-tight mb-3">
                <strong className="text-slate-500">WHY:</strong> {task.why}
              </p>
              <div className="flex gap-1">
                {viewMode === 'weekly'
                  ? DAY_LETTERS.map((letter, d) => (
                      <button
                        key={d}
                        onClick={() => onAddTask(weekKey, d, task)}
                        className="w-7 h-7 rounded-lg bg-white border border-slate-200 text-[10px] font-bold hover:bg-brand-accent hover:text-white hover:border-brand-accent transition-colors"
                      >
                        {letter}
                      </button>
                    ))
                  : (
                    <button
                      onClick={() => onAddTask(weekKey, 0, task)}
                      className="btn-primary py-1.5 px-4 text-[10px]"
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
