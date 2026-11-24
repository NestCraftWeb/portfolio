// Rupeeve — Central Application Context & Unified State Store
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { THEME } from '../constants/theme.js';
import { Storage, STORAGE_KEYS } from '../services/storage.js';
import { PinService } from '../services/pinService.js';
import { useAIHealer } from '../services/aiHealer.js';
import { parseSmsMessage } from '../services/smsParser.js';
import { registerPlugin } from '@capacitor/core';

const SmsBridge = registerPlugin('SmsBridge');

const AppContext = createContext(null);

const DEFAULT_TRANSACTIONS = [
  { id: 'seed-1', amount: 180, desc: 'Swiggy Food Order', category: 'food', type: 'debit', date: new Date().toISOString() },
  { id: 'seed-2', amount: 3500, desc: 'Semester Fee', category: 'education', type: 'debit', date: new Date(Date.now() - 3600000 * 5).toISOString() },
  { id: 'seed-3', amount: 35000, desc: 'Salary Credit', category: 'other', type: 'credit', date: new Date(Date.now() - 86400000).toISOString() },
  { id: 'seed-4', amount: 500, desc: 'HPCL Petrol Pump', category: 'fuel', type: 'debit', date: new Date(Date.now() - 86400000 * 1.5).toISOString() },
  { id: 'seed-5', amount: 1250, desc: 'Blinkit Groceries', category: 'groceries', type: 'debit', date: new Date(Date.now() - 86400000 * 2).toISOString() },
  { id: 'seed-6', amount: 499, desc: 'Netflix Subscription', category: 'entertainment', type: 'debit', date: new Date(Date.now() - 86400000 * 3).toISOString() }
];

