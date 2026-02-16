import React, { useState, useEffect, useRef } from 'react';
import { usePlannerStore } from './store';
import { format, addDays, isToday } from 'date-fns';
import {
  ChevronLeft, ChevronRight, Printer, Plus,
  Sparkles, BookOpen, RotateCcw, Moon, Sun,
  Download, Upload,
} from 'lucide-react';
import { motion as Motion, AnimatePresence } from 'framer-motion';

import TaskItem from './components/TaskItem';
import TaskModal from './components/TaskModal';
import ConfirmDialog from './components/ConfirmDialog';
import ProgressRing from './components/ProgressRing';
import PrintView from './components/PrintView';
import TaskBankSidebar from './components/TaskBankSidebar';
import { ZONE_THEMES } from './components/constants';

function App() {
  const {
    currentWeekStart, nextWeek, prevWeek, weekData,
    addTask, toggleTask, removeTask, updateTask, taskBank, autoFillWeek,
    viewMode, setViewMode, monthlyData, yearlyData,
    darkMode, toggleDarkMode, exportData, importData,
  } = usePlannerStore();

  const [showTaskBank, setShowTaskBank] = useState(false);
  const [activeTask, setActiveTask] = useState(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const [importToast, setImportToast] = useState(null);
  const todayRef = useRef(null);
  const fileInputRef = useRef(null);

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(new Date(currentWeekStart), i));
  const currentWeek = weekData[currentWeekStart] || { days: Array(7).fill([]) };
  const currentMonthKey = currentWeekStart.substring(0, 7);
  const currentMonthTasks = monthlyData[currentMonthKey] || [];
  const currentYearKey = currentWeekStart.substring(0, 4);
  const currentYearTasks = yearlyData[currentYearKey] || [];

  // Compute weekly stats
  const weekStats = weekDays.map((_, idx) => {
    const tasks = currentWeek.days[idx] || [];
    return { total: tasks.length, completed: tasks.filter(t => t.completed).length };
  });
  const weekTotal = weekStats.reduce((a, s) => a + s.total, 0);
  const weekCompleted = weekStats.reduce((a, s) => a + s.completed, 0);

  // Apply dark mode class to html element
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  // Auto-scroll to today on mount / week change
  useEffect(() => {
    if (viewMode === 'weekly' && todayRef.current) {
      todayRef.current.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }, [currentWeekStart, viewMode]);

  // Auto-dismiss toast
  useEffect(() => {
    if (importToast) {
      const timer = setTimeout(() => setImportToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [importToast]);

  const handleReset = () => {
    autoFillWeek(currentWeekStart);
    setConfirmReset(false);
  };

  const handleImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = importData(ev.target.result);
      setImportToast(result.success ? 'Data restored successfully!' : `Import failed: ${result.error}`);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="min-h-screen pb-20 text-slate-800 dark:text-slate-200 transition-colors duration-300">

      {/* ===== HEADER ===== */}
      <header className="no-print sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b-2 border-slate-100 dark:border-slate-700 px-4 sm:px-6 py-3" role="banner">
        {/* Top row: logo + view toggle + actions */}
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-10 h-10 bg-brand-accent rounded-xl flex items-center justify-center text-white shadow-lg shadow-brand-accent/20 rotate-3" aria-hidden="true">
              <Sparkles size={22} />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg leading-tight dark:text-white">Delicioso</h1>
              <p className="text-[9px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-[0.15em]">Home Care Planner</p>
            </div>
          </div>

          {/* View mode toggle */}
          <nav aria-label="View mode" className="flex bg-slate-50 dark:bg-slate-800 p-1 rounded-xl border border-slate-100 dark:border-slate-700">
            {['weekly', 'monthly', 'yearly'].map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                aria-pressed={viewMode === mode}
                className={`px-4 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all ${
                  viewMode === mode
                    ? 'bg-white dark:bg-slate-700 text-brand-accent shadow-sm'
                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                }`}
              >
                {mode}
              </button>
            ))}
          </nav>

          {/* Action buttons */}
          <div className="flex items-center gap-1.5" role="toolbar" aria-label="Actions">
            <button
              onClick={toggleDarkMode}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-yellow-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              onClick={exportData}
              className="p-2.5 rounded-xl bg-green-50 dark:bg-green-900/30 text-green-500 hover:bg-green-100 dark:hover:bg-green-900/50 transition-colors"
              aria-label="Export backup"
              title="Export backup"
            >
              <Download size={18} />
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
              aria-label="Import backup"
              title="Import backup"
            >
              <Upload size={18} />
            </button>
            <input ref={fileInputRef} type="file" accept=".json" onChange={handleImport} className="hidden" aria-hidden="true" />
            <button
              onClick={() => setConfirmReset(true)}
              className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-900/30 text-amber-500 hover:bg-amber-100 dark:hover:bg-amber-900/50 transition-colors"
              aria-label="Reset to defaults"
              title="Reset to defaults"
            >
              <RotateCcw size={18} />
            </button>
            <button
              onClick={() => setShowTaskBank(!showTaskBank)}
              className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-500 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
              aria-label="Task library"
              title="Task library"
            >
              <BookOpen size={18} />
            </button>
            <button
              onClick={() => window.print()}
              className="p-2.5 rounded-xl bg-brand-accent/10 text-brand-accent hover:bg-brand-accent/20 transition-colors"
              aria-label="Print checklist"
              title="Print checklist"
            >
              <Printer size={18} />
            </button>
          </div>
        </div>

        {/* Navigation row */}
        <nav aria-label="Week navigation" className="flex items-center justify-center gap-3 mt-2">
          <button onClick={prevWeek} className="p-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full transition-colors" aria-label="Previous week">
            <ChevronLeft size={20} />
          </button>
          <div className="text-center min-w-[200px]" aria-live="polite">
            <span className="font-quicksand font-bold text-sm text-slate-600 dark:text-slate-300">
              {viewMode === 'weekly' && `Week of ${format(new Date(currentWeekStart), 'MMM d, yyyy')}`}
              {viewMode === 'monthly' && format(new Date(currentWeekStart), 'MMMM yyyy')}
              {viewMode === 'yearly' && `Year ${format(new Date(currentWeekStart), 'yyyy')}`}
            </span>
            {viewMode === 'weekly' && weekTotal > 0 && (
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold mt-0.5">
                {weekCompleted}/{weekTotal} tasks done this week
              </p>
            )}
          </div>
          <button onClick={nextWeek} className="p-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full transition-colors" aria-label="Next week">
            <ChevronRight size={20} />
          </button>
        </nav>
      </header>

      {/* ===== ETSY-STYLE PRINT VIEW ===== */}
      <PrintView weekDays={weekDays} currentWeek={currentWeek} />

      {/* ===== MAIN CONTENT ===== */}
      <main className="container mx-auto px-3 sm:px-4 mt-6 no-print" role="main">
        {viewMode === 'weekly' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-7 gap-4" role="list" aria-label="Week days">
            {weekDays.map((day, idx) => {
              const dayTasks = currentWeek.days[idx] || [];
              const essentials = dayTasks.filter(t => t.isEssential);
              const weeklyFocus = dayTasks.filter(t => !t.isEssential);
              const isDayToday = isToday(day);
              const stats = weekStats[idx];
              const theme = ZONE_THEMES[idx];

              return (
                <Motion.div
                  key={day.toISOString()}
                  ref={isDayToday ? todayRef : null}
                  role="listitem"
                  aria-label={`${format(day, 'EEEE, MMMM d')}${isDayToday ? ' (Today)' : ''}`}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.04 }}
                  className={`kawaii-card dark:bg-slate-800 dark:border-slate-700 min-h-[420px] flex flex-col relative ${
                    isDayToday
                      ? 'border-brand-accent/40 shadow-md shadow-brand-accent/10 ring-2 ring-brand-accent/20'
                      : 'border-slate-100 dark:border-slate-700'
                  }`}
                >
                  {/* Today badge */}
                  {isDayToday && (
                    <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-brand-accent text-white text-[9px] font-black uppercase tracking-widest px-3 py-0.5 rounded-full shadow-sm">
                      Today
                    </div>
                  )}

                  {/* Day header with progress */}
                  <div className="flex items-center justify-between mb-3 pb-2 border-b-2 border-slate-50 dark:border-slate-700">
                    <div className="text-center flex-1">
                      <p className="text-[10px] font-black text-slate-300 dark:text-slate-500 uppercase tracking-widest">{format(day, 'EEE')}</p>
                      <p className={`text-2xl font-quicksand font-bold ${isDayToday ? 'text-brand-accent' : 'text-slate-300 dark:text-slate-500'}`}>
                        {format(day, 'd')}
                      </p>
                      {theme && (
                        <p className="text-[8px] font-bold text-slate-300 dark:text-slate-500 uppercase tracking-wide mt-0.5">{theme.label}</p>
                      )}
                    </div>
                    <ProgressRing completed={stats.completed} total={stats.total} size={34} />
                  </div>

                  <div className="flex-1 space-y-4">
                    {/* Daily Essentials */}
                    {essentials.length > 0 && (
                      <div className="space-y-1.5" role="list" aria-label="Daily essentials">
                        <h4 className="text-[9px] font-black uppercase text-slate-300 dark:text-slate-500 tracking-tighter flex items-center gap-1">
                          <div className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-500" aria-hidden="true" /> Essentials
                        </h4>
                        {essentials.map(task => (
                          <div
                            key={task.id}
                            role="listitem"
                            onClick={() => toggleTask(currentWeekStart, idx, task.id)}
                            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleTask(currentWeekStart, idx, task.id); } }}
                            tabIndex={0}
                            aria-label={`${task.text} - ${task.completed ? 'completed' : 'not completed'}`}
                            className={`flex items-center gap-2 p-1.5 rounded-lg transition-all cursor-pointer ${
                              task.completed ? 'opacity-30' : 'hover:bg-slate-50 dark:hover:bg-slate-700'
                            }`}
                          >
                            <div className={`w-3 h-3 rounded-full border-2 transition-colors ${
                              task.completed ? 'bg-green-400 border-green-400' : 'border-slate-200 dark:border-slate-600'
                            }`} aria-hidden="true" />
                            <span className={`text-[10px] font-bold text-slate-500 dark:text-slate-400 truncate ${task.completed ? 'line-through' : ''}`}>
                              {task.text}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Focus Tasks */}
                    <div className="space-y-2" role="list" aria-label="Focus tasks">
                      <h4 className="text-[9px] font-black uppercase text-brand-accent/40 tracking-tighter flex items-center gap-1">
                        <div className="w-1 h-1 rounded-full bg-brand-accent/40" aria-hidden="true" /> Focus
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

                  {/* Add task */}
                  <button
                    onClick={() => addTask(currentWeekStart, idx, { text: 'New task...', zone: 'living', energy: 'low' })}
                    aria-label={`Add task to ${format(day, 'EEEE')}`}
                    className="mt-3 w-full py-2.5 border-2 border-dashed border-slate-100 dark:border-slate-600 rounded-xl text-slate-300 dark:text-slate-500 flex items-center justify-center gap-1.5 hover:border-brand-accent/30 hover:text-brand-accent transition-all text-[11px] font-bold"
                  >
                    <Plus size={13} /> Add Task
                  </button>
                </Motion.div>
              );
            })}
          </div>
        ) : (
          /* MONTHLY / YEARLY VIEW */
          <div className="space-y-8">
            <div className="kawaii-card dark:bg-slate-800 dark:border-slate-700 border-slate-100 min-h-[500px]">
              <h2 className="text-xl mb-6 flex items-center gap-3 dark:text-white">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white ${
                  viewMode === 'monthly' ? 'bg-brand-pink' : 'bg-brand-purple'
                }`} aria-hidden="true">
                  <Sparkles size={20} />
                </div>
                {viewMode === 'monthly' ? 'Monthly Maintenance' : 'Seasonal Deep Clean'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" role="list" aria-label={`${viewMode} tasks`}>
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
                  aria-label={`Add ${viewMode} task`}
                  className="p-5 border-4 border-dashed border-slate-50 dark:border-slate-600 rounded-3xl text-slate-200 dark:text-slate-500 flex flex-col items-center justify-center gap-2 hover:border-brand-accent/30 hover:text-brand-accent transition-all font-black"
                >
                  <Plus size={28} /> Add Task
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ===== IMPORT TOAST ===== */}
      <AnimatePresence>
        {importToast && (
          <Motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-800 dark:bg-white text-white dark:text-slate-800 px-6 py-3 rounded-2xl shadow-xl font-bold text-sm z-[80]"
            role="alert"
          >
            {importToast}
          </Motion.div>
        )}
      </AnimatePresence>

      {/* ===== EDIT MODAL ===== */}
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

      {/* ===== TASK BANK SIDEBAR ===== */}
      <AnimatePresence>
        {showTaskBank && (
          <TaskBankSidebar
            show={showTaskBank}
            onClose={() => setShowTaskBank(false)}
            taskBank={taskBank}
            viewMode={viewMode}
            onAddTask={addTask}
            weekKey={currentWeekStart}
          />
        )}
      </AnimatePresence>

      {/* ===== CONFIRM RESET DIALOG ===== */}
      <ConfirmDialog
        open={confirmReset}
        title="Reset this week?"
        message="This will replace all tasks with the default distributed schedule. Any custom tasks and notes will be lost."
        confirmLabel="Reset"
        danger
        onConfirm={handleReset}
        onCancel={() => setConfirmReset(false)}
      />
    </div>
  );
}

export default App;
