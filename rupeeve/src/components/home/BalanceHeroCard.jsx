// Rupeeve — Total Balance Hero Card (Direct-Edit Enabled)
import React from 'react';
import { Eye, EyeOff, Pencil, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';

export function formatRupees(n) {
  const num = Math.round(Number(n) || 0);
  return '₹' + num.toLocaleString('en-IN');
}

export default function BalanceHeroCard() {
  const { colors, hideBalance, setHideBalance, stats, openModal } = useApp();

  return (
    <div
      className="rounded-3xl p-5 border relative overflow-hidden shadow-xl select-none"
      style={{
        background: `linear-gradient(145deg, ${colors.card} 0%, #0D1626 100%)`,
        borderColor: colors.cardBorder
      }}
    >
      {/* Top row */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold tracking-wide uppercase" style={{ color: colors.inkSoft }}>
            Total Balance
          </span>
          <button
            onClick={() => setHideBalance(!hideBalance)}
            className="p-1 active:scale-90 transition-transform"
            title="Toggle privacy"
          >
            {hideBalance ? (
              <EyeOff size={14} color={colors.inkFaint} />
            ) : (
              <Eye size={14} color={colors.inkFaint} />
            )}
          </button>
          {stats.isCustomized && (
            <span
              className="text-[9px] px-1.5 py-0.5 rounded-full font-black uppercase tracking-wider"
              style={{ backgroundColor: colors.incomeSoft, color: colors.income }}
            >
              Custom
            </span>
          )}
        </div>

        {/* Quick Edit Balance Button */}
        <button
          onClick={() => openModal('adjustBalance')}
          className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border active:scale-95 transition-transform"
          style={{
            backgroundColor: colors.bg,
            borderColor: colors.cardBorder,
            color: colors.income
          }}
        >
          <Pencil size={11} />
          <span>Edit</span>
        </button>
      </div>

      {/* Main big balance number */}
      <div
        onClick={() => openModal('adjustBalance')}
        className="cursor-pointer active:opacity-80 transition-opacity mb-5"
        title="Tap to adjust balance"
      >
        <p
          className="text-4xl font-extrabold tracking-tight"
          style={{ color: colors.ink, fontFamily: 'system-ui, sans-serif' }}
        >
          {hideBalance ? '••••••••' : formatRupees(stats.displayBalance)}
        </p>
      </div>

      {/* Income & Expense sub-tally */}
      <div className="grid grid-cols-2 gap-4 pt-3.5 border-t" style={{ borderColor: colors.line }}>
        {/* Income column */}
        <div
          onClick={() => openModal('adjustBalance')}
          className="flex items-center gap-2.5 cursor-pointer active:opacity-75 transition-opacity"
          title="Tap to adjust monthly income"
        >
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: colors.incomeSoft }}
          >
            <ArrowUpRight size={16} color={colors.income} strokeWidth={2.5} />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="text-[11px] font-medium" style={{ color: colors.inkSoft }}>
                Income
              </span>
              <Pencil size={9} color={colors.inkFaint} />
            </div>
            <p className="text-sm font-bold leading-tight" style={{ color: colors.income }}>
              {hideBalance ? '••••' : formatRupees(stats.displayIncome)}
            </p>
          </div>
        </div>

        {/* Expenses column */}
        <div
          onClick={() => openModal('adjustBalance')}
          className="flex items-center gap-2.5 cursor-pointer active:opacity-75 transition-opacity"
          title="Tap to adjust monthly expenses"
        >
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: colors.expenseSoft }}
          >
            <ArrowDownRight size={16} color={colors.expense} strokeWidth={2.5} />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="text-[11px] font-medium" style={{ color: colors.inkSoft }}>
                Expenses
              </span>
              <Pencil size={9} color={colors.inkFaint} />
            </div>
            <p className="text-sm font-bold leading-tight" style={{ color: colors.expense }}>
              {hideBalance ? '••••' : formatRupees(stats.displayExpenses)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
