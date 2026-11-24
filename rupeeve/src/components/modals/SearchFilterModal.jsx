// Rupeeve — Live Fuzzy Search & Multi-Filter Modal
import React, { useState, useMemo } from 'react';
import { Search, X } from 'lucide-react';
import BottomSheet from '../common/BottomSheet.jsx';
import TransactionRow from '../home/TransactionRow.jsx';
import { useApp } from '../../context/AppContext.jsx';
import { CATEGORIES } from '../../constants/categories.js';

export default function SearchFilterModal({ onClose }) {
  const { colors, transactions, openModal, deleteTransaction } = useApp();

  const [query, setQuery] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all' | 'debit' | 'credit'
  const [selectedCat, setSelectedCat] = useState('all');

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return transactions.filter(t => {
      // Type match
      if (filterType !== 'all' && t.type !== filterType) return false;
      // Category match
      if (selectedCat !== 'all' && t.category !== selectedCat) return false;
      // Query match
      if (q) {
        const descMatch = (t.desc || '').toLowerCase().includes(q);
        const personMatch = (t.person || '').toLowerCase().includes(q);
        const noteMatch = (t.note || '').toLowerCase().includes(q);
        const catMatch = (t.category || '').toLowerCase().includes(q);
        if (!descMatch && !personMatch && !noteMatch && !catMatch) return false;
      }
      return true;
    });
  }, [transactions, query, filterType, selectedCat]);

  return (
    <BottomSheet title="Search & Filter" onClose={onClose}>
      {/* Search Input Bar */}
      <div
        className="flex items-center gap-2 px-3.5 py-3 rounded-2xl border mb-3 shadow-inner"
        style={{ backgroundColor: colors.bg, borderColor: colors.cardBorder }}
      >
        <Search size={18} color={colors.inkSoft} />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search merchant, tag, friend or note…"
          autoFocus
          className="w-full bg-transparent text-sm font-semibold outline-none"
          style={{ color: colors.ink }}
        />
        {query && (
          <button onClick={() => setQuery('')}>
            <X size={16} color={colors.inkFaint} />
          </button>
        )}
      </div>

      {/* Filter Pills */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1" style={{ WebkitOverflowScrolling: 'touch' }}>
        <button
          onClick={() => setFilterType('all')}
          className="px-3 py-1.5 rounded-full text-xs font-bold border flex-shrink-0"
          style={{
            backgroundColor: filterType === 'all' ? colors.income : colors.bg,
            borderColor: filterType === 'all' ? colors.income : colors.cardBorder,
            color: filterType === 'all' ? '#0A0F1D' : colors.inkSoft
          }}
        >
          All
        </button>
        <button
          onClick={() => setFilterType('debit')}
          className="px-3 py-1.5 rounded-full text-xs font-bold border flex-shrink-0"
          style={{
            backgroundColor: filterType === 'debit' ? colors.expense : colors.bg,
            borderColor: filterType === 'debit' ? colors.expense : colors.cardBorder,
            color: filterType === 'debit' ? '#FFFFFF' : colors.inkSoft
          }}
        >
          Expenses
        </button>
        <button
          onClick={() => setFilterType('credit')}
          className="px-3 py-1.5 rounded-full text-xs font-bold border flex-shrink-0"
          style={{
            backgroundColor: filterType === 'credit' ? colors.income : colors.bg,
            borderColor: filterType === 'credit' ? colors.income : colors.cardBorder,
            color: filterType === 'credit' ? '#0A0F1D' : colors.inkSoft
          }}
        >
          Income
        </button>

        {CATEGORIES.slice(0, 10).map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCat(selectedCat === cat.id ? 'all' : cat.id)}
            className="px-3 py-1.5 rounded-full text-xs font-bold border flex-shrink-0"
            style={{
              backgroundColor: selectedCat === cat.id ? cat.color : colors.bg,
              borderColor: selectedCat === cat.id ? cat.color : colors.cardBorder,
              color: selectedCat === cat.id ? '#FFFFFF' : colors.inkSoft
            }}
          >
            {cat.label.split(' ')[0]}
          </button>
        ))}
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs font-bold mb-2 px-1" style={{ color: colors.inkSoft }}>
        <span>Results</span>
        <span>{filtered.length} found</span>
      </div>

      {/* Results List */}
      <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: colors.bg, borderColor: colors.cardBorder }}>
        {filtered.length === 0 ? (
          <p className="text-center text-xs py-8" style={{ color: colors.inkSoft }}>
            No matching transactions found.
          </p>
        ) : (
          filtered.map(tx => (
            <TransactionRow
              key={tx.id}
              tx={tx}
              onEdit={(t) => openModal('edit', t)}
              onDelete={deleteTransaction}
            />
          ))
        )}
      </div>
    </BottomSheet>
  );
}
