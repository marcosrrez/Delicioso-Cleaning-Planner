import React, { useState } from 'react';
import { usePlannerStore } from './store';
import { format, addDays } from 'date-fns';
import { 
  ChevronLeft, ChevronRight, Printer, Plus, CheckCircle2, Circle, 
  Trash2, Sparkles, Brain, Zap, Coffee, Wind, CalendarCheck, Edit3, X, StickyNote
} from 'lucide-react';
import { motion as Motion, AnimatePresence } from 'framer-motion';

const ZONES = {
  kitchen: { color: 'bg-brand-yellow', label: 'K' },
  living: { color: 'bg-brand-green', label: 'L' },
  bathroom: { color: 'bg-brand-blue', label: 'B' },
  bedroom: { color: 'bg-brand-purple', label: 'R' },
  deep: { color: 'bg-brand-pink', label: 'D' },
};

const ENERGY_ICONS = {
  low: <Coffee size={14} className="text-blue-400" />,
  medium: <Wind size={14} className="text-green-400" />,
  high: <Zap size={14} className="text-orange-400" />,
};

function TaskModal({ task, onClose, onUpdate, dayIdx, weekKey }) {
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
            <h2 className="text-2xl font-black text-slate-800">Edit Task 🍬</h2>
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
                  {Object.keys(ZONES).map(z => <option key={z} value={z}>{z}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Energy Required</label>
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

function TaskItem({ task, onToggle, onRemove, onClick }) {
  return (
    <Motion.div 
      layout
      className={`group flex items-start gap-2 p-3 rounded-2xl border-2 transition-all cursor-pointer ${
        task.completed ? 'bg-slate-50 border-transparent opacity-40' : 'bg-white border-slate-50 shadow-sm hover:shadow-md active:scale-95'
      }`}
      onClick={onClick}
    >
      <button 
        onClick={(e) => { e.stopPropagation(); onToggle(); }} 
        className="mt-0.5 shrink-0"
      >
        {task.completed ? <CheckCircle2 size={18} className="text-green-400" /> : <Circle size={18} className="text-slate-200" />}
      </button>
      
      <div className="flex-1 min-w-0">
        <span className={`text-xs font-bold text-slate-600 leading-tight block break-words ${task.completed ? 'line-through' : ''}`}>
          {task.text}
        </span>
        {task.note && (
          <div className="flex items-center gap-1 mt-1 text-brand-accent/60">
            <StickyNote size={10} />
            <span className="text-[9px] font-bold uppercase tracking-tighter">has note</span>
          </div>
        )}
      </div>

      <div className="flex flex-col items-end gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          onClick={(e) => { e.stopPropagation(); onRemove(); }} 
          className="text-slate-300 hover:text-red-400"
        >
          <Trash2 size={12} />
        </button>
      </div>
    </Motion.div>
  );
}

function App() {
  const { 
    currentWeekStart, nextWeek, prevWeek, weekData, 
    addTask, toggleTask, removeTask, updateTask, taskBank, autoFillWeek,
    viewMode, setViewMode, monthlyData, yearlyData
  } = usePlannerStore();
  
  const [showTaskBank, setShowTaskBank] = useState(false);
  const [activeTask, setActiveTask] = useState(null);

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(new Date(currentWeekStart), i));
  const currentWeek = weekData[currentWeekStart] || { days: Array(7).fill([]) };
  const currentMonthKey = currentWeekStart.substring(0, 7);
  const currentMonthTasks = monthlyData[currentMonthKey] || [];
  const currentYearKey = currentWeekStart.substring(0, 4);
  const currentYearTasks = yearlyData[currentYearKey] || [];

  return (
    <div className="min-h-screen pb-20 text-slate-800">
      {/* HEADER */}
      <header className="no-print sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b-4 border-brand-cream px-6 py-4 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-brand-accent rounded-2xl flex items-center justify-center text-white shadow-lg rotate-3">
              <Sparkles size={28} />
            </div>
            <div>
              <h1 className="text-2xl leading-tight">Delicioso Planner</h1>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">Distributed Home Care</p>
            </div>
          </div>

          <div className="flex bg-slate-100 p-1 rounded-2xl border-2 border-slate-200">
            {['weekly', 'monthly', 'yearly'].map((mode) => (
              <button key={mode} onClick={() => setViewMode(mode)} className={`px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${viewMode === mode ? 'bg-white text-brand-accent shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>
                {mode}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <button onClick={() => autoFillWeek(currentWeekStart)} className="btn-primary bg-amber-400 flex items-center gap-2 text-sm">
              <Sparkles size={16} /> Magic Reset
            </button>
            <button onClick={() => setShowTaskBank(!showTaskBank)} className="btn-primary bg-indigo-500 flex items-center gap-2 text-sm">
              <Brain size={16} /> Add Martha's
            </button>
            <button onClick={() => window.print()} className="btn-primary flex items-center gap-2 text-sm text-white">
              <Printer size={16} /> Print
            </button>
          </div>
        </div>

        <div className="flex items-center justify-center gap-4 py-2 border-t-2 border-slate-50">
          <button onClick={prevWeek} className="p-2 hover:bg-white rounded-full transition-colors"><ChevronLeft /></button>
          <span className="font-quicksand font-bold px-4 min-w-[220px] text-center text-slate-600 italic">
            {viewMode === 'weekly' && `✨ Week of ${format(new Date(currentWeekStart), 'MMMM do')} ✨`}
            {viewMode === 'monthly' && `📅 ${format(new Date(currentWeekStart), 'MMMM yyyy')} 📅`}
            {viewMode === 'yearly' && `🗓️ Seasonal Plan ${format(new Date(currentWeekStart), 'yyyy')} 🗓️`}
          </span>
          <button onClick={nextWeek} className="p-2 hover:bg-white rounded-full transition-colors"><ChevronRight /></button>
        </div>
      </header>

      {/* COMPACT PRINT VIEW (same logic as before, just kept for completeness) */}
      <div className="print-only hidden p-8 bg-white">
        <h1 className="text-4xl text-center mb-8 border-b-4 border-brand-accent pb-4 uppercase tracking-tighter">Distributed Cleaning Schedule</h1>
        <div className="grid grid-cols-7 gap-px bg-slate-200 border-2 border-slate-200 rounded-lg overflow-hidden">
          {weekDays.map((day, idx) => (
            <div key={idx} className="bg-white min-h-[300px] p-2">
              <p className="text-[10px] font-black uppercase text-slate-400">{format(day, 'EEEE')}</p>
              <p className="text-lg font-bold text-brand-accent mb-2">{format(day, 'd')}</p>
              {currentWeek.days[idx]?.map(task => (
                <div key={task.id} className="text-[9px] leading-tight flex gap-1 mb-1 items-start">
                  <div className="w-2.5 h-3 border border-slate-300 mt-0.5 shrink-0 rounded-sm" />
                  <span>{task.text}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <main className="container mx-auto px-4 mt-8 no-print">
        {viewMode === 'weekly' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-7 gap-6">
            {weekDays.map((day, idx) => {
              const dayTasks = currentWeek.days[idx] || [];
              const essentials = dayTasks.filter(t => t.isEssential);
              const weeklyFocus = dayTasks.filter(t => !t.isEssential);

              return (
                <Motion.div key={day.toISOString()} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }} className="kawaii-card min-h-[500px] flex flex-col group border-slate-200/50" >
                  <div className="text-center mb-4 pb-2 border-b-2 border-slate-50">
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">{format(day, 'EEEE')}</p>
                    <p className="text-3xl font-quicksand font-bold text-brand-accent">{format(day, 'd')}</p>
                  </div>

                  <div className="flex-1 space-y-6">
                    {/* DAILY ESSENTIALS SECTION */}
                    {essentials.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-[9px] font-black uppercase text-slate-300 tracking-tighter flex items-center gap-1">
                          <div className="w-1 h-1 rounded-full bg-slate-300" /> Daily Essentials
                        </h4>
                        <div className="grid grid-cols-1 gap-1">
                          {essentials.map(task => (
                            <div 
                              key={task.id} 
                              onClick={() => toggleTask(currentWeekStart, idx, task.id)}
                              className={`flex items-center gap-2 p-1.5 rounded-lg transition-all cursor-pointer ${task.completed ? 'opacity-30 line-through' : 'hover:bg-slate-50'}`}
                            >
                              <div className={`w-3 h-3 rounded-full border-2 ${task.completed ? 'bg-green-400 border-green-400' : 'border-slate-200'}`} />
                              <span className="text-[10px] font-bold text-slate-500 truncate">{task.text}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* WEEKLY FOCUS SECTION */}
                    <div className="space-y-3">
                      <h4 className="text-[9px] font-black uppercase text-brand-accent/50 tracking-tighter flex items-center gap-1">
                        <div className="w-1 h-1 rounded-full bg-brand-accent/50" /> Focus Tasks
                      </h4>
                      <AnimatePresence>
                        {weeklyFocus.map(task => (
                          <TaskItem 
                            key={task.id} 
                            task={task} 
                            onToggle={() => toggleTask(currentWeekStart, idx, task.id)} 
                            onRemove={() => removeTask(currentWeekStart, idx, task.id)} 
                            onClick={() => setActiveTask({ ...task, dayIdx: idx })}
                          />
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>

                  <button onClick={() => addTask(currentWeekStart, idx, { text: 'New task...', zone: 'living', energy: 'low' })} className="mt-4 w-full py-3 border-2 border-dashed border-slate-100 rounded-2xl text-slate-300 flex items-center justify-center gap-2 hover:border-brand-accent/30 hover:text-brand-accent transition-all text-xs font-bold">
                    <Plus size={14} /> Add Focus Task
                  </button>
                </Motion.div>
              );
            })}
          </div>
        ) : (
          <div className="space-y-8">
            {/* MONTHLY & YEARLY LOGIC (simplified for brevity, keeping same structured style) */}
            <div className="kawaii-card border-slate-200/50 min-h-[600px]">
              <h2 className="text-2xl mb-6 flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white ${viewMode === 'monthly' ? 'bg-brand-pink' : 'bg-brand-purple'}`}>
                  {viewMode === 'monthly' ? <CalendarCheck size={20} /> : <Sparkles size={20} />}
                </div>
                {viewMode === 'monthly' ? 'Monthly Maintenance' : 'Seasonal Deep Clean'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(viewMode === 'monthly' ? currentMonthTasks : currentYearTasks).map(task => (
                  <TaskItem 
                    key={task.id} 
                    task={task} 
                    onToggle={() => toggleTask(currentWeekStart, 0, task.id)} 
                    onRemove={() => removeTask(currentWeekStart, 0, task.id)}
                    onClick={() => setActiveTask({ ...task, dayIdx: 0 })}
                  />
                ))}
                <button 
                  onClick={() => addTask(currentWeekStart, 0, { text: `New ${viewMode} goal...`, zone: 'deep', energy: 'medium' })}
                  className="p-5 border-4 border-dashed border-slate-50 rounded-3xl text-slate-200 flex flex-col items-center justify-center gap-2 hover:border-brand-accent/30 hover:text-brand-accent transition-all font-black"
                >
                  <Plus size={32} /> Add {viewMode} Task
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* EDIT MODAL */}
      <AnimatePresence>
        {activeTask && (
          <TaskModal 
            task={activeTask} 
            dayIdx={activeTask.dayIdx} 
            weekKey={currentWeekStart}
            onClose={() => setActiveTask(null)} 
            onUpdate={updateTask}
          />
        )}
      </AnimatePresence>

      {/* SUGGESTIONS SIDEBAR */}
      <AnimatePresence>
        {showTaskBank && (
          <>
            <Motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowTaskBank(false)} className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-50 no-print" />
            <Motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 p-8 overflow-y-auto no-print" >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl capitalize text-slate-800">{viewMode} Library 🍬</h2>
                <button onClick={() => setShowTaskBank(false)} className="p-2 bg-brand-cream rounded-full"><ChevronRight /></button>
              </div>
              <div className="space-y-6">
                {taskBank
                  .filter(t => (viewMode === 'weekly' ? (t.frequency === 'daily' || t.frequency === 'weekly') : t.frequency === viewMode))
                  .map(task => (
                    <div key={task.id} className="p-5 bg-brand-cream rounded-[24px] border-2 border-white hover:scale-[1.02] transition-transform cursor-pointer group" >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3 font-black text-slate-700">
                          {ENERGY_ICONS[task.energy]}
                          {task.text}
                        </div>
                        <div className="flex gap-1">
                          {viewMode === 'weekly' ? [0,1,2,3,4,5,6].map(d => (
                            <button key={d} onClick={() => addTask(currentWeekStart, d, task)} className="w-6 h-6 rounded-md bg-white border border-slate-200 text-[10px] font-bold hover:bg-brand-accent hover:text-white transition-colors" >
                              {['M','T','W','T','F','S','S'][d]}
                            </button>
                          )) : <button onClick={() => addTask(currentWeekStart, 0, task)} className="btn-primary py-1 px-3 text-[10px]">Add to Plan</button>}
                        </div>
                      </div>
                      <p className="text-[10px] text-slate-400 leading-tight"><strong>THE WHY:</strong> {task.why}</p>
                    </div>
                  ))}
              </div>
            </Motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
