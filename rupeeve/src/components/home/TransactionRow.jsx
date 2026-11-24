// Rupeeve — Individual Transaction Row Component
import React, { useState } from 'react';
import { Trash2, Edit3, CheckCircle2, Undo2 } from 'lucide-react';
import { CATEGORY_MAP } from '../../constants/categories.js';
import { formatRupees } from './BalanceHeroCard.jsx';
import { useApp } from '../../context/AppContext.jsx';

function formatTxTime(iso) {
  const d = new Date(iso);
  const now = new Date();
  if (d.toDateString() === now.toDateString()) {
    return 'Today, ' + d.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' });
  }
  const y = new Date(now);
  y.setDate(now.getDate() - 1);
  if (d.toDateString() === y.toDateString()) {
    return 'Yesterday, ' + d.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' });
  }
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

export default function TransactionRow({ tx, onEdit, onDelete, showDateHeader = false }) {
  const { colors, toggleSettled } = useApp();
  const [expanded, setExpanded] = useState(false);

  const category = CATEGORY_MAP[tx.category] || CATEGORY_MAP.other;
  const Icon = category.icon;
  const isCredit = tx.type === 'credit';
  const isLent = tx.category === 'lent';

  const title = isLent ? `Udhar → ${tx.person || tx.desc || 'Someone'}` : (tx.desc || category.label);
  const amountColor = isCredit ? colors.income : (isLent ? colors.purple : colors.ink);

  return (
    <div
      className="border-b last:border-b-0 select-none transition-colors"
      style={{ borderColor: colors.line }}
    >
      <button
        onClick={() => setExpanded(prev => !prev)}
        className="w-full flex items-center gap-3 py-3 px-3 text-left active:opacity-75 transition-opacity"
      >
        {/* Category Icon */}
        <div
          className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${category.color}22` }}
        >
          <Icon size={18} color={category.color} />
        </div>

        {/* Title & subtitle */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold truncate leading-tight" style={{ color: colors.ink }}>
            {title}
          </p>
          <p className="text-[11px] font-medium leading-normal mt-0.5" style={{ color: colors.inkFaint }}>
            {formatTxTime(tx.date)}
            {tx.accountHint && ` · ${tx.accountHint}`}
            {tx.upiVpa && ` · ${tx.upiVpa}`}
          </p>
        </div>

        {/* Amount */}
        <div className="text-right flex-shrink-0">
          <p className="text-sm font-extrabold leading-tight" style={{ color: amountColor }}>
            {isCredit ? '+' : '-'}{formatRupees(tx.amount)}
          </p>
          {isLent && (
            <span
              className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded-full inline-block mt-0.5"
              style={{
                backgroundColor: tx.settled ? colors.incomeSoft : colors.purpleSoft,
                color: tx.settled ? colors.income : colors.purple
              }}
            >
              {tx.settled ? 'Settled' : 'Pending'}
            </span>
          )}
        </div>
      </button>

      {/* Expanded Actions bar */}
      {expanded && (
        <div
          className="flex items-center justify-end gap-2 pb-3 px-3 pt-1"
          style={{ animation: 'fadeIn 0.15s ease-out' }}
        >
          {isLent && (
            <button
              onClick={() => toggleSettled(tx.id)}
              className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border active:scale-95 transition-transform"
              style={{
                backgroundColor: tx.settled ? colors.incomeSoft : colors.purpleSoft,
                borderColor: tx.settled ? colors.income : colors.purple,
                color: tx.settled ? colors.income : colors.purple
              }}
            >
              {tx.settled ? <Undo2 size={13} /> : <CheckCircle2 size={13} />}
              <span>{tx.settled ? 'Mark Pending' : 'Mark Paid Back'}</span>
            </button>
          )}

          {onEdit && (
            <button
              onClick={() => onEdit(tx)}
              className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full border active:scale-95 transition-transform"
              style={{
                backgroundColor: colors.bg,
                borderColor: colors.cardBorder,
                color: colors.income
              }}
            >
              <Edit3 size={13} />
              <span>Edit</span>
            </button>
          )}

          {onDelete && (
            <button
              onClick={() => onDelete(tx.id)}
              className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full active:scale-95 transition-transform"
              style={{
                backgroundColor: colors.expenseSoft,
                color: colors.expense
              }}
            >
              <Trash2 size={13} />
              <span>Remove</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
