import React from 'react';
import { CheckCircle2, Circle, Trash2, StickyNote } from 'lucide-react';
import { motion as Motion } from 'framer-motion';
import { ZONES, ENERGY_ICONS } from './constants';

export default function TaskItem({ task, onToggle, onRemove, onClick }) {
  const zone = ZONES[task.zone];
  return (
    <Motion.div
      layout
      className={`group flex items-start gap-2.5 p-3 rounded-2xl border-2 transition-all cursor-pointer ${
        task.completed
          ? 'bg-slate-50 border-transparent opacity-40'
          : 'bg-white border-slate-50 shadow-sm hover:shadow-md active:scale-[0.98]'
      }`}
      onClick={onClick}
    >
      <button
        onClick={(e) => { e.stopPropagation(); onToggle(); }}
        className="mt-0.5 shrink-0"
      >
        {task.completed
          ? <CheckCircle2 size={18} className="text-green-400" />
          : <Circle size={18} className="text-slate-200" />}
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          {zone && (
            <span className={`w-2 h-2 rounded-full shrink-0 ${zone.color}`} />
          )}
          <span className={`text-xs font-bold text-slate-600 leading-tight block break-words ${task.completed ? 'line-through' : ''}`}>
            {task.text}
          </span>
        </div>
        {task.note && (
          <div className="flex items-center gap-1 mt-1 text-brand-accent/60">
            <StickyNote size={10} />
            <span className="text-[9px] font-bold uppercase tracking-tighter">has note</span>
          </div>
        )}
      </div>

      <div className="flex flex-col items-end gap-1 shrink-0">
        <span className="opacity-60">{ENERGY_ICONS[task.energy]}</span>
        <button
          onClick={(e) => { e.stopPropagation(); onRemove(); }}
          className="text-slate-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Trash2 size={12} />
        </button>
      </div>
    </Motion.div>
  );
}
