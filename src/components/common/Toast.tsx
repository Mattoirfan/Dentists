import React from 'react';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';
import { useClinic } from '../../context/ClinicContext';

export const Toast: React.FC = () => {
  const { toast, hideToast } = useClinic();

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
    error: <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0" />,
    info: <Info className="w-5 h-5 text-teal-500 shrink-0" />,
  };

  const borders = {
    success: 'border-emerald-200 bg-white text-slate-900',
    error: 'border-rose-200 bg-white text-slate-900',
    info: 'border-teal-200 bg-white text-slate-900',
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md w-full animate-slideUp">
      <div
        className={`flex items-start gap-3 p-4 rounded-2xl shadow-xl border ${
          borders[toast.type]
        }`}
      >
        {icons[toast.type]}
        <div className="flex-1 text-xs sm:text-sm font-medium leading-snug">
          {toast.message}
        </div>
        <button
          onClick={hideToast}
          className="text-slate-400 hover:text-slate-600 p-0.5 rounded transition-colors"
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
