// Rupeeve — Self-Healing AI Integrity Live Status Pill
import React from 'react';
import { Sparkles, RefreshCw } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';

export default function AIIntegrityPill() {
  const { colors, aiHealer, openModal } = useApp();

  return (
    <div
      className="flex items-center justify-between px-3.5 py-2.5 rounded-2xl border select-none"
      style={{
        backgroundColor: colors.card,
        borderColor: colors.cardBorder
      }}
    >
      <button
        onClick={() => openModal('aiInspector')}
        className="flex items-center gap-2 text-xs font-bold active:opacity-75 transition-opacity"
        style={{ color: colors.income }}
      >
        <Sparkles size={14} className={aiHealer.status === 'healing' ? 'animate-spin' : ''} />
        <span>
          {aiHealer.status === 'healing'
            ? 'AI Healing & Deduplicating…'
            : aiHealer.healCount > 0
            ? `AI: Fixed ${aiHealer.healCount} issue(s)`
            : 'AI: Transactions 100% Healthy'}
        </span>
      </button>

      <div className="flex items-center gap-2">
        <button
          onClick={aiHealer.reHeal}
          className="p-1.5 rounded-lg active:scale-90 transition-transform"
          style={{ backgroundColor: colors.bg, color: colors.inkSoft }}
          title="Run diagnostics & heal now"
        >
          <RefreshCw size={12} />
        </button>
        <button
          onClick={() => openModal('aiInspector')}
          className="text-[11px] font-extrabold underline active:opacity-75"
          style={{ color: colors.inkSoft }}
        >
          Details
        </button>
      </div>
    </div>
  );
}
