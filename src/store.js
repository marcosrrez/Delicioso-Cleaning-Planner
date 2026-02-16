import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { startOfWeek, format, addWeeks, subWeeks } from 'date-fns';

const DEFAULT_TASK_BANK = [
  // DAILY
  { id: 'd1', text: 'Make the bed', zone: 'bedroom', energy: 'low', frequency: 'daily', why: 'Sets a productive tone for the day and makes your space feel immediately tidier.' },
  { id: 'd2', text: 'Wipe kitchen counters', zone: 'kitchen', energy: 'low', frequency: 'daily', why: 'Prevents the spread of food-borne illnesses and stops grime from building up.' },
  { id: 'd3', text: 'Sanitize high-touch surfaces', zone: 'living', energy: 'low', frequency: 'daily', why: 'High-traffic areas like doorknobs and remotes are breeding grounds for germs.' },
  { id: 'd4', text: 'Wash dirty dishes', zone: 'kitchen', energy: 'medium', frequency: 'daily', why: 'Dirty dishes attract pests and create odors that linger in your home.' },
  { id: 'd5', text: 'Sweep floors', zone: 'deep', energy: 'medium', frequency: 'daily', why: 'Daily sweeping prevents dirt from being tracked into rugs and causing permanent damage.' },
  
  // WEEKLY
  { id: 'w1', text: 'Launder bath mats & towels', zone: 'bathroom', energy: 'medium', frequency: 'weekly', why: 'Damp fabrics in bathrooms harbor mildew and bacteria quickly.' },
  { id: 'w2', text: 'Clean toilets & showers', zone: 'bathroom', energy: 'high', frequency: 'weekly', why: 'Prevents hard water stains and soap scum from becoming a major undertaking to remove.' },
  { id: 'w3', text: 'Dust all surfaces', zone: 'living', energy: 'medium', frequency: 'weekly', why: 'Improves air quality and prevents allergies by removing dander and dust mites.' },
  { id: 'w4', text: 'Vacuum & mop floors', zone: 'deep', energy: 'high', frequency: 'weekly', why: 'Removes deep-seated allergens and maintains the lifespan of your flooring.' },
  { id: 'w5', text: 'Change bed sheets', zone: 'bedroom', energy: 'medium', frequency: 'weekly', why: 'You spend a third of your life here; fresh sheets improve sleep hygiene and skin health.' },
  { id: 'w6', text: 'Flush kitchen drain', zone: 'kitchen', energy: 'low', frequency: 'weekly', why: 'Boiling water prevents grease buildup that leads to slow drains and bad smells.' },
  
  // MONTHLY
  { id: 'm1', text: 'Scrub grout', zone: 'bathroom', energy: 'high', frequency: 'monthly', why: 'Grout is porous; regular cleaning prevents permanent discoloration and mold growth.' },
  { id: 'm2', text: 'Wipe medicine cabinets', zone: 'bathroom', energy: 'medium', frequency: 'monthly', why: 'Removes expired items and prevents toothpaste/skincare residue buildup.' },
  { id: 'm3', text: 'Vacuum baseboards', zone: 'deep', energy: 'medium', frequency: 'monthly', why: 'Baseboards are dust magnets that, when clean, make a room look significantly brighter.' },
  { id: 'm4', text: 'Dust ceiling fans', zone: 'living', energy: 'medium', frequency: 'monthly', why: 'Fans distribute dust throughout the room; cleaning them stops the cycle.' },
  { id: 'm5', text: 'Clean switch plates', zone: 'living', energy: 'low', frequency: 'monthly', why: 'One of the most touched surfaces in the house, often neglected in daily tidying.' },
  
  // YEARLY
  { id: 'y1', text: 'Deep clean oven', zone: 'kitchen', energy: 'high', frequency: 'yearly', why: 'Improves cooking efficiency and prevents smoke/odors from burnt food residue.' },
  { id: 'y2', text: 'Clean gutters', zone: 'deep', energy: 'high', frequency: 'yearly', why: 'Essential for preventing water damage to your home\'s foundation and roof.' },
  { id: 'y3', text: 'Clean behind appliances', zone: 'deep', energy: 'high', frequency: 'yearly', why: 'Removes dust from coils and prevents overheating/fire hazards.' },
  { id: 'y4', text: 'Wash pillows & duvets', zone: 'bedroom', energy: 'medium', frequency: 'yearly', why: 'Even with cases, inner pillows accumulate sweat and dust mites over time.' },
];

const getPreloadedWeek = () => {
  const days = Array(7).fill(null).map(() => []);
  const daily = DEFAULT_TASK_BANK.filter(t => t.frequency === 'daily');
  const weekly = DEFAULT_TASK_BANK.filter(t => t.frequency === 'weekly');
  
  for (let i = 0; i < 7; i++) {
    days[i] = daily.map(t => ({ ...t, id: Math.random().toString(36).substr(2, 9), completed: false }));
    if (weekly[i]) {
      days[i].push({ ...weekly[i], id: Math.random().toString(36).substr(2, 9), completed: false });
    }
  }
  return { days };
};

