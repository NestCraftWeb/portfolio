// Rupeeve — Edit Transaction Modal
import React, { useState } from 'react';
import BottomSheet from '../common/BottomSheet.jsx';
import { useApp } from '../../context/AppContext.jsx';
import { CATEGORIES, CATEGORY_MAP } from '../../constants/categories.js';

export default function EditTransactionModal({ tx, onClose }) {
  const { colors, updateTransaction, deleteTransaction } = useApp();

  const [amount, setAmount] = useState(String(tx.amount || ''));
  const [desc, setDesc] = useState(tx.desc || '');
  const [category, setCategory] = useState(tx.category || 'other');
  const [type, setType] = useState(tx.type || 'debit');
  const [person, setPerson] = useState(tx.person || '');
  const [customDate, setCustomDate] = useState(() => {
    return tx.date ? new Date(tx.date).toISOString().split('T')[0] : '';
  });

  const handleSave = () => {
    const amt = parseFloat(amount);
    if (!amt || isNaN(amt) || amt <= 0) return;

    updateTransaction(tx.id, {
      amount: amt,
      desc: desc.trim() || (CATEGORY_MAP[category]?.label || 'Transaction'),
      category,
      type,
      person: category === 'lent' ? person.trim() : undefined,
      date: customDate ? new Date(customDate).toISOString() : tx.date
    });

    onClose();
  };

  const handleDelete = () => {
    deleteTransaction(tx.id);
    onClose();
  };

  return (
    <BottomSheet title="Edit Transaction" onClose={onClose}>
      {/* Type Toggle */}
      <div className="flex gap-2 p-1 rounded-2xl mb-4 border" style={{ backgroundColor: colors.bg, borderColor: colors.cardBorder }}>
        <button
          onClick={() => setType('debit')}
          className="flex-1 py-2 rounded-xl text-xs font-bold transition-colors"
          style={{
            backgroundColor: type === 'debit' ? colors.expense : 'transparent',
            color: type === 'debit' ? '#FFFFFF' : colors.inkSoft
          }}
        >
          Expense
        </button>
        <button
          onClick={() => setType('credit')}
          className="flex-1 py-2 rounded-xl text-xs font-bold transition-colors"
          style={{
            backgroundColor: type === 'credit' ? colors.income : 'transparent',
            color: type === 'credit' ? '#0A0F1D' : colors.inkSoft
          }}
        >
          Income
        </button>
      </div>

      {/* Amount input */}
      <div className="p-4 rounded-2xl border mb-3" style={{ backgroundColor: colors.bg, borderColor: colors.cardBorder }}>
        <label className="text-xs font-bold block mb-1" style={{ color: colors.inkSoft }}>
          Amount
        </label>
        <div className="flex items-center gap-2 pb-1 border-b" style={{ borderColor: colors.line }}>
          <span className="text-2xl font-bold" style={{ color: type === 'credit' ? colors.income : colors.expense }}>₹</span>
          <input
            type="number"
            inputMode="decimal"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-transparent text-2xl font-extrabold outline-none"
            style={{ color: colors.ink }}
          />
        </div>
      </div>

      {/* Description */}
      <div className="p-3.5 rounded-2xl border mb-3" style={{ backgroundColor: colors.bg, borderColor: colors.cardBorder }}>
        <label className="text-xs font-bold block mb-1" style={{ color: colors.inkSoft }}>
          Description
        </label>
        <input
          type="text"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          className="w-full bg-transparent text-sm font-semibold outline-none"
          style={{ color: colors.ink }}
        />
      </div>

      {/* Categories */}
      <div className="mb-4">
        <label className="text-xs font-bold block mb-2" style={{ color: colors.inkSoft }}>
          Category
        </label>
        <div className="grid grid-cols-4 gap-2 max-h-40 overflow-y-auto p-1">
          {CATEGORIES.map(cat => {
            const Icon = cat.icon;
            const active = category === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className="flex flex-col items-center justify-center p-2 rounded-2xl border text-center active:scale-95 transition-transform"
                style={{
                  backgroundColor: active ? cat.color : colors.bg,
                  borderColor: active ? cat.color : colors.cardBorder,
                  color: active ? '#FFFFFF' : colors.inkSoft
                }}
              >
                <Icon size={16} color={active ? '#FFFFFF' : cat.color} />
                <span className="text-[10px] font-bold mt-1 truncate w-full">
                  {cat.label.split(' ')[0]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Date */}
      <div className="p-3 rounded-2xl border mb-5" style={{ backgroundColor: colors.bg, borderColor: colors.cardBorder }}>
        <label className="text-xs font-bold block mb-1" style={{ color: colors.inkSoft }}>
          Date
        </label>
        <input
          type="date"
          value={customDate}
          onChange={(e) => setCustomDate(e.target.value)}
          className="w-full bg-transparent text-xs font-bold outline-none"
          style={{ color: colors.ink }}
        />
      </div>

      {/* Action buttons */}
      <div className="space-y-2.5">
        <button
          onClick={handleSave}
          className="w-full py-4 rounded-2xl text-sm font-extrabold shadow-lg active:scale-95 transition-transform"
          style={{
            backgroundColor: colors.income,
            color: '#0A0F1D'
          }}
        >
          Update Transaction
        </button>

        <button
          onClick={handleDelete}
          className="w-full py-3 rounded-2xl text-xs font-bold active:scale-95 transition-transform"
          style={{
            backgroundColor: colors.expenseSoft,
            color: colors.expense
          }}
        >
          Delete This Transaction
        </button>
      </div>
    </BottomSheet>
  );
}
