import React from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

export default function ConfirmDialog({ open, title, message, onConfirm, onCancel, confirmLabel = 'Yes, do it', danger = false }) {
  return (
    <AnimatePresence>
      {open && (
        <Motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[70] flex items-center justify-center p-4"
          onClick={onCancel}
        >
          <Motion.div
            initial={{ scale: 0.9, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 10 }}
            className="bg-white w-full max-w-sm rounded-3xl shadow-2xl p-8 text-center space-y-4"
            onClick={e => e.stopPropagation()}
          >
            <div className={`w-14 h-14 mx-auto rounded-2xl flex items-center justify-center ${danger ? 'bg-red-50 text-red-400' : 'bg-amber-50 text-amber-400'}`}>
              <AlertTriangle size={28} />
            </div>
            <h3 className="text-xl font-black text-slate-800">{title}</h3>
            <p className="text-sm text-slate-500 leading-relaxed">{message}</p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={onCancel}
                className="flex-1 py-3 rounded-2xl border-2 border-slate-100 text-slate-500 font-bold text-sm hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className={`flex-1 py-3 rounded-2xl font-bold text-sm text-white transition-all hover:scale-105 active:scale-95 ${danger ? 'bg-red-400 shadow-lg shadow-red-200' : 'bg-brand-accent shadow-lg shadow-brand-accent/20'}`}
              >
                {confirmLabel}
              </button>
            </div>
          </Motion.div>
        </Motion.div>
      )}
    </AnimatePresence>
  );
}
