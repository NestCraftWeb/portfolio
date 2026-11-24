// Rupeeve — Quick Action Grid
import React from 'react';
import { Plus, ArrowRightLeft, QrCode } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';

export default function QuickActions() {
  const { colors, openModal, setActiveTab } = useApp();

  return (
    <div className="grid grid-cols-4 gap-2.5 select-none">
      {/* 1. Scan & Pay UPI */}
      <button
        onClick={() => openModal('qrScanner')}
        className="flex flex-col items-center justify-center gap-1.5 py-3 px-1 rounded-2xl border active:scale-95 transition-transform shadow-md"
        style={{
          backgroundColor: colors.card,
          borderColor: colors.income,
          color: colors.ink
        }}
      >
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: colors.incomeSoft }}
        >
          <QrCode size={18} color={colors.income} strokeWidth={2.5} />
        </div>
        <span className="text-[11px] font-extrabold tracking-tight" style={{ color: colors.income }}>
          Scan & Pay
        </span>
      </button>

      {/* 2. Add Expense */}
      <button
        onClick={() => openModal('add', { initialType: 'debit' })}
        className="flex flex-col items-center justify-center gap-1.5 py-3 px-1 rounded-2xl active:scale-95 transition-transform shadow-md"
        style={{
          backgroundColor: colors.expense,
          color: '#FFFFFF'
        }}
      >
        <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-white/20">
          <Plus size={18} color="#FFFFFF" strokeWidth={3} />
        </div>
        <span className="text-[11px] font-extrabold tracking-tight">Expense</span>
      </button>

      {/* 3. Add Income */}
      <button
        onClick={() => openModal('add', { initialType: 'credit' })}
        className="flex flex-col items-center justify-center gap-1.5 py-3 px-1 rounded-2xl active:scale-95 transition-transform shadow-md"
        style={{
          backgroundColor: colors.blue,
          color: '#FFFFFF'
        }}
      >
        <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-white/20">
          <Plus size={18} color="#FFFFFF" strokeWidth={3} />
        </div>
        <span className="text-[11px] font-extrabold tracking-tight">Income</span>
      </button>

      {/* 4. Udhar / Lending */}
      <button
        onClick={() => setActiveTab('lending')}
        className="flex flex-col items-center justify-center gap-1.5 py-3 px-1 rounded-2xl border active:scale-95 transition-transform shadow-md"
        style={{
          backgroundColor: colors.card,
          borderColor: colors.cardBorder,
          color: colors.ink
        }}
      >
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: colors.purpleSoft }}
        >
          <ArrowRightLeft size={16} color={colors.purple} strokeWidth={2.5} />
        </div>
        <span className="text-[11px] font-extrabold tracking-tight">Udhar</span>
      </button>
    </div>
  );
}
