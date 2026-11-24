// Rupeeve — Monthly Budget Limit Progress Widget
import React from 'react';
import { useApp } from '../../context/AppContext.jsx';
import { formatRupees } from './BalanceHeroCard.jsx';

export default function BudgetProgressBar() {
  const { colors, stats, openModal } = useApp();

  if (stats.budgetLimit <= 0) return null;

  return (
    <div
      onClick={() => openModal('settings')}
      className="p-4 rounded-2xl border cursor-pointer active:opacity-90 transition-opacity select-none"
      style={{
        backgroundColor: colors.card,
        borderColor: stats.budgetAlert ? colors.expense : colors.cardBorder
      }}
      title="Tap to adjust monthly budget"
    >
      <div className="flex items-center justify-between text-xs mb-2">
        <span
          className="font-bold flex items-center gap-1.5"
          style={{ color: stats.budgetAlert ? colors.expense : colors.inkSoft }}
        >
          {stats.budgetAlert ? '⚠️ Budget Limit Exceeded / Close' : 'Monthly Budget Goal'}
        </span>
        <span className="font-extrabold" style={{ color: colors.ink }}>
          {formatRupees(stats.displayExpenses)} / {formatRupees(stats.budgetLimit)}
        </span>
      </div>

      <div className="rounded-full overflow-hidden h-2" style={{ backgroundColor: colors.line }}>
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${Math.round(stats.budgetPct * 100)}%`,
            backgroundColor: stats.budgetPct >= 0.9 ? colors.expense : colors.income
          }}
        />
      </div>
    </div>
  );
}
