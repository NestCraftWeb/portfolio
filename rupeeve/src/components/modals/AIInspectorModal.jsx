// Rupeeve — AI Self-Healing Diagnostics & Inspection Modal
import React from 'react';
import { Sparkles, RefreshCw, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import BottomSheet from '../common/BottomSheet.jsx';
import { useApp } from '../../context/AppContext.jsx';

export default function AIInspectorModal({ onClose }) {
  const { colors, aiHealer, showToast } = useApp();

  const handleRunDiagnostics = () => {
    aiHealer.reHeal();
    showToast('⚡ AI Diagnostics & Integrity Check completed');
  };

  return (
    <BottomSheet title="Self-Healing AI Diagnostics" onClose={onClose}>
      {/* Status banner */}
      <div
        className="p-4 rounded-3xl border mb-4 relative overflow-hidden shadow-lg"
        style={{ backgroundColor: colors.bg, borderColor: colors.cardBorder }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: colors.incomeSoft }}
          >
            <Sparkles size={24} color={colors.income} />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-extrabold" style={{ color: colors.ink }}>
              Autonomous Health Engine
            </h4>
            <p className="text-xs font-semibold" style={{ color: colors.income }}>
              {aiHealer.status === 'healing'
                ? 'Running repair pass…'
                : aiHealer.healCount > 0
                ? `${aiHealer.healCount} issues resolved & database optimized`
                : 'All transactions verified & healthy'}
            </p>
          </div>
        </div>

        {/* Feature points */}
        <div className="mt-4 pt-3 border-t grid grid-cols-2 gap-2 text-[11px]" style={{ borderColor: colors.line }}>
          <div className="flex items-center gap-1.5" style={{ color: colors.inkSoft }}>
            <CheckCircle2 size={13} color={colors.income} />
            <span>Anti-Duplicate Lock</span>
          </div>
          <div className="flex items-center gap-1.5" style={{ color: colors.inkSoft }}>
            <CheckCircle2 size={13} color={colors.income} />
            <span>Schema Self-Repair</span>
          </div>
          <div className="flex items-center gap-1.5" style={{ color: colors.inkSoft }}>
            <CheckCircle2 size={13} color={colors.income} />
            <span>UPI & SMS Linking</span>
          </div>
          <div className="flex items-center gap-1.5" style={{ color: colors.inkSoft }}>
            <CheckCircle2 size={13} color={colors.income} />
            <span>Zero Data Loss</span>
          </div>
        </div>
      </div>

      {/* Manual Diagnostic Trigger */}
      <button
        onClick={handleRunDiagnostics}
        className="w-full py-3.5 px-4 rounded-2xl border flex items-center justify-center gap-2 text-xs font-bold active:scale-95 transition-transform mb-4 shadow-sm"
        style={{
          backgroundColor: colors.card,
          borderColor: colors.cardBorder,
          color: colors.income
        }}
      >
        <RefreshCw size={15} color={colors.income} />
        <span>Run Deep Health Scan & Deduplication</span>
      </button>

      {/* Activity Log */}
      <div className="mb-2">
        <h5 className="text-xs font-bold mb-2" style={{ color: colors.inkSoft }}>
          Live Healing Activity Log
        </h5>
        <div
          className="rounded-2xl border p-2 max-h-56 overflow-y-auto space-y-1.5"
          style={{ backgroundColor: colors.bg, borderColor: colors.cardBorder }}
        >
          {aiHealer.healLogs.length === 0 ? (
            <p className="text-xs text-center py-4" style={{ color: colors.inkFaint }}>
              No repairs required. Ledger state is optimal.
            </p>
          ) : (
            aiHealer.healLogs.map((log, idx) => (
              <div
                key={idx}
                className="p-2 rounded-xl text-[11px] font-medium flex items-start gap-2 border"
                style={{ backgroundColor: colors.card, borderColor: colors.cardBorder }}
              >
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded" style={{ backgroundColor: colors.line, color: colors.inkSoft }}>
                  {log.time}
                </span>
                <span className="flex-1" style={{ color: colors.ink }}>
                  {log.msg}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </BottomSheet>
  );
}
