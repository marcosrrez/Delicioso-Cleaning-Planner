import React, { useState } from 'react';
import { usePlannerStore } from './store';
import { format, addDays } from 'date-fns';
import { 
  ChevronLeft, ChevronRight, Printer, Plus, CheckCircle2, Circle, 
  Trash2, Sparkles, Brain, Zap, Coffee, Wind, CalendarCheck, Edit3
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

function EditableTask({ task, onToggle, onRemove, onUpdate, zoneInfo, energyIcons }) {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(task.text);
  const [isHovered, setIsHovered] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(text);
    setIsEditing(false);
  };

  return (
    <Motion.div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative flex items-start gap-2 p-3 rounded-2xl border-2 transition-all ${
        task.completed ? 'bg-slate-50 border-transparent opacity-40' : 'bg-white border-slate-50 shadow-sm hover:shadow-md'
      }`}
    >
      <button onClick={onToggle} className="mt-0.5 shrink-0">
        {task.completed ? <CheckCircle2 size={18} className="text-green-400" /> : <Circle size={18} className="text-slate-200" />}
      </button>
      
      <div className="flex-1 min-w-0">
        {isEditing ? (
          <form onSubmit={handleSubmit}>
            <input 
              autoFocus
              value={text}
              onChange={(e) => setText(e.target.value)}
              onBlur={handleSubmit}
              className="w-full text-xs font-bold text-slate-600 bg-slate-50 outline-none border-b-2 border-brand-accent"
            />
          </form>
        ) : (
          <div className="group flex items-center gap-1">
            <span 
              onClick={() => setIsEditing(true)}
              className={`text-xs font-bold text-slate-600 leading-tight truncate cursor-text ${task.completed ? 'line-through' : ''}`}
            >
              {task.text}
            </span>
            <Edit3 size={10} className="opacity-0 group-hover:opacity-30 text-slate-400" />
          </div>
        )}
      </div>

      {isHovered && !isEditing && task.why && (
        <div className="absolute left-0 bottom-full mb-2 w-48 p-2 bg-slate-800 text-white text-[10px] rounded-lg z-50 shadow-xl pointer-events-none">
          <p className="font-black text-brand-yellow uppercase mb-1">The Why:</p>
          {task.why}
        </div>
      )}

      <div className="flex flex-col items-end gap-1 shrink-0">
        <span className={`text-[8px] font-black px-1.5 py-0.5 rounded-md text-white ${zoneInfo[task.zone]?.color}`}>
          {zoneInfo[task.zone]?.label}
        </span>
        <button onClick={onRemove} className="opacity-0 group-hover:opacity-100 hover:text-red-400 transition-opacity">
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

  const weekDays = Array.from({ length: 7 }, (_, i) => 
    addDays(new Date(currentWeekStart), i)
  );

  const currentWeekKey = currentWeekStart;
  const currentWeek = weekData[currentWeekKey] || { days: Array(7).fill([]) };
  const currentMonthKey = currentWeekStart.substring(0, 7);
  const currentMonthTasks = monthlyData[currentMonthKey] || [];
  const currentYearKey = currentWeekStart.substring(0, 4);
  const currentYearTasks = yearlyData[currentYearKey] || [];

  const handlePrint = () => window.print();

  return (
    <div className="min-h-screen pb-20">
      {/* HEADER */}
      <header className="no-print sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b-4 border-brand-cream px-6 py-4 flex flex-col gap-4 text-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-brand-accent rounded-2xl flex items-center justify-center text-white shadow-lg rotate-3">
              <Sparkles size={28} />
            </div>
            <div>
              <h1 className="text-2xl leading-tight">Delicioso Planner</h1>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">Martha-Approved Cognitive Relief</p>
            </div>
          </div>

          <div className="flex bg-slate-100 p-1 rounded-2xl border-2 border-slate-200">
            {['weekly', 'monthly', 'yearly'].map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                  viewMode === mode 
                    ? 'bg-white text-brand-accent shadow-sm' 
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <button 
              onClick={() => autoFillWeek(currentWeekKey)}
              className="btn-primary bg-amber-400 flex items-center gap-2 text-sm"
            >
              <Sparkles size={16} /> Magic Fill
            </button>
            <button 
              onClick={() => setShowTaskBank(!showTaskBank)}
              className="btn-primary bg-indigo-500 flex items-center gap-2 text-sm"
            >
              <Brain size={16} /> Suggestions
            </button>
            <button onClick={handlePrint} className="btn-primary flex items-center gap-2 text-sm text-white">
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

      {/* COMPACT PRINT VIEW */}
      <div className="print-only hidden p-8 bg-white text-slate-800">
        <h1 className="text-4xl text-center mb-8 border-b-4 border-brand-accent pb-4 uppercase tracking-tighter">Cleaning Schedule</h1>
        
        <div className="mb-8">
          <h2 className="text-xl uppercase mb-4 bg-slate-100 p-2 font-black">Weekly Distribution</h2>
          <div className="grid grid-cols-7 gap-px bg-slate-200 border-2 border-slate-200 rounded-lg overflow-hidden">
            {weekDays.map((day, idx) => (
              <div key={idx} className="bg-white min-h-[250px]">
                <div className="bg-slate-50 p-2 text-center border-b border-slate-100">
                  <p className="text-[10px] font-black uppercase text-slate-400">{format(day, 'EEEE')}</p>
                  <p className="text-lg font-bold text-brand-accent">{format(day, 'd')}</p>
                </div>
                <div className="p-2 space-y-2">
                  {currentWeek.days[idx]?.map(task => (
                    <div key={task.id} className="text-[9px] leading-tight flex gap-1 items-start">
                      <div className="w-3 h-3 border border-slate-300 mt-0.5 shrink-0 rounded-sm" />
                      <span className="font-medium text-slate-600">{task.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-4">
            <h2 className="text-xl uppercase bg-slate-100 p-2 font-black">Monthly Goals</h2>
            <div className="border-2 border-slate-100 rounded-lg p-4 space-y-3">
              {currentMonthTasks.map(task => (
                <div key={task.id} className="flex gap-2 items-center text-xs">
                  <div className="w-4 h-4 border-2 border-slate-300 shrink-0 rounded-md" />
                  <span className="font-bold text-slate-700">{task.text}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <h2 className="text-xl uppercase bg-slate-100 p-2 font-black">Seasonal Focus</h2>
            <div className="border-2 border-slate-100 rounded-lg p-4 space-y-3">
              {currentYearTasks.map(task => (
                <div key={task.id} className="flex gap-2 items-center text-xs">
                  <div className="w-4 h-4 border-2 border-slate-300 shrink-0 rounded-md" />
                  <span className="font-bold text-slate-700">{task.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 mt-8 no-print">
        {viewMode === 'weekly' ? (
          <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
            {weekDays.map((day, idx) => (
              <Motion.div 
                key={day.toISOString()}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="kawaii-card min-h-[500px] flex flex-col group border-slate-200/50"
              >
                <div className="text-center mb-4 pb-2 border-b-2 border-slate-50">
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">{format(day, 'EEEE')}</p>
                  <p className="text-3xl font-quicksand font-bold text-brand-accent">{format(day, 'd')}</p>
                </div>

                <div className="flex-1 space-y-3">
                  <AnimatePresence>
                    {currentWeek.days[idx]?.map((task) => (
                      <EditableTask
                        key={task.id}
                        task={task}
                        onToggle={() => toggleTask(currentWeekKey, idx, task.id)}
                        onRemove={() => removeTask(currentWeekKey, idx, task.id)}
                        onUpdate={(newText) => updateTask(currentWeekKey, idx, task.id, newText)}
                        zoneInfo={ZONES}
                        energyIcons={ENERGY_ICONS}
                      />
                    ))}
                  </AnimatePresence>
                </div>

                <button onClick={() => addTask(currentWeekKey, idx, { text: 'New task...', zone: 'living', energy: 'low', why: 'Custom maintenance task.' })} className="mt-4 w-full py-3 border-2 border-dashed border-slate-100 rounded-2xl text-slate-300 flex items-center justify-center gap-2 hover:border-brand-accent/30 hover:text-brand-accent transition-all text-xs font-bold">
                  <Plus size={14} /> Add Task
                </button>
              </Motion.div>
            ))}
          </div>
        ) : viewMode === 'monthly' ? (
          <Motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="kawaii-card border-slate-200/50 min-h-[600px]">
            <h2 className="text-2xl mb-6 flex items-center gap-3 text-slate-800">
              <div className="w-10 h-10 bg-brand-pink rounded-xl flex items-center justify-center text-white"><CalendarCheck size={20} /></div>
              Monthly Maintenance Checklist
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {currentMonthTasks.map(task => (
                  <div key={task.id} className="p-5 bg-white rounded-3xl border-2 border-slate-50 shadow-sm flex flex-col gap-3 group relative">
                    <div className="flex items-start gap-3">
                      <button onClick={() => toggleTask(currentMonthKey, 0, task.id)} className="mt-1">
                        {task.completed ? <CheckCircle2 size={24} className="text-green-400" /> : <Circle size={24} className="text-slate-100" />}
                      </button>
                      <div className="flex-1">
                        <input 
                          value={task.text}
                          onChange={(e) => updateTask(currentMonthKey, 0, task.id, e.target.value)}
                          className={`w-full font-black text-slate-700 bg-transparent outline-none ${task.completed ? 'line-through opacity-50' : ''}`}
                        />
                        <p className="text-[10px] text-slate-400 mt-1 leading-relaxed"><strong>THE WHY:</strong> {task.why}</p>
                      </div>
                      <button onClick={() => removeTask(currentMonthKey, 0, task.id)} className="opacity-0 group-hover:opacity-100 text-red-300 hover:text-red-500">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </AnimatePresence>
              <button 
                onClick={() => addTask(currentMonthKey, 0, { text: 'New monthly goal...', zone: 'deep', energy: 'medium', why: 'Deep cleaning is vital.' })}
                className="p-5 border-4 border-dashed border-slate-50 rounded-3xl text-slate-200 flex flex-col items-center justify-center gap-2 hover:border-brand-pink/30 hover:text-brand-pink transition-all font-black"
              >
                <Plus size={32} />
                Add Monthly Task
              </button>
            </div>
          </Motion.div>
        ) : (
          <Motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="kawaii-card border-slate-200/50 min-h-[600px]">
            <h2 className="text-2xl mb-6 flex items-center gap-3 text-slate-800">
              <div className="w-10 h-10 bg-brand-purple rounded-xl flex items-center justify-center text-white"><Sparkles size={20} /></div>
              Yearly & Seasonal Deep Clean
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <AnimatePresence>
                {currentYearTasks.map(task => (
                  <div key={task.id} className="p-6 bg-slate-50/50 rounded-[40px] border-2 border-white shadow-sm flex items-center gap-4 group">
                    <button onClick={() => toggleTask(currentYearKey, 0, task.id)}>
                      {task.completed ? <CheckCircle2 size={28} className="text-brand-purple" /> : <Circle size={28} className="text-white shadow-inner" />}
                    </button>
                    <div className="flex-1">
                      <input 
                        value={task.text}
                        onChange={(e) => updateTask(currentYearKey, 0, task.id, e.target.value)}
                        className={`w-full text-lg font-black text-slate-700 bg-transparent outline-none ${task.completed ? 'line-through opacity-50' : ''}`}
                      />
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{task.why}</p>
                    </div>
                    <button onClick={() => removeTask(currentYearKey, 0, task.id)} className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-400">
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))}
              </AnimatePresence>
              <button 
                onClick={() => addTask(currentYearKey, 0, { text: 'New yearly mission...', zone: 'deep', energy: 'high', why: 'Longevity for your home.' })}
                className="p-6 border-4 border-dashed border-slate-50 rounded-[40px] text-slate-200 flex items-center justify-center gap-3 hover:border-brand-purple/30 hover:text-brand-purple transition-all font-black"
              >
                <Plus size={24} /> Add Seasonal Goal
              </button>
            </div>
          </Motion.div>
        )}
      </main>

      {/* TASK BANK SIDEBAR */}
      <AnimatePresence>
        {showTaskBank && (
          <>
            <Motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowTaskBank(false)} className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-50 no-print" />
            <Motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 p-8 overflow-y-auto no-print" >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl capitalize text-slate-800">{viewMode} Suggestions 🍬</h2>
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
                            <button key={d} onClick={() => addTask(currentWeekKey, d, task)} className="w-6 h-6 rounded-md bg-white border border-slate-200 text-[10px] font-bold hover:bg-brand-accent hover:text-white transition-colors" >
                              {['M','T','W','T','F','S','S'][d]}
                            </button>
                          )) : (
                            <button onClick={() => addTask(currentWeekKey, 0, task)} className="btn-primary py-1 px-3 text-[10px]">Add to Plan</button>
                          )}
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

      <div className="fixed bottom-6 right-6 no-print">
         <div className="bg-brand-accent/10 border-2 border-brand-accent/20 p-4 rounded-2xl max-w-xs text-[10px] text-slate-500 font-bold uppercase tracking-widest leading-relaxed">
            ✨ <span className="text-brand-accent">Pro Tip:</span> Everything is preloaded based on Martha Stewart's schedule. Delete what you don't need! ✨
         </div>
      </div>
    </div>
  );
}

export default App;
