import React from 'react';
import { format } from 'date-fns';
import { ZONES, ZONE_THEMES } from './constants';

/**
 * Etsy-style cute printable checklist.
 * Designed to look like a hand-crafted planner page with:
 * - Decorative header with script-style branding
 * - Pastel zone color dots next to each task
 * - Pretty checkbox circles
 * - Clean grid with ample whitespace
 * - Focus theme label per day (Kitchen Day, Bathroom Day, etc.)
 * - Motivational footer
 */
export default function PrintView({ weekDays, currentWeek }) {
  const weekStart = format(weekDays[0], 'MMMM d');
  const weekEnd = format(weekDays[6], 'MMMM d, yyyy');

  return (
    <div className="print-only hidden">
      <div className="print-page">
        {/* ---- DECORATIVE HEADER ---- */}
        <div className="print-header">
          <div className="print-header-ornament">&#10053; &#10053; &#10053;</div>
          <h1 className="print-title">Weekly Cleaning Plan</h1>
          <p className="print-subtitle">{weekStart} &mdash; {weekEnd}</p>
          <div className="print-header-rule" />
        </div>

        {/* ---- 7-DAY GRID ---- */}
        <div className="print-grid">
          {weekDays.map((day, idx) => {
            const dayTasks = currentWeek.days[idx] || [];
            const essentials = dayTasks.filter(t => t.isEssential);
            const focus = dayTasks.filter(t => !t.isEssential);
            const theme = ZONE_THEMES[idx];

            return (
              <div key={idx} className="print-day-col">
                {/* Day header */}
                <div className="print-day-header">
                  <span className="print-day-name">{format(day, 'EEEE')}</span>
                  <span className="print-day-num">{format(day, 'd')}</span>
                </div>

                {/* Focus theme */}
                {theme && (
                  <div className="print-day-theme">{theme.label}</div>
                )}

                {/* Essentials */}
                {essentials.length > 0 && (
                  <div className="print-section">
                    <div className="print-section-label">Daily Essentials</div>
                    {essentials.map(task => (
                      <PrintTaskRow key={task.id} task={task} />
                    ))}
                  </div>
                )}

                {/* Focus tasks */}
                {focus.length > 0 && (
                  <div className="print-section">
                    <div className="print-section-label">Focus Tasks</div>
                    {focus.map(task => (
                      <PrintTaskRow key={task.id} task={task} />
                    ))}
                  </div>
                )}

                {/* Empty day message */}
                {dayTasks.length === 0 && (
                  <div className="print-rest-msg">Rest day</div>
                )}

                {/* Notes line */}
                <div className="print-notes-area">
                  <span className="print-notes-label">Notes:</span>
                  <div className="print-notes-line" />
                  <div className="print-notes-line" />
                </div>
              </div>
            );
          })}
        </div>

        {/* ---- FOOTER ---- */}
        <div className="print-footer">
          <div className="print-footer-rule" />
          <p className="print-footer-quote">"A clean home is a happy home. One small task at a time."</p>
          <div className="print-footer-brand">
            <span className="print-footer-logo">Delicioso Planner</span>
            <span className="print-footer-dots">&#9679; &#9679; &#9679;</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function PrintTaskRow({ task }) {
  const zone = ZONES[task.zone];
  return (
    <div className="print-task-row">
      <div className="print-checkbox" />
      {zone && <div className={`print-zone-dot ${zone.color}`} />}
      <span className="print-task-text">{task.text}</span>
    </div>
  );
}
