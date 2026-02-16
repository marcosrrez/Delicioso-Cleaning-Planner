import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { startOfWeek, format, addWeeks, subWeeks } from 'date-fns';

const DEFAULT_TASK_BANK = [
  // --- DAILY (Essentials) ---
  { id: 'd1', text: 'Make the bed', zone: 'bedroom', energy: 'low', frequency: 'daily', why: 'Provides immediate visual order and sets a productive tone.' },
  { id: 'd2', text: 'Wipe kitchen counters', zone: 'kitchen', energy: 'low', frequency: 'daily', why: 'Prevents food-borne bacteria and pest attraction.' },
  { id: 'd4', text: 'Wash dirty dishes', zone: 'kitchen', energy: 'medium', frequency: 'daily', why: 'Eliminates odors and prevents crusty food buildup.' },
  { id: 'd5', text: 'Sweep high-traffic floors', zone: 'deep', energy: 'medium', frequency: 'daily', why: 'Prevents grit from scratching floor finishes.' },

  // --- WEEKLY (Refined Strategic Distribution) ---
  { id: 'w1', text: 'Launder bath mats & towels', zone: 'bathroom', energy: 'medium', frequency: 'weekly', why: 'Fabrics in humid zones capture bacteria and mildew rapidly.' },
  { id: 'w2', text: 'Deep clean toilets & showers', zone: 'bathroom', energy: 'high', frequency: 'weekly', why: 'Stops hard water scale and mold before they become permanent.' },
  { id: 'w3', text: 'Dust all surfaces', zone: 'living', energy: 'medium', frequency: 'weekly', why: 'Protects air quality and electronics from overheating.' },
  { id: 'w4', text: 'Vacuum & mop all floors', zone: 'deep', energy: 'high', frequency: 'weekly', why: 'Removes deep-seated allergens and dander.' },
  { id: 'w5', text: 'Change bed sheets', zone: 'bedroom', energy: 'medium', frequency: 'weekly', why: 'Essential for respiratory health and skin hygiene.' },
  { id: 'w6', text: 'Flush kitchen drain (Boiling Water)', zone: 'kitchen', energy: 'low', frequency: 'weekly', why: 'Melts grease buildup to prevent expensive plumbing clogs.' },
  { id: 'w7', text: 'Wipe microwave & toaster', zone: 'kitchen', energy: 'medium', frequency: 'weekly', why: 'Prevents baked-on grease and fire hazards.' },
  { id: 'w13', text: 'Fridge Purge (Expired Items)', zone: 'kitchen', energy: 'low', frequency: 'weekly', why: 'Prevents odors and maintains food safety.' },
  { id: 'w8', text: 'Clean mirrors & glass', zone: 'living', energy: 'medium', frequency: 'weekly', why: 'Removes fingerprints and maximizes natural light.' },
  { id: 'w9', text: 'Sort mail & pay bills', zone: 'living', energy: 'medium', frequency: 'weekly', why: 'Reduces mental load and paper clutter.' },

  // --- MONTHLY (Strategic Maintenance) ---
  { id: 'm11', text: 'Test Smoke & CO Alarms', zone: 'deep', energy: 'low', frequency: 'monthly', why: 'Life-saving priority to ensure devices are active.' },
  { id: 'm12', text: 'Change/Clean HVAC Filters', zone: 'deep', energy: 'medium', frequency: 'monthly', why: 'Prevents $5,000 blower motor failures and improves air.' },
  { id: 'm6', text: 'Wash vent hood filters', zone: 'kitchen', energy: 'medium', frequency: 'monthly', why: 'Prevents grease fires and keeps kitchen air fresh.' },
  { id: 'm13', text: 'Test GFCI Outlets', zone: 'deep', energy: 'low', frequency: 'monthly', why: 'Ensures shock-protection circuits are functional.' },

  // --- YEARLY ---
  { id: 'y2', text: 'Clean gutters & downspouts', zone: 'deep', energy: 'high', frequency: 'yearly', why: 'Critical to prevent foundation water damage.' },
  { id: 'y11', text: 'Clean Dryer Exhaust Vent', zone: 'deep', energy: 'high', frequency: 'yearly', why: 'Lint buildup is a leading cause of house fires.' },
  { id: 'y12', text: 'Flush Water Heater', zone: 'deep', energy: 'high', frequency: 'yearly', why: 'Removes corrosive sediment and improves efficiency.' },
];

const getDistributedWeek = () => {
  const days = Array(7).fill(null).map(() => []);
  const daily = DEFAULT_TASK_BANK.filter(t => t.frequency === 'daily');
  const weeklyFocus = {
    0: ['w6', 'w7', 'w13'], // Mon: Kitchen
    1: ['w1', 'w2'],       // Tue: Bathroom
    2: ['w3', 'w8'],       // Wed: Dust/Glass
    3: ['w5'],             // Thu: Bedroom
    4: ['w4'],             // Fri: Floors
    5: ['w9'],             // Sat: Admin
    6: [],                 // Sun: Rest
  };
  for (let i = 0; i < 7; i++) {
    days[i] = daily.map(t => ({ ...t, id: Math.random().toString(36).substr(2, 9), completed: false, isEssential: true }));
    (weeklyFocus[i] || []).forEach(fid => {
      const task = DEFAULT_TASK_BANK.find(t => t.id === fid);
      if (task) days[i].push({ ...task, id: Math.random().toString(36).substr(2, 9), completed: false, note: '' });
    });
  }
  return { days };
};

