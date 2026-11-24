// Rupeeve — Reusable Bottom Sheet / Modal Shell
import React, { useEffect } from 'react';
import { ChevronLeft, X } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';

export default function BottomSheet({ title, onClose, children, rightAction }) {
  const { colors } = useApp();

  // Android hardware back button handler
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col justify-end"
      style={{ backgroundColor: colors.overlay, animation: 'fadeIn 0.15s ease-out' }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="w-full max-w-md mx-auto flex flex-col rounded-t-3xl border-t shadow-2xl overflow-hidden"
        style={{
          backgroundColor: colors.card,
          borderColor: colors.cardBorder,
          maxHeight: '92vh',
          animation: 'slideUp 0.22s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag pill handle */}
        <div className="w-full flex justify-center pt-2.5 pb-1">
          <div className="w-10 h-1.5 rounded-full" style={{ backgroundColor: colors.line }} />
        </div>

        {/* Header */}
        <div
          className="flex items-center justify-between px-4 py-2.5 border-b"
          style={{ borderColor: colors.line }}
        >
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center border active:scale-95 transition-transform"
            style={{ backgroundColor: colors.bg, borderColor: colors.cardBorder, color: colors.inkSoft }}
          >
            <ChevronLeft size={18} />
          </button>

          <h3 className="text-sm font-bold tracking-tight" style={{ color: colors.ink }}>
            {title}
          </h3>

          <div>
            {rightAction || (
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center border active:scale-95 transition-transform"
                style={{ backgroundColor: colors.bg, borderColor: colors.cardBorder, color: colors.inkSoft }}
              >
                <X size={15} />
              </button>
            )}
          </div>
        </div>

        {/* Content body */}
        <div className="flex-1 overflow-y-auto px-4 pt-4 pb-8" style={{ WebkitOverflowScrolling: 'touch' }}>
          {children}
        </div>
      </div>
    </div>
  );
}
