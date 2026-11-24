// Rupeeve — Adjust Balance & Summary Modal (Custom User Overrides)
import React, { useState } from 'react';
import BottomSheet from '../common/BottomSheet.jsx';
import { useApp } from '../../context/AppContext.jsx';
import { formatRupees } from '../home/BalanceHeroCard.jsx';

export default function AdjustBalanceModal({ onClose }) {
  const { colors, balanceOverride, updateBalanceOverride, stats, showToast } = useApp();

  const [balance, setBalance] = useState(
    balanceOverride?.balance !== null && balanceOverride?.balance !== undefined ? String(balanceOverride.balance) : ''
  );
  const [income, setIncome] = useState(
    balanceOverride?.income !== null && balanceOverride?.income !== undefined ? String(balanceOverride.income) : ''
  );
  const [expenses, setExpenses] = useState(
    balanceOverride?.expenses !== null && balanceOverride?.expenses !== undefined ? String(balanceOverride.expenses) : ''
  );

  const handleSave = () => {
    updateBalanceOverride({
      balance: balance.trim() === '' ? null : parseFloat(balance),
      income: income.trim() === '' ? null : parseFloat(income),
      expenses: expenses.trim() === '' ? null : parseFloat(expenses)
    });
    showToast('✅ Balance figures updated');
    onClose();
  };

  const handleResetToAuto = () => {
    updateBalanceOverride({
      balance: null,
      income: null,
      expenses: null
    });
    showToast('🔄 Reset to automatic ledger calculation');
    onClose();
  };

  return (
    <BottomSheet title="Adjust Balance & Summary" onClose={onClose}>
      <p className="text-xs mb-4" style={{ color: colors.inkSoft }}>
        Set your actual bank account balance or monthly targets. Leave blank to calculate automatically from your transaction ledger.
      </p>

      {/* Total Balance Field */}
      <div className="p-4 rounded-2xl mb-3 border" style={{ backgroundColor: colors.bg, borderColor: colors.cardBorder }}>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-bold" style={{ color: colors.ink }}>
            Total Bank Balance
          </label>
          <span className="text-[10px] font-semibold" style={{ color: colors.inkFaint }}>
            Auto: {formatRupees(stats.autoBalance)}
          </span>
        </div>
        <div className="flex items-center gap-2 pb-1 border-b" style={{ borderColor: colors.line }}>
          <span className="text-xl font-bold" style={{ color: colors.income }}>₹</span>
          <input
            type="number"
            inputMode="decimal"
            value={balance}
            onChange={(e) => setBalance(e.target.value)}
            placeholder={String(stats.autoBalance > 0 ? stats.autoBalance : 29071)}
            className="w-full bg-transparent text-xl font-extrabold outline-none"
            style={{ color: colors.ink }}
          />
        </div>
      </div>

      {/* Monthly Income Field */}
      <div className="p-4 rounded-2xl mb-3 border" style={{ backgroundColor: colors.bg, borderColor: colors.cardBorder }}>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-bold" style={{ color: colors.ink }}>
            Monthly Income
          </label>
          <span className="text-[10px] font-semibold" style={{ color: colors.inkFaint }}>
            Auto: {formatRupees(stats.autoIncome)}
          </span>
        </div>
        <div className="flex items-center gap-2 pb-1 border-b" style={{ borderColor: colors.line }}>
          <span className="text-xl font-bold" style={{ color: colors.income }}>₹</span>
          <input
            type="number"
            inputMode="decimal"
            value={income}
            onChange={(e) => setIncome(e.target.value)}
            placeholder={String(stats.autoIncome || 35000)}
            className="w-full bg-transparent text-xl font-extrabold outline-none"
            style={{ color: colors.income }}
          />
        </div>
      </div>

      {/* Monthly Expenses Field */}
      <div className="p-4 rounded-2xl mb-5 border" style={{ backgroundColor: colors.bg, borderColor: colors.cardBorder }}>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-bold" style={{ color: colors.ink }}>
            Monthly Expenses
          </label>
          <span className="text-[10px] font-semibold" style={{ color: colors.inkFaint }}>
            Auto: {formatRupees(stats.autoExpenses)}
          </span>
        </div>
        <div className="flex items-center gap-2 pb-1 border-b" style={{ borderColor: colors.line }}>
          <span className="text-xl font-bold" style={{ color: colors.expense }}>₹</span>
          <input
            type="number"
            inputMode="decimal"
            value={expenses}
            onChange={(e) => setExpenses(e.target.value)}
            placeholder={String(stats.autoExpenses || 5929)}
            className="w-full bg-transparent text-xl font-extrabold outline-none"
            style={{ color: colors.expense }}
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="space-y-2.5">
        <button
          onClick={handleSave}
          className="w-full py-4 rounded-2xl text-sm font-extrabold shadow-lg active:scale-95 transition-transform"
          style={{
            backgroundColor: colors.income,
            color: '#0A0F1D'
          }}
        >
          Save Custom Balance
        </button>

        <button
          onClick={handleResetToAuto}
          className="w-full py-3 rounded-2xl text-xs font-bold border active:scale-95 transition-transform"
          style={{
            backgroundColor: colors.bg,
            borderColor: colors.cardBorder,
            color: colors.inkSoft
          }}
        >
          🔄 Reset to Auto (Calculate from Ledger)
        </button>
      </div>
    </BottomSheet>
  );
}
