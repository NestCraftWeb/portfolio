// Rupeeve — Add Transaction Modal (Expense, Income, Udhar)
import React, { useState } from 'react';
import BottomSheet from '../common/BottomSheet.jsx';
import { useApp } from '../../context/AppContext.jsx';
import { CATEGORIES, CATEGORY_MAP, detectCategory } from '../../constants/categories.js';

export default function AddTransactionModal({ onClose, initialType = 'debit' }) {
  const { colors, addTransaction } = useApp();

  const [type, setType] = useState(initialType); // 'debit' | 'credit'
  const [amount, setAmount] = useState('');
  const [desc, setDesc] = useState('');
  const [category, setCategory] = useState(initialType === 'credit' ? 'other' : 'food');
  const [person, setPerson] = useState('');
  const [customDate, setCustomDate] = useState(() => new Date().toISOString().split('T')[0]);

  const handleDescChange = (val) => {
    setDesc(val);
    if (type !== 'credit') {
      const detected = detectCategory(val);
      if (detected && detected !== 'other') {
        setCategory(detected);
      }
    }
  };

  const handleSave = () => {
    const amt = parseFloat(amount);
    if (!amt || isNaN(amt) || amt <= 0) return;

    const catToSave = category;
    const isLent = catToSave === 'lent';

    addTransaction({
      amount: amt,
      desc: desc.trim() || (CATEGORY_MAP[catToSave]?.label || 'Transaction'),
      category: catToSave,
      type: isLent ? 'debit' : type,
      person: isLent ? person.trim() || desc.trim() : undefined,
      settled: isLent ? false : undefined,
      date: customDate ? new Date(customDate).toISOString() : new Date().toISOString()
    });

    onClose();
  };

  return (
    <BottomSheet title="New Transaction" onClose={onClose}>
      {/* Type Segment Controller */}
      <div className="flex gap-2 p-1 rounded-2xl mb-4 border" style={{ backgroundColor: colors.bg, borderColor: colors.cardBorder }}>
        <button
          onClick={() => { setType('debit'); if (category === 'other') setCategory('food'); }}
          className="flex-1 py-2 rounded-xl text-xs font-bold transition-colors"
          style={{
            backgroundColor: type === 'debit' ? colors.expense : 'transparent',
            color: type === 'debit' ? '#FFFFFF' : colors.inkSoft
          }}
        >
          Expense
        </button>
        <button
          onClick={() => { setType('credit'); setCategory('other'); }}
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
            placeholder="0"
            autoFocus
            className="w-full bg-transparent text-2xl font-extrabold outline-none"
            style={{ color: colors.ink }}
          />
        </div>
      </div>

      {/* Description */}
      <div className="p-3.5 rounded-2xl border mb-3" style={{ backgroundColor: colors.bg, borderColor: colors.cardBorder }}>
        <label className="text-xs font-bold block mb-1" style={{ color: colors.inkSoft }}>
          Description / Merchant
        </label>
        <input
          type="text"
          value={desc}
          onChange={(e) => handleDescChange(e.target.value)}
          placeholder="e.g. Swiggy, Petrol, Freelance, Gym"
          className="w-full bg-transparent text-sm font-semibold outline-none"
          style={{ color: colors.ink }}
        />
      </div>

      {/* If category is 'lent' -> Person Name */}
      {category === 'lent' && (
        <div className="p-3.5 rounded-2xl border mb-3" style={{ backgroundColor: colors.purpleSoft, borderColor: colors.purple }}>
          <label className="text-xs font-bold block mb-1" style={{ color: colors.purple }}>
            Friend / Family Name (Udhar)
          </label>
          <input
            type="text"
            value={person}
            onChange={(e) => setPerson(e.target.value)}
            placeholder="e.g. Rahul, Suresh"
            className="w-full bg-transparent text-sm font-bold outline-none"
            style={{ color: colors.ink }}
          />
        </div>
      )}

      {/* Categories Grid */}
      <div className="mb-4">
        <label className="text-xs font-bold block mb-2" style={{ color: colors.inkSoft }}>
          Category
        </label>
        <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto p-1">
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

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={!amount || parseFloat(amount) <= 0}
        className="w-full py-4 rounded-2xl text-sm font-extrabold shadow-lg active:scale-95 transition-transform disabled:opacity-40"
        style={{
          backgroundColor: type === 'credit' ? colors.income : colors.expense,
          color: type === 'credit' ? '#0A0F1D' : '#FFFFFF'
        }}
      >
        Save Transaction
      </button>
    </BottomSheet>
  );
}
