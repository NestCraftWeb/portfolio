// Rupeeve — Self-Healing AI Engine 2.0
// Runs autonomous data verification, deduplication, schema repair, and reconciliation.
import { useState, useEffect, useRef } from 'react';
import { CATEGORY_MAP, detectCategory } from '../constants/categories.js';

export function healTransactionList(rawList) {
  if (!Array.isArray(rawList)) return { healed: [], fixesCount: 0, logs: ['Reset empty database'] };

  let list = [...rawList];
  let fixes = 0;
  const logs = [];

  const addLog = (msg) => logs.push(msg);

  // 1. Remove non-objects, zero/negative amounts, invalid dates
  const initialLen = list.length;
  list = list.filter(item => {
    if (!item || typeof item !== 'object') return false;
    const amt = Number(item.amount);
    if (isNaN(amt) || amt <= 0) return false;
    const time = new Date(item.date).getTime();
    if (isNaN(time) || time < 1577836800000) return false; // Must be after year 2020
    return true;
  });
  const removedCount = initialLen - list.length;
  if (removedCount > 0) {
    fixes += removedCount;
    addLog(`Purged ${removedCount} corrupt/invalid transaction(s)`);
  }

  // 2. Validate IDs, Category, Type & normalize
  list = list.map((item, index) => {
    let modified = false;
    const copy = { ...item };

    // ID repair
    if (!copy.id || typeof copy.id !== 'string') {
      copy.id = `tx-${Date.now()}-${index}-${Math.random().toString(36).substring(2, 7)}`;
      modified = true;
    }

    // Type repair
    if (copy.type !== 'credit' && copy.type !== 'debit') {
      copy.type = 'debit';
      modified = true;
    }

    // Description repair
    if (!copy.desc || typeof copy.desc !== 'string' || !copy.desc.trim()) {
      copy.desc = copy.recipient || (copy.type === 'credit' ? 'Income' : 'Expense');
      modified = true;
    }

    // Category repair
    if (!copy.category || !CATEGORY_MAP[copy.category]) {
      copy.category = detectCategory(copy.desc);
      modified = true;
      addLog(`Auto-categorized "${copy.desc}" into ${CATEGORY_MAP[copy.category]?.label || 'General'}`);
    }

    // Ensure amount is pure number
    copy.amount = Math.round(Number(copy.amount) * 100) / 100;

    if (modified) fixes++;
    return copy;
  });

  // 3. Smart Deduplication & UPI/SMS Reconciliation (within 120s window)
  const deduped = [];
  const signatureMap = new Map();

  for (const tx of list) {
    const timestampSlot = Math.floor(new Date(tx.date).getTime() / 120000); // 2-minute bucket
    const cleanDesc = (tx.desc || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    const sig = `${tx.type}_${Math.round(tx.amount)}_${cleanDesc.substring(0, 8)}_${timestampSlot}`;

    if (signatureMap.has(sig)) {
      fixes++;
      addLog(`Reconciled duplicate entry: ₹${tx.amount} to "${tx.desc}"`);
      // If one of them has account hint or upi details, merge them
      const existing = signatureMap.get(sig);
      if (!existing.accountHint && tx.accountHint) existing.accountHint = tx.accountHint;
      if (!existing.upiVpa && tx.upiVpa) existing.upiVpa = tx.upiVpa;
    } else {
      signatureMap.set(sig, tx);
      deduped.push(tx);
    }
  }

  // 4. Sort descending by date
  deduped.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return {
    healed: deduped,
    fixesCount: fixes,
    logs
  };
}

/**
 * Hook to run AI Healer on startup and after imports
 */
export function useAIHealer(transactions, onPersistHealed) {
  const [status, setStatus] = useState('healthy'); // 'healthy' | 'healing'
  const [healLogs, setHealLogs] = useState([]);
  const [healCount, setHealCount] = useState(0);
  const isInitialRun = useRef(true);

  const runHealer = (list) => {
    setStatus('healing');
    const { healed, fixesCount, logs } = healTransactionList(list);

    const now = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    const formattedLogs = logs.map(l => ({ msg: l, time: now }));

    if (fixesCount > 0) {
      setHealCount(prev => prev + fixesCount);
      setHealLogs(prev => [...formattedLogs, ...prev].slice(0, 30));
      if (onPersistHealed) onPersistHealed(healed);
    } else if (formattedLogs.length === 0 && healLogs.length === 0) {
      setHealLogs([{ msg: 'System healthy. All transaction schemas verified.', time: now }]);
    }

    setStatus('healthy');
  };

  useEffect(() => {
    if (isInitialRun.current && transactions && transactions.length > 0) {
      isInitialRun.current = false;
      const timer = setTimeout(() => {
        runHealer(transactions);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [transactions]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    status,
    healLogs,
    healCount,
    reHeal: () => runHealer(transactions)
  };
}