export function AppProvider({ children }) {
  // ── Theme State ───────────────────────────────────────────────────────────
  const [isDark, setIsDark] = useState(() => Storage.get(STORAGE_KEYS.THEME_DARK, true));
  const colors = useMemo(() => isDark ? THEME.dark : THEME.light, [isDark]);

  useEffect(() => {
    Storage.set(STORAGE_KEYS.THEME_DARK, isDark);
    document.body.style.backgroundColor = colors.bg;
  }, [isDark, colors.bg]);

  const toggleTheme = () => setIsDark(prev => !prev);

  // ── Core Transactions ─────────────────────────────────────────────────────
  const [transactions, setTransactions] = useState(() => {
    const saved = Storage.get(STORAGE_KEYS.TRANSACTIONS, null);
    if (saved && Array.isArray(saved) && saved.length > 0) return saved;
    return DEFAULT_TRANSACTIONS;
  });

  const persistTransactions = useCallback((updater) => {
    setTransactions(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      Storage.set(STORAGE_KEYS.TRANSACTIONS, next);
      return next;
    });
  }, []);

  // ── User Balance Custom Overrides ─────────────────────────────────────────
  const [balanceOverride, setBalanceOverride] = useState(() => {
    return Storage.get(STORAGE_KEYS.BALANCE_OVERRIDE, { balance: null, income: null, expenses: null });
  });

  const updateBalanceOverride = useCallback((newOverrides) => {
    setBalanceOverride(newOverrides);
    Storage.set(STORAGE_KEYS.BALANCE_OVERRIDE, newOverrides);
  }, []);

  // ── Monthly Budget ────────────────────────────────────────────────────────
  const [budget, setBudget] = useState(() => {
    return Storage.get(STORAGE_KEYS.BUDGET, { monthly: 25000 });
  });

  const updateBudget = useCallback((newBudget) => {
    setBudget(newBudget);
    Storage.set(STORAGE_KEYS.BUDGET, newBudget);
  }, []);

  // ── Profile ───────────────────────────────────────────────────────────────
  const [profile, setProfile] = useState(() => {
    return Storage.get(STORAGE_KEYS.PROFILE, { name: 'Chand', email: 'chand@rupeeve.app', avatar: '' });
  });

  const updateProfile = useCallback((p) => {
    setProfile(p);
    Storage.set(STORAGE_KEYS.PROFILE, p);
  }, []);

  // ── App UI States ─────────────────────────────────────────────────────────
  const [hideBalance, setHideBalance] = useState(false);
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'history' | 'lending' | 'import'
  const [activeModal, setActiveModal] = useState(null); // 'add' | 'edit' | 'adjustBalance' | 'qrScanner' | etc
  const [modalPayload, setModalPayload] = useState(null);
  const [toast, setToast] = useState('');
  const [smsOnline, setSmsOnline] = useState(null);

  const showToast = useCallback((msg) => {
    setToast(msg);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(''), 2400);
    return () => clearTimeout(t);
  }, [toast]);

  const openModal = useCallback((modalName, payload = null) => {
    setModalPayload(payload);
    setActiveModal(modalName);
  }, []);

  const closeModal = useCallback(() => {
    setActiveModal(null);
    setModalPayload(null);
  }, []);

  // ── PIN Lock State ────────────────────────────────────────────────────────
  const [hasPin, setHasPin] = useState(() => PinService.hasPin());
  const [isLocked, setIsLocked] = useState(() => PinService.hasPin());

  const unlockApp = useCallback(async (pin) => {
    const ok = await PinService.verifyPin(pin);
    if (ok) {
      setIsLocked(false);
      return true;
    }
    return false;
  }, []);

  const lockApp = useCallback(() => {
    if (PinService.hasPin()) setIsLocked(true);
  }, []);

  const configurePin = useCallback(async (newPin) => {
    if (newPin) {
      await PinService.setPin(newPin);
      setHasPin(true);
      showToast('🔒 4-Digit PIN configured');
    } else {
      PinService.removePin();
      setHasPin(false);
      setIsLocked(false);
      showToast('🔓 PIN lock disabled');
    }
  }, [showToast]);

  // ── AI Healer Integration ─────────────────────────────────────────────────
  const aiHealer = useAIHealer(transactions, (healed) => {
    persistTransactions(healed);
  });

  // ── SMS Bridge Integration ────────────────────────────────────────────────
  const pullSms = useCallback(async () => {
    try {
      const { messages } = await SmsBridge.getPendingTransactions();
      if (!messages || messages.length === 0) return;

      const newTxs = [];
      for (const item of messages) {
        const body = typeof item === 'object' ? item.body : item;
        const result = parseSmsMessage(body);
        if (!result.skipped) {
          newTxs.push({
            id: `sms-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
            amount: result.amount,
            desc: result.recipient,
            category: result.category,
            type: result.type,
            date: result.date,
            accountHint: result.accountHint,
            raw: result.raw
          });
        }
      }

      if (newTxs.length > 0) {
        persistTransactions(prev => [...newTxs, ...prev]);
        showToast(`📲 Auto-imported ${newTxs.length} SMS transaction${newTxs.length > 1 ? 's' : ''}`);
        await SmsBridge.clearPendingTransactions();
      }
    } catch (_) {
      // Running in browser or SMS bridge not registered
    }
  }, [persistTransactions, showToast]);

  useEffect(() => {
    async function initSms() {
      try {
        const status = await SmsBridge.checkPermissions();
        if (status.sms !== 'granted') {
          await SmsBridge.requestPermissions({ permissions: ['sms'] });
        }
        setSmsOnline(true);
        pullSms();
      } catch (_) {
        setSmsOnline(false);
      }
    }

    initSms();
    window.addEventListener('focus', pullSms);
    return () => window.removeEventListener('focus', pullSms);
  }, [pullSms]);

  // ── Transaction Actions ───────────────────────────────────────────────────
  const addTransaction = useCallback((tx) => {
    const withId = {
      ...tx,
      id: tx.id || `tx-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      date: tx.date || new Date().toISOString()
    };
    persistTransactions(prev => [withId, ...prev]);
    showToast('✅ Transaction added to ledger');
    return withId;
  }, [persistTransactions, showToast]);

  const addMultipleTransactions = useCallback((list) => {
    const withIds = list.map((t, idx) => ({
      ...t,
      id: t.id || `batch-${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 6)}`,
      date: t.date || new Date().toISOString()
    }));
    persistTransactions(prev => [...withIds, ...prev]);
    showToast(`✅ Added ${withIds.length} transactions`);
  }, [persistTransactions, showToast]);

  const updateTransaction = useCallback((id, updates) => {
    persistTransactions(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
    showToast('✅ Transaction updated');
  }, [persistTransactions, showToast]);

  const deleteTransaction = useCallback((id) => {
    persistTransactions(prev => prev.filter(t => t.id !== id));
    showToast('🗑️ Transaction removed');
  }, [persistTransactions, showToast]);

  const toggleSettled = useCallback((id) => {
    persistTransactions(prev => prev.map(t => {
      if (t.id === id) {
        const next = !t.settled;
        showToast(next ? '🎉 Marked as settled!' : '↩️ Marked as pending');
        return { ...t, settled: next };
      }
      return t;
    }));
  }, [persistTransactions, showToast]);

  const clearAllData = useCallback(() => {
    persistTransactions([]);
    Storage.clearAll();
    closeModal();
    showToast('🧹 All data reset');
  }, [persistTransactions, closeModal, showToast]);

  // ── Calculated Statistics ─────────────────────────────────────────────────
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const currentMonthTxs = useMemo(() => {
    return transactions.filter(t => {
      const d = new Date(t.date);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    });
  }, [transactions, currentMonth, currentYear]);

  const autoIncome = useMemo(() => {
    return currentMonthTxs
      .filter(t => t.type === 'credit')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [currentMonthTxs]);

  const autoExpenses = useMemo(() => {
    return currentMonthTxs
      .filter(t => t.type !== 'credit' && t.category !== 'lent')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [currentMonthTxs]);

  const autoBalance = autoIncome - autoExpenses;

  // Effective display values (using manual override if set, else auto)
  const displayIncome = balanceOverride?.income !== null && balanceOverride?.income !== undefined && balanceOverride?.income !== ''
    ? Number(balanceOverride.income)
    : (autoIncome || 35000);

  const displayExpenses = balanceOverride?.expenses !== null && balanceOverride?.expenses !== undefined && balanceOverride?.expenses !== ''
    ? Number(balanceOverride.expenses)
    : (autoExpenses || 5929);

  const displayBalance = balanceOverride?.balance !== null && balanceOverride?.balance !== undefined && balanceOverride?.balance !== ''
    ? Number(balanceOverride.balance)
    : (autoIncome > 0 || autoExpenses > 0 ? autoBalance : 29071);

  const isCustomized = (balanceOverride?.balance !== null && balanceOverride?.balance !== undefined && balanceOverride?.balance !== '') ||
                       (balanceOverride?.income !== null && balanceOverride?.income !== undefined && balanceOverride?.income !== '') ||
                       (balanceOverride?.expenses !== null && balanceOverride?.expenses !== undefined && balanceOverride?.expenses !== '');

  const budgetLimit = Number(budget.monthly) || 0;
  const budgetPct = budgetLimit > 0 ? Math.min(displayExpenses / budgetLimit, 1) : 0;
  const budgetAlert = budgetLimit > 0 && displayExpenses >= budgetLimit * 0.9;

  const value = {
    isDark,
    toggleTheme,
    colors,
    transactions,
    addTransaction,
    addMultipleTransactions,
    updateTransaction,
    deleteTransaction,
    toggleSettled,
    clearAllData,
    balanceOverride,
    updateBalanceOverride,
    budget,
    updateBudget,
    profile,
    updateProfile,
    hideBalance,
    setHideBalance,
    activeTab,
    setActiveTab,
    activeModal,
    modalPayload,
    openModal,
    closeModal,
    toast,
    showToast,
    hasPin,
    isLocked,
    unlockApp,
    lockApp,
    configurePin,
    smsOnline,
    aiHealer,
    stats: {
      autoIncome,
      autoExpenses,
      autoBalance,
      displayIncome,
      displayExpenses,
      displayBalance,
      isCustomized,
      budgetLimit,
      budgetPct,
      budgetAlert,
      currentMonthTxs
    }
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
}
