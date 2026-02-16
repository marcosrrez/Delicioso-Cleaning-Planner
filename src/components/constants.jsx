import React from 'react';
import { Coffee, Wind, Zap } from 'lucide-react';

export const ZONES = {
  kitchen: { color: 'bg-brand-yellow', label: 'K', name: 'Kitchen' },
  living: { color: 'bg-brand-green', label: 'L', name: 'Living' },
  bathroom: { color: 'bg-brand-blue', label: 'B', name: 'Bathroom' },
  bedroom: { color: 'bg-brand-purple', label: 'R', name: 'Bedroom' },
  deep: { color: 'bg-brand-pink', label: 'D', name: 'Deep Clean' },
};

export const ENERGY_ICONS = {
  low: <Coffee size={14} className="text-blue-400" />,
  medium: <Wind size={14} className="text-green-400" />,
  high: <Zap size={14} className="text-orange-400" />,
};

export const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
export const DAY_LETTERS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

export const ZONE_THEMES = {
  0: { label: 'Kitchen Day', icon: 'utensils', color: 'text-brand-yellow' },
  1: { label: 'Bathroom Day', icon: 'bath', color: 'text-brand-blue' },
  2: { label: 'Dust & Shine', icon: 'sparkles', color: 'text-brand-green' },
  3: { label: 'Bedroom Day', icon: 'bed', color: 'text-brand-purple' },
  4: { label: 'Floor Day', icon: 'home', color: 'text-brand-pink' },
  5: { label: 'Admin Day', icon: 'mail', color: 'text-slate-400' },
  6: { label: 'Rest & Recharge', icon: 'heart', color: 'text-red-300' },
};
