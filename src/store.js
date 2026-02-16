import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { startOfWeek, format, addWeeks, subWeeks } from 'date-fns';

const DEFAULT_TASK_BANK = [
  // DAILY
  { id: 'd1', text: 'Make the bed', zone: 'bedroom', energy: 'low', frequency: 'daily' },
  { id: 'd2', text: 'Wipe kitchen counters', zone: 'kitchen', energy: 'low', frequency: 'daily' },
  { id: 'd3', text: 'Sanitize high-touch surfaces', zone: 'living', energy: 'low', frequency: 'daily' },
  { id: 'd4', text: 'Wash dirty dishes', zone: 'kitchen', energy: 'medium', frequency: 'daily' },
  { id: 'd5', text: 'Sweep floors', zone: 'deep', energy: 'medium', frequency: 'daily' },
  
  // WEEKLY
  { id: 'w1', text: 'Launder bath mats & towels', zone: 'bathroom', energy: 'medium', frequency: 'weekly' },
  { id: 'w2', text: 'Clean toilets & showers', zone: 'bathroom', energy: 'high', frequency: 'weekly' },
  { id: 'w3', text: 'Dust all surfaces', zone: 'living', energy: 'medium', frequency: 'weekly' },
  { id: 'w4', text: 'Vacuum & mop floors', zone: 'deep', energy: 'high', frequency: 'weekly' },
  { id: 'w5', text: 'Change bed sheets', zone: 'bedroom', energy: 'medium', frequency: 'weekly' },
  { id: 'w6', text: 'Flush kitchen drain (boiling water)', zone: 'kitchen', energy: 'low', frequency: 'weekly' },
  
  // MONTHLY
  { id: 'm1', text: 'Scrub grout', zone: 'bathroom', energy: 'high', frequency: 'monthly' },
  { id: 'm2', text: 'Wipe inside medicine cabinets', zone: 'bathroom', energy: 'medium', frequency: 'monthly' },
  { id: 'm3', text: 'Vacuum baseboards', zone: 'deep', energy: 'medium', frequency: 'monthly' },
  { id: 'm4', text: 'Dust ceiling fans', zone: 'living', energy: 'medium', frequency: 'monthly' },
  { id: 'm5', text: 'Clean switch plates & phones', zone: 'living', energy: 'low', frequency: 'monthly' },
  
  // SEASONAL / YEARLY
  { id: 'y1', text: 'Deep clean oven', zone: 'kitchen', energy: 'high', frequency: 'yearly' },
  { id: 'y2', text: 'Clean gutters', zone: 'deep', energy: 'high', frequency: 'yearly' },
  { id: 'y3', text: 'Clean behind large appliances', zone: 'deep', energy: 'high', frequency: 'yearly' },
  { id: 'y4', text: 'Wash pillows & duvets', zone: 'bedroom', energy: 'medium', frequency: 'yearly' },
];

export const usePlannerStore = create(
  persist(
    (set) => ({
      currentWeekStart: format(startOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd'),
      viewMode: 'weekly', // 'weekly' | 'monthly' | 'yearly'
      weekData: {}, 
      taskBank: DEFAULT_TASK_BANK,
      
      setViewMode: (mode) => set({ viewMode: mode }),
      
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
