// PaisaKhata — Self-Healing AI Engine
// Validates, repairs, and deduplicates transaction data on load.
import { useState, useEffect, useRef } from 'react';
import { CATEGORY_MAP } from './categories.js';

/**
 * Self-healing AI hook. Runs once on mount to repair the transaction store.
 * Returns health status and diagnostic log for the UI.
 */
export function useAIHealer(transactions, persist) {
  const [status, setStatus] = useState('booting'); // 'booting' | 'healthy' | 'healing' | 'error'
  const [log, setLog] = useState([]);
  const [healCount, setHealCount] = useState(0);
  const hasRun = useRef(false);

  function addLog(msg) {
    setLog(prev => [
      { msg, time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) },
      ...prev.slice(0, 49),
    ]);
  }

  useEffect(() => {
    // Only run once, skip if no transactions yet
    if (hasRun.current) return;
    hasRun.current = true;

    // Small delay so the app renders first
    const timer = setTimeout(() => {
      runHealer(transactions);
    }, 800);

    return () => clearTimeout(timer);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function runHealer(txList) {
    setStatus('healing');
    addLog('🤖 AI Healer starting check...');

    let healed = [...(txList || [])];
    let fixes = 0;

    // ── 1. Remove entries with no amount or invalid date ──────────────────
    const beforeFilter = healed.length;
    healed = healed.filter(t => {
      if (!t) return false;
      if (!t.amount || t.amount <= 0) return false;
      if (!t.date || isNaN(new Date(t.date).getTime())) return false;
      return true;
    });
    const removedInvalid = beforeFilter - healed.length;
    if (removedInvalid > 0) {
      fixes += removedInvalid;
      addLog(`🗑️ Removed ${removedInvalid} corrupt / invalid entries`);
    }

    // ── 2. Generate IDs for entries that don't have them ──────────────────
    healed = healed.map((t, i) => {
      if (!t.id) {
        fixes++;
        return { ...t, id: `ai-${Date.now()}-${i}-${Math.random().toString(36).slice(2, 7)}` };
      }
      return t;
    });

    // ── 3. Fix unknown / missing categories ───────────────────────────────
    healed = healed.map(t => {
      if (!t.category || !CATEGORY_MAP[t.category]) {
        fixes++;
        addLog(`🔧 Fixed category for "${t.desc || 'entry'}"`);
        return { ...t, category: 'other' };
      }
      return t;
    });

    // ── 4. Fix missing type field ─────────────────────────────────────────
    healed = healed.map(t => {
      if (!t.type) {
        fixes++;
        return { ...t, type: 'debit' };
      }
      return t;
    });

    // ── 5. Deduplicate (same amount + desc within 90 seconds) ─────────────
    const seen = new Map();
    const deduped = [];
    for (const t of healed) {
      const timeSlot = Math.floor(new Date(t.date).getTime() / 90000);
      const key = `${Math.round(t.amount)}-${(t.desc || '').toLowerCase().trim()}-${timeSlot}`;
      if (!seen.has(key)) {
        seen.set(key, true);
        deduped.push(t);
      } else {
        fixes++;
        addLog(`♻️ Removed duplicate: "${t.desc || 'entry'}" ₹${t.amount}`);
      }
    }
    healed = deduped;

    // ── 6. Sort by date descending ────────────────────────────────────────
    healed.sort((a, b) => new Date(b.date) - new Date(a.date));

    if (fixes > 0) {
      persist(healed);
      addLog(`✅ Healed ${fixes} issue(s). Data saved.`);
      setHealCount(fixes);
    } else {
      addLog('✅ All data is healthy — nothing to fix!');
    }

    setStatus('healthy');
  }

  /**
   * Re-run healer on demand (e.g. after a large import)
   */
  function reHeal(txList) {
    hasRun.current = false;
    runHealer(txList);
  }

  return { status, log, healCount, reHeal };
}
