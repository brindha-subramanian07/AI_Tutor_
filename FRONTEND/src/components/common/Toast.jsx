import React from 'react';
import { useLearning } from '../../context/LearningContext';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export const ToastContainer = () => {
  const { toasts, removeToast } = useLearning();

  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        let bgStyle = 'bg-[#FFFFFF] border-[#E6E8F6] text-[#1E1B33]';
        let Icon = Info;
        let iconColor = 'text-[#7C5CFC]';

        if (toast.type === 'success') {
          bgStyle = 'bg-[#ECFDF5] border-[#A7F3D0] text-[#065F46]';
          Icon = CheckCircle2;
          iconColor = 'text-[#10B981]';
        } else if (toast.type === 'warning') {
          bgStyle = 'bg-[#FFFBEB] border-[#FDE68A] text-[#78350F]';
          Icon = AlertTriangle;
          iconColor = 'text-[#F59E0B]';
        } else if (toast.type === 'error') {
          bgStyle = 'bg-[#FFF1F2] border-[#FECDD3] text-[#9F1239]';
          Icon = AlertTriangle;
          iconColor = 'text-[#F43F5E]';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-2xl border shadow-snow-lg transition-all transform duration-200 animate-fadeIn ${bgStyle}`}
          >
            <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${iconColor}`} />
            <div className="flex-1 text-sm font-medium leading-snug">
              {toast.message}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-[#676282] hover:text-[#1E1B33] transition-colors p-0.5"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
