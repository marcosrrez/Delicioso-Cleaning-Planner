import React, { useState } from 'react';
import { X } from 'lucide-react';
import { motion as Motion } from 'framer-motion';
import { ZONES, ENERGY_ICONS } from './constants';

export default function TaskModal({ task, onClose, onUpdate, dayIdx, weekKey }) {
  const [formData, setFormData] = useState({ ...task });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onUpdate(weekKey, dayIdx, task.id, formData);
    onClose();
  };

  return (
    <Motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <Motion.div
        initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
        className="bg-white w-full max-w-lg rounded-[32px] shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-8 space-y-6">
          <div className="flex justify-between items-start">
            <h2 className="text-2xl font-black text-slate-800">Edit Task</h2>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><X size={24} /></button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Task Name</label>
              <input
                name="text" value={formData.text} onChange={handleChange}
                className="w-full text-lg font-bold p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-brand-accent outline-none transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Zone</label>
                <select
                  name="zone" value={formData.zone} onChange={handleChange}
                  className="w-full font-bold p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-brand-accent outline-none transition-all appearance-none capitalize"
                >
                  {Object.entries(ZONES).map(([key, val]) => (
                    <option key={key} value={key}>{val.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Energy</label>
                <select
                  name="energy" value={formData.energy} onChange={handleChange}
                  className="w-full font-bold p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-brand-accent outline-none transition-all appearance-none capitalize"
                >
                  {['low', 'medium', 'high'].map(e => <option key={e} value={e}>{e}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Personal Notes</label>
              <textarea
                name="note" value={formData.note || ''} onChange={handleChange}
                placeholder="Add details, reminders, or specific steps..."
                className="w-full min-h-[120px] font-medium p-4 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-brand-accent outline-none transition-all"
              />
            </div>
          </div>

          <button
            onClick={handleSave}
            className="w-full btn-primary bg-brand-accent py-4 text-lg shadow-lg shadow-brand-accent/20"
          >
            Save Changes
          </button>
        </div>
      </Motion.div>
    </Motion.div>
  );
}
