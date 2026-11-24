// Rupeeve — Settings & Security Management Modal
import React, { useState } from 'react';
import { Moon, Sun, Lock, Shield, Download, Upload, Trash2, Bell } from 'lucide-react';
import BottomSheet from '../common/BottomSheet.jsx';
import { useApp } from '../../context/AppContext.jsx';
import { exportTransactionsToCsv, exportFullBackup } from '../../services/exportService.js';
import { Storage } from '../../services/storage.js';

export default function SettingsModal({ onClose }) {
  const {
    colors,
    isDark,
    toggleTheme,
    transactions,
    budget,
    updateBudget,
    hasPin,
    lockApp,
    configurePin,
    clearAllData,
    showToast
  } = useApp();

  const [monthlyBudget, setMonthlyBudget] = useState(String(budget?.monthly || ''));
  const [pinInput, setPinInput] = useState('');
  const [showPinConfig, setShowPinConfig] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);

  const handleSaveBudget = () => {
    const val = parseFloat(monthlyBudget);
    if (!isNaN(val) && val >= 0) {
      updateBudget({ monthly: val });
      showToast('✅ Monthly budget updated');
    }
  };

  const handleSetPin = async () => {
    if (pinInput.length === 4 && /^\d{4}$/.test(pinInput)) {
      await configurePin(pinInput);
      setPinInput('');
      setShowPinConfig(false);
    } else {
      showToast('⚠️ PIN must be exactly 4 digits');
    }
  };

  const handleRemovePin = async () => {
    await configurePin(null);
    setShowPinConfig(false);
  };

  const handleRestoreJson = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const ok = Storage.restoreBackup(event.target.result);
        if (ok) {
          showToast('🎉 Data restored successfully! Reloading...');
          setTimeout(() => window.location.reload(), 1000);
        } else {
          showToast('⚠️ Invalid backup file format');
        }
      } catch (_) {
        showToast('⚠️ Could not parse JSON backup');
      }
    };
    reader.readAsText(file);
  };

  return (
    <BottomSheet title="Settings & Security" onClose={onClose}>
      <div className="space-y-4 select-none">
        {/* Dark / Light Mode */}
        <div className="flex items-center justify-between p-4 rounded-2xl border" style={{ backgroundColor: colors.bg, borderColor: colors.cardBorder }}>
          <div className="flex items-center gap-3">
            {isDark ? <Moon size={20} color={colors.income} /> : <Sun size={20} color={colors.gold} />}
            <div>
              <p className="text-sm font-bold" style={{ color: colors.ink }}>Dark OLED Mode</p>
              <p className="text-[11px]" style={{ color: colors.inkSoft }}>{isDark ? 'Enabled for OLED battery saving' : 'Light paper theme'}</p>
            </div>
          </div>
          <button
            onClick={toggleTheme}
            className="w-12 h-6 rounded-full flex items-center px-0.5 transition-colors"
            style={{
              backgroundColor: isDark ? colors.income : colors.line,
              justifyContent: isDark ? 'flex-end' : 'flex-start'
            }}
          >
            <div className="w-5 h-5 rounded-full bg-white shadow-md" />
          </button>
        </div>

        {/* Monthly Budget Setting */}
        <div className="p-4 rounded-2xl border" style={{ backgroundColor: colors.bg, borderColor: colors.cardBorder }}>
          <div className="flex items-center gap-2 mb-2">
            <Bell size={18} color={colors.income} />
            <p className="text-sm font-bold" style={{ color: colors.ink }}>Monthly Budget Target</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 flex items-center gap-1.5 px-3 py-2 rounded-xl border" style={{ backgroundColor: colors.card, borderColor: colors.cardBorder }}>
              <span className="text-sm font-bold" style={{ color: colors.income }}>₹</span>
              <input
                type="number"
                inputMode="numeric"
                value={monthlyBudget}
                onChange={(e) => setMonthlyBudget(e.target.value)}
                placeholder="25000"
                className="w-full bg-transparent text-sm font-bold outline-none"
                style={{ color: colors.ink }}
              />
            </div>
            <button
              onClick={handleSaveBudget}
              className="px-4 py-2 rounded-xl text-xs font-bold active:scale-95 transition-transform"
              style={{ backgroundColor: colors.income, color: '#0A0F1D' }}
            >
              Save
            </button>
          </div>
        </div>

        {/* PIN Lock Management */}
        <div className="p-4 rounded-2xl border" style={{ backgroundColor: colors.bg, borderColor: colors.cardBorder }}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Shield size={18} color={hasPin ? colors.income : colors.inkSoft} />
              <p className="text-sm font-bold" style={{ color: colors.ink }}>
                {hasPin ? 'PIN Lock Enabled' : 'PIN Security'}
              </p>
            </div>
            {hasPin && (
              <button
                onClick={() => { lockApp(); onClose(); }}
                className="px-2.5 py-1 rounded-full text-xs font-bold border active:scale-95 transition-transform"
                style={{ backgroundColor: colors.card, borderColor: colors.cardBorder, color: colors.income }}
              >
                Lock Now
              </button>
            )}
          </div>

          {!showPinConfig ? (
            <button
              onClick={() => setShowPinConfig(true)}
              className="text-xs font-bold underline"
              style={{ color: colors.income }}
            >
              {hasPin ? 'Change or Remove 4-Digit PIN' : 'Set a 4-Digit Security PIN'}
            </button>
          ) : (
            <div className="mt-3 pt-3 border-t space-y-2" style={{ borderColor: colors.line }}>
              <input
                type="password"
                inputMode="numeric"
                maxLength={4}
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value.replace(/\D/g, '').slice(0, 4))}
                placeholder="Enter 4-Digit PIN"
                className="w-full px-3 py-2 rounded-xl border text-sm font-bold outline-none"
                style={{ backgroundColor: colors.card, borderColor: colors.cardBorder, color: colors.ink }}
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSetPin}
                  disabled={pinInput.length !== 4}
                  className="flex-1 py-2 rounded-xl text-xs font-bold disabled:opacity-40"
                  style={{ backgroundColor: colors.income, color: '#0A0F1D' }}
                >
                  Save PIN
                </button>
                {hasPin && (
                  <button
                    onClick={handleRemovePin}
                    className="flex-1 py-2 rounded-xl text-xs font-bold"
                    style={{ backgroundColor: colors.expenseSoft, color: colors.expense }}
                  >
                    Remove PIN
                  </button>
                )}
                <button
                  onClick={() => setShowPinConfig(false)}
                  className="px-3 py-2 rounded-xl text-xs font-bold"
                  style={{ color: colors.inkSoft }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Data Export & Backup */}
        <div className="p-4 rounded-2xl border space-y-2.5" style={{ backgroundColor: colors.bg, borderColor: colors.cardBorder }}>
          <p className="text-sm font-bold" style={{ color: colors.ink }}>Data Backup & Excel Export</p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => { exportTransactionsToCsv(transactions); showToast('📄 CSV Exported'); }}
              className="p-3 rounded-xl border flex items-center justify-center gap-1.5 text-xs font-bold active:scale-95 transition-transform"
              style={{ backgroundColor: colors.card, borderColor: colors.cardBorder, color: colors.ink }}
            >
              <Download size={14} color={colors.income} />
              <span>Export CSV</span>
            </button>
            <button
              onClick={() => { exportFullBackup(); showToast('💾 Backup saved'); }}
              className="p-3 rounded-xl border flex items-center justify-center gap-1.5 text-xs font-bold active:scale-95 transition-transform"
              style={{ backgroundColor: colors.card, borderColor: colors.cardBorder, color: colors.ink }}
            >
              <Download size={14} color={colors.blue} />
              <span>JSON Backup</span>
            </button>
          </div>

          <label
            className="w-full py-2.5 rounded-xl border flex items-center justify-center gap-1.5 text-xs font-bold cursor-pointer active:scale-95 transition-transform"
            style={{ backgroundColor: colors.card, borderColor: colors.cardBorder, color: colors.inkSoft }}
          >
            <Upload size={14} />
            <span>Restore from JSON File</span>
            <input
              type="file"
              accept=".json,application/json"
              onChange={handleRestoreJson}
              className="hidden"
            />
          </label>
        </div>

        {/* Clear Data / Reset */}
        {!confirmClear ? (
          <button
            onClick={() => setConfirmClear(true)}
            className="w-full py-3.5 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform"
            style={{ backgroundColor: colors.expenseSoft, color: colors.expense }}
          >
            <Trash2 size={15} />
            <span>Clear All Data ({transactions.length} transactions)</span>
          </button>
        ) : (
          <div className="p-4 rounded-2xl border border-red-500/50 space-y-3" style={{ backgroundColor: colors.expenseSoft }}>
            <p className="text-xs font-bold text-center text-red-400">
              Are you sure? This deletes all transactions and resets your balances.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setConfirmClear(false)}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold border"
                style={{ backgroundColor: colors.card, borderColor: colors.cardBorder, color: colors.ink }}
              >
                Cancel
              </button>
              <button
                onClick={clearAllData}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-red-600 text-white"
              >
                Yes, Reset All
              </button>
            </div>
          </div>
        )}

        <p className="text-[10px] text-center font-semibold pt-2" style={{ color: colors.inkFaint }}>
          Rupeeve v2.0 · Offline First · 100% Private on Your Device
        </p>
      </div>
    </BottomSheet>
  );
}
