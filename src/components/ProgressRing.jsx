import React from 'react';

export default function ProgressRing({ completed, total, size = 36, strokeWidth = 3 }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const ratio = total > 0 ? completed / total : 0;
  const offset = circumference * (1 - ratio);
  const allDone = total > 0 && completed === total;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-slate-100"
        />
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className={`transition-all duration-500 ${allDone ? 'text-green-400' : 'text-brand-accent'}`}
        />
      </svg>
      <span className={`absolute text-[9px] font-black ${allDone ? 'text-green-400' : 'text-slate-400'}`}>
        {total > 0 ? `${completed}` : '-'}
      </span>
    </div>
  );
}
