import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'primary';
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({
  isOpen,
  title,
  message,
  confirmLabel,
  cancelLabel,
  variant = 'danger',
  onConfirm,
  onCancel
}: ConfirmModalProps) {
  const { language } = useLanguage();
  const isAr = language === 'ar';

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div 
        className="relative w-full max-w-md rounded-2xl bg-[#171717] border border-[#2b2b2b] p-6 shadow-2xl space-y-5"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-start gap-3.5">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
            variant === 'danger' 
              ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
              : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
          }`}>
            {variant === 'danger' ? <Trash2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold text-[#f1f2ed] font-quicksand">{title}</h3>
            <p className="text-xs text-[#a8a6a1] mt-1 leading-relaxed">{message}</p>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="p-1.5 rounded-lg text-[#706e6a] hover:text-[#f1f2ed] hover:bg-[#232323] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#232323]">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-xl bg-[#232323] hover:bg-[#2b2b2b] text-xs font-semibold text-[#a8a6a1] hover:text-white transition-colors cursor-pointer"
          >
            {cancelLabel || (isAr ? 'إلغاء' : 'Cancel')}
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onCancel();
            }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer ${
              variant === 'danger'
                ? 'bg-red-600 hover:bg-red-500 text-white shadow-red-600/20'
                : 'bg-[#2563eb] hover:bg-[#3b82f6] text-white shadow-[#2563eb]/20'
            }`}
          >
            {confirmLabel || (isAr ? 'تأكيد الحذف' : 'Delete')}
          </button>
        </div>
      </div>
    </div>
  );
}
