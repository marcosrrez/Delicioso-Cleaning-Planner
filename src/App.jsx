import React, { useState } from 'react';
import { usePlannerStore } from './store';
import { format, addDays } from 'date-fns';
import { 
  ChevronLeft, ChevronRight, Printer, Plus, CheckCircle2, Circle, 
  Trash2, Sparkles, Brain, Zap, Coffee, Wind, CalendarCheck
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

function App() {
  const { 
    currentWeekStart, nextWeek, prevWeek, weekData, 
    addTask, toggleTask, removeTask, taskBank, autoFillWeek,
    viewMode, setViewMode
  } = usePlannerStore();
  
  const [showTaskBank, setShowTaskBank] = useState(false);

  const weekDays = Array.from({ length: 7 }, (_, i) => 
    addDays(new Date(currentWeekStart), i)
  );

  const currentWeekKey = currentWeekStart;
  const currentWeek = weekData[currentWeekKey] || { days: Array(7).fill([]) };

  const handlePrint = () => window.print();

  return (
    <div className="min-h-screen pb-20">
      {/* HEADER */}
      <header className="no-print sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b-4 border-brand-cream px-6 py-4 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-brand-accent rounded-2xl flex items-center justify-center text-white shadow-lg rotate-3">
              <Sparkles size={28} />
            </div>
            <div>
              <h1 className="text-2xl text-slate-800 leading-tight">Delicioso Planner</h1>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">The Martha-Approved Kawaii Guide</p>
            </div>
          </div>

          {/* VIEW SWITCHER */}
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
            <button onClick={handlePrint} className="btn-primary flex items-center gap-2 text-sm">
              <Printer size={16} /> Print
            </button>
          </div>
        </div>

        {viewMode === 'weekly' && (
          <div className="flex items-center justify-center gap-4 py-2 border-t-2 border-slate-50">
            <button onClick={prevWeek} className="p-2 hover:bg-white rounded-full transition-colors"><ChevronLeft /></button>
            <span className="font-quicksand font-bold px-4 min-w-[220px] text-center text-slate-600 italic">
              ✨ Week of {format(new Date(currentWeekStart), 'MMMM do')} ✨
            </span>
            <button onClick={nextWeek} className="p-2 hover:bg-white rounded-full transition-colors"><ChevronRight /></button>
          </div>
        )}
      </header>

      <main className="container mx-auto px-4 mt-8">
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
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none mb-1">{format(day, 'EEEE')}</p>
                  <p className="text-3xl font-quicksand font-bold text-brand-accent">{format(day, 'd')}</p>
                </div>

                <div className="flex-1 space-y-3">
                  <AnimatePresence>
                    {currentWeek.days[idx]?.map((task) => (
                      <Motion.div 
                        key={task.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className={`flex items-start gap-2 p-3 rounded-2xl border-2 transition-all ${
                          task.completed 
                            ? 'bg-slate-50 border-transparent opacity-40' 
                            : 'bg-white border-slate-50 shadow-sm hover:shadow-md'
                        }`}
                      >
                        <button onClick={() => toggleTask(currentWeekKey, idx, task.id)} className="mt-0.5">
                          {task.completed ? <CheckCircle2 size={18} className="text-green-400" /> : <Circle size={18} className="text-slate-200" />}
                        </button>
                        <span className={`text-xs flex-1 font-bold text-slate-600 leading-tight ${task.completed ? 'line-through' : ''}`}>
                          {task.text}
                        </span>
                        <div className="flex flex-col items-end gap-1">
                          <span className={`text-[8px] font-black px-1.5 py-0.5 rounded-md text-white ${ZONES[task.zone].color}`}>
                            {ZONES[task.zone].label}
                          </span>
                          <button 
                            onClick={() => removeTask(currentWeekKey, idx, task.id)}
                            className="opacity-0 group-hover:opacity-100 hover:text-red-400 transition-opacity"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </Motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                <button 
                  onClick={() => addTask(currentWeekKey, idx, { text: 'New task...', zone: 'living', energy: 'low' })}
                  className="mt-4 w-full py-3 border-2 border-dashed border-slate-100 rounded-2xl text-slate-300 flex items-center justify-center gap-2 hover:border-brand-accent/30 hover:text-brand-accent transition-all text-xs font-bold"
                >
                  <Plus size={14} /> Add Task
                </button>
              </Motion.div>
            ))}
          </div>
        ) : viewMode === 'monthly' ? (
          <Motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="kawaii-card border-slate-200/50"
          >
            <h2 className="text-2xl mb-6 flex items-center gap-3">
              <div className="w-10 h-10 bg-brand-pink rounded-xl flex items-center justify-center text-white"><CalendarCheck size={20} /></div>
              Monthly Maintenance
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm font-medium">
              {taskBank.filter(t => t.frequency === 'monthly').map(task => (
                <div key={task.id} className="p-4 bg-brand-cream/30 rounded-2xl flex items-center gap-3 border-2 border-white shadow-sm hover:scale-[1.01] transition-transform">
                  <div className={`w-3 h-3 rounded-full ${ZONES[task.zone].color}`} />
                  <span className="flex-1">{task.text}</span>
                  <div className="flex gap-1">
                    {[1,2,3].map(i => (
                      <div key={i} className="w-5 h-5 rounded-md border-2 border-slate-100 flex items-center justify-center text-[10px] text-slate-300 font-bold">
                        {i}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Motion.div>
        ) : (
          <Motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            className="kawaii-card border-slate-200/50"
          >
            <h2 className="text-2xl mb-6 flex items-center gap-3">
              <div className="w-10 h-10 bg-brand-purple rounded-xl flex items-center justify-center text-white"><Sparkles size={20} /></div>
              Yearly & Seasonal Deep Clean
            </h2>
            <div className="space-y-8">
              {['Spring', 'Summer', 'Fall', 'Winter'].map(season => (
                <div key={season}>
                  <h3 className="text-lg text-slate-400 mb-4 border-b-2 border-slate-50 pb-2 flex items-center gap-2 capitalize">
                    {season} Routine
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {taskBank.filter(t => t.frequency === 'yearly').map((task, i) => (
                      <div key={task.id + i} className="flex items-center gap-4 p-4 rounded-3xl bg-slate-50/50 group border-2 border-transparent hover:border-brand-purple/20 transition-all">
                        <div className="w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center text-brand-purple group-hover:rotate-12 transition-transform">
                          {i % 2 === 0 ? <Wind size={18} /> : <Zap size={18} />}
                        </div>
                        <div>
                          <p className="font-bold text-slate-700">{task.text}</p>
                          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{task.zone} zone</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Motion.div>
        )}
      </main>

      {/* TASK BANK SIDEBAR */}
      <AnimatePresence>
        {showTaskBank && (
          <>
            <Motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowTaskBank(false)}
              className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-50 no-print"
            />
            <Motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 p-8 overflow-y-auto no-print"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl">Task Menu 🍬</h2>
                <button onClick={() => setShowTaskBank(false)} className="p-2 bg-brand-cream rounded-full"><ChevronRight /></button>
              </div>
              
              <div className="space-y-6">
                {Object.keys(ZONES).map(zone => (
                  <div key={zone}>
                    <h3 className="capitalize text-lg mb-3 flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${ZONES[zone].color}`} />
                      {zone} Tasks
                    </h3>
                    <div className="grid grid-cols-1 gap-2">
                      {taskBank.filter(t => t.zone === zone).map(task => (
                        <div 
                          key={task.id}
                          className="flex items-center justify-between p-4 bg-brand-cream rounded-2xl hover:scale-[1.02] transition-transform cursor-pointer group"
                        >
                          <div className="flex items-center gap-3">
                            {ENERGY_ICONS[task.energy]}
                            <span className="font-bold text-slate-700">{task.text}</span>
                          </div>
                          <div className="flex gap-1">
                            {[0,1,2,3,4,5,6].map(d => (
                              <button 
                                key={d}
                                onClick={() => addTask(currentWeekKey, d, task)}
                                className="w-6 h-6 rounded-md bg-white border border-slate-200 text-[10px] font-bold hover:bg-brand-accent hover:text-white transition-colors"
                              >
                                {['M','T','W','T','F','S','S'][d]}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Motion.div>
          </>
        )}
      </AnimatePresence>

      {/* PRINT TIPS */}
      <div className="fixed bottom-6 right-6 no-print">
         <div className="bg-brand-accent/10 border-2 border-brand-accent/20 p-4 rounded-2xl max-w-xs text-xs">
            <strong>✨ Pro Tip:</strong> Toggle the "Suggestions" menu to quickly fill your week. When printing, enable "Background Graphics" for the colors!
         </div>
      </div>
    </div>
  );
}

export default App;