const getPreloadedMonthly = () => DEFAULT_TASK_BANK.filter(t => t.frequency === 'monthly' && ['m11', 'm12', 'm6', 'm13'].includes(t.id)).map(t => ({ ...t, id: Math.random().toString(36).substr(2, 9), completed: false, note: '' }));
const getPreloadedYearly = () => DEFAULT_TASK_BANK.filter(t => t.frequency === 'yearly').map(t => ({ ...t, id: Math.random().toString(36).substr(2, 9), completed: false, note: '' }));

export const usePlannerStore = create(
  persist(
    (set) => ({
      currentWeekStart: format(startOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd'),
      viewMode: 'weekly',
      weekData: { [format(startOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd')]: getDistributedWeek() }, 
      monthlyData: { [format(new Date(), 'yyyy-MM')]: getPreloadedMonthly() },
      yearlyData: { [format(new Date(), 'yyyy')]: getPreloadedYearly() },
      taskBank: DEFAULT_TASK_BANK,
      
      setViewMode: (mode) => set({ viewMode: mode }),
      nextWeek: () => set((state) => ({ currentWeekStart: format(addWeeks(new Date(state.currentWeekStart), 1), 'yyyy-MM-dd') })),
      prevWeek: () => set((state) => ({ currentWeekStart: format(subWeeks(new Date(state.currentWeekStart), 1), 'yyyy-MM-dd') })),

      addTask: (key, index, task) => set((state) => {
        const newTask = { id: Math.random().toString(36).substr(2, 9), completed: false, note: '', ...task };
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

      updateTask: (key, index, taskId, updates) => set((state) => {
        const updateInList = (list) => (list || []).map(t => t.id === taskId ? { ...t, ...updates } : t);
        if (state.viewMode === 'weekly') {
          const week = state.weekData[key];
          if (!week) return state;
          const newDays = [...week.days];
          newDays[index] = updateInList(newDays[index]);
          return { weekData: { ...state.weekData, [key]: { ...week, days: newDays } } };
        } else if (state.viewMode === 'monthly') {
          const monthKey = key.substring(0, 7);
          return { monthlyData: { ...state.monthlyData, [monthKey]: updateInList(state.monthlyData[monthKey]) } };
        } else {
          const yearKey = key.substring(0, 4);
          return { yearlyData: { ...state.yearlyData, [yearKey]: updateInList(state.yearlyData[yearKey]) } };
        }
      }),

      toggleTask: (key, index, taskId) => set((state) => {
        const toggleInList = (list) => (list || []).map(t => t.id === taskId ? { ...t, completed: !t.completed } : t);
        if (state.viewMode === 'weekly') {
          const week = state.weekData[key];
          if (!week) return state;
          const newDays = [...week.days];
          newDays[index] = toggleInList(newDays[index]);
          return { weekData: { ...state.weekData, [key]: { ...week, days: newDays } } };
        } else if (state.viewMode === 'monthly') {
          const monthKey = key.substring(0, 7);
          return { monthlyData: { ...state.monthlyData, [monthKey]: toggleInList(state.monthlyData[monthKey]) } };
        } else {
          const yearKey = key.substring(0, 4);
          return { yearlyData: { ...state.yearlyData, [yearKey]: toggleInList(state.yearlyData[yearKey]) } };
        }
      }),

      removeTask: (key, index, taskId) => set((state) => {
        const removeFromList = (list) => (list || []).filter(t => t.id !== taskId);
        if (state.viewMode === 'weekly') {
          const week = state.weekData[key];
          if (!week) return state;
          const newDays = [...week.days];
          newDays[index] = removeFromList(newDays[index]);
          return { weekData: { ...state.weekData, [key]: { ...week, days: newDays } } };
        } else if (state.viewMode === 'monthly') {
          const monthKey = key.substring(0, 7);
          return { monthlyData: { ...state.monthlyData, [monthKey]: removeFromList(state.monthlyData[monthKey]) } };
        } else {
          const yearKey = key.substring(0, 4);
          return { yearlyData: { ...state.yearlyData, [yearKey]: removeFromList(state.yearlyData[yearKey]) } };
        }
      }),

      autoFillWeek: (key) => set((state) => {
        if (state.viewMode === 'weekly') {
          return { weekData: { ...state.weekData, [key]: getDistributedWeek() } };
        } else if (state.viewMode === 'monthly') {
          return { monthlyData: { ...state.monthlyData, [key.substring(0, 7)]: getPreloadedMonthly() } };
        } else {
          return { yearlyData: { ...state.yearlyData, [key.substring(0, 4)]: getPreloadedYearly() } };
        }
      }),
    }),
    {
      name: 'delicioso-planner-storage-v10',
    }
  )
);