const getInitialMonthly = () => DEFAULT_TASK_BANK.filter(t => t.frequency === 'monthly').map(t => ({ ...t, id: Math.random().toString(36).substr(2, 9), completed: false }));
const getInitialYearly = () => DEFAULT_TASK_BANK.filter(t => t.frequency === 'yearly').map(t => ({ ...t, id: Math.random().toString(36).substr(2, 9), completed: false }));

export const usePlannerStore = create(
  persist(
    (set) => ({
      currentWeekStart: format(startOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd'),
      viewMode: 'weekly',
      weekData: { [format(startOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd')]: getPreloadedWeek() }, 
      monthlyData: { [format(new Date(), 'yyyy-MM')]: getInitialMonthly() },
      yearlyData: { [format(new Date(), 'yyyy')]: getInitialYearly() },
      taskBank: DEFAULT_TASK_BANK,
      
      setViewMode: (mode) => set({ viewMode: mode }),
      
      nextWeek: () => set((state) => ({
        currentWeekStart: format(addWeeks(new Date(state.currentWeekStart), 1), 'yyyy-MM-dd')
      })),
      
      prevWeek: () => set((state) => ({
        currentWeekStart: format(subWeeks(new Date(state.currentWeekStart), 1), 'yyyy-MM-dd')
      })),

      addTask: (key, index, task) => set((state) => {
        const newTask = { 
          ...task, 
          id: Math.random().toString(36).substr(2, 9), 
          completed: false,
          why: task.why || 'Essential maintenance.'
        };
        
        if (state.viewMode === 'weekly') {
          const week = state.weekData[key] || { days: Array(7).fill([]) };
          const newDays = [...week.days];
          newDays[index] = [...(newDays[index] || []), newTask];
          return { weekData: { ...state.weekData, [key]: { ...week, days: newDays } } };
        } else if (state.viewMode === 'monthly') {
          const monthKey = key.substring(0, 7);
          return { monthlyData: { ...state.monthlyData, [monthKey]: [...(state.monthlyData[monthKey] || []), newTask] } };
        } else {
          const yearKey = key.substring(0, 4);
          return { yearlyData: { ...state.yearlyData, [yearKey]: [...(state.yearlyData[yearKey] || []), newTask] } };
        }
      }),

      updateTask: (key, index, taskId, newText) => set((state) => {
        if (state.viewMode === 'weekly') {
          const week = state.weekData[key];
          if (!week) return state;
          const newDays = [...week.days];
          newDays[index] = newDays[index].map(t => t.id === taskId ? { ...t, text: newText } : t);
          return { weekData: { ...state.weekData, [key]: { ...week, days: newDays } } };
        } else if (state.viewMode === 'monthly') {
          const monthKey = key.substring(0, 7);
          return { monthlyData: { ...state.monthlyData, [monthKey]: state.monthlyData[monthKey].map(t => t.id === taskId ? { ...t, text: newText } : t) } };
        } else {
          const yearKey = key.substring(0, 4);
          return { yearlyData: { ...state.yearlyData, [yearKey]: state.yearlyData[yearKey].map(t => t.id === taskId ? { ...t, text: newText } : t) } };
        }
      }),

      toggleTask: (key, index, taskId) => set((state) => {
        if (state.viewMode === 'weekly') {
          const week = state.weekData[key];
          if (!week) return state;
          const newDays = [...week.days];
          newDays[index] = newDays[index].map(t => t.id === taskId ? { ...t, completed: !t.completed } : t);
          return { weekData: { ...state.weekData, [key]: { ...week, days: newDays } } };
        } else if (state.viewMode === 'monthly') {
          const monthKey = key.substring(0, 7);
          return { monthlyData: { ...state.monthlyData, [monthKey]: state.monthlyData[monthKey].map(t => t.id === taskId ? { ...t, completed: !t.completed } : t) } };
        } else {
          const yearKey = key.substring(0, 4);
          return { yearlyData: { ...state.yearlyData, [yearKey]: state.yearlyData[yearKey].map(t => t.id === taskId ? { ...t, completed: !t.completed } : t) } };
        }
      }),

      removeTask: (key, index, taskId) => set((state) => {
        if (state.viewMode === 'weekly') {
          const week = state.weekData[key];
          if (!week) return state;
          const newDays = [...week.days];
          newDays[index] = newDays[index].filter(t => t.id !== taskId);
          return { weekData: { ...state.weekData, [key]: { ...week, days: newDays } } };
        } else if (state.viewMode === 'monthly') {
          const monthKey = key.substring(0, 7);
          return { monthlyData: { ...state.monthlyData, [monthKey]: state.monthlyData[monthKey].filter(t => t.id !== taskId) } };
        } else {
          const yearKey = key.substring(0, 4);
          return { yearlyData: { ...state.yearlyData, [yearKey]: state.yearlyData[yearKey].filter(t => t.id !== taskId) } };
        }
      }),

      autoFillWeek: (key) => set((state) => {
        if (state.viewMode === 'weekly') {
          return { weekData: { ...state.weekData, [key]: getPreloadedWeek() } };
        } else if (state.viewMode === 'monthly') {
          return { monthlyData: { ...state.monthlyData, [key.substring(0, 7)]: getInitialMonthly() } };
        } else {
          return { yearlyData: { ...state.yearlyData, [key.substring(0, 4)]: getInitialYearly() } };
        }
      }),
    }),
    {
      name: 'delicioso-planner-storage-v5',
    }
  )
);
