import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { startOfWeek, format, addWeeks, subWeeks } from 'date-fns';

const DEFAULT_TASK_BANK = [
  { id: 't1', text: 'Empty Sink', zone: 'kitchen', energy: 'low', frequency: 'daily' },
  { id: 't2', text: 'Clear Counters', zone: 'kitchen', energy: 'low', frequency: 'daily' },
  { id: 't3', text: 'Sanitize Toilet', zone: 'bathroom', energy: 'medium', frequency: 'weekly' },
  { id: 't4', text: 'Change Sheets', zone: 'bedroom', energy: 'high', frequency: 'weekly' },
  { id: 't5', text: 'Trash Out', zone: 'deep', energy: 'low', frequency: 'daily' },
  { id: 't6', text: 'Dust Surfaces', zone: 'living', energy: 'medium', frequency: 'weekly' },
  { id: 't7', text: 'Mop Floors', zone: 'deep', energy: 'high', frequency: 'weekly' },
  { id: 't8', text: 'Water Plants', zone: 'living', energy: 'low', frequency: 'weekly' },
  { id: 't9', text: 'Fridge Purge', zone: 'kitchen', energy: 'medium', frequency: 'weekly' },
];

export const usePlannerStore = create(
  persist(
    (set, get) => ({
      currentWeekStart: format(startOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd'),
      weekData: {}, // { '2026-02-09': { tasks: [...] } }
      taskBank: DEFAULT_TASK_BANK,
      
      nextWeek: () => set((state) => ({
        currentWeekStart: format(addWeeks(new Date(state.currentWeekStart), 1), 'yyyy-MM-dd')
      })),
      
      prevWeek: () => set((state) => ({
        currentWeekStart: format(subWeeks(new Date(state.currentWeekStart), 1), 'yyyy-MM-dd')
      })),

      addTask: (weekKey, dayIndex, task) => set((state) => {
        const week = state.weekData[weekKey] || { days: Array(7).fill([]) };
        const newDays = [...week.days];
        newDays[dayIndex] = [...newDays[dayIndex], { ...task, id: Math.random().toString(36).substr(2, 9), completed: false }];
        return {
          weekData: {
            ...state.weekData,
            [weekKey]: { ...week, days: newDays }
          }
        };
      }),

      toggleTask: (weekKey, dayIndex, taskId) => set((state) => {
        const week = state.weekData[weekKey];
        if (!week) return state;
        const newDays = [...week.days];
        newDays[dayIndex] = newDays[dayIndex].map(t => 
          t.id === taskId ? { ...t, completed: !t.completed } : t
        );
        return {
          weekData: { ...state.weekData, [weekKey]: { ...week, days: newDays } }
        };
      }),

      removeTask: (weekKey, dayIndex, taskId) => set((state) => {
        const week = state.weekData[weekKey];
        if (!week) return state;
        const newDays = [...week.days];
        newDays[dayIndex] = newDays[dayIndex].filter(t => t.id !== taskId);
        return {
          weekData: { ...state.weekData, [weekKey]: { ...week, days: newDays } }
        };
      }),

      autoFillWeek: (weekKey) => set((state) => {
        const newDays = Array(7).fill(null).map(() => []);
        // Pick 2 random tasks per day from the bank
        for (let i = 0; i < 7; i++) {
          const shuffled = [...state.taskBank].sort(() => 0.5 - Math.random());
          const selected = shuffled.slice(0, 2).map(t => ({
            ...t,
            id: Math.random().toString(36).substr(2, 9),
            completed: false
          }));
          newDays[i] = selected;
        }
        return {
          weekData: {
            ...state.weekData,
            [weekKey]: { days: newDays }
          }
        };
      }),
    }),
    {
      name: 'delicioso-planner-storage',
    }
  )
);
