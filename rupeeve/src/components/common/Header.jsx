// Rupeeve — Top Header Bar
import React from 'react';
import { Search, Settings, Wifi, Bell, QrCode } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';
import appLogo from '../../../logo.png';

export default function Header() {
  const { colors, activeTab, smsOnline, stats, openModal } = useApp();

  let title = 'Rupeeve';
  let subtitle = 'Smart Expense & UPI Khata';

  if (activeTab === 'history') {
    title = 'History & Ledger';
    subtitle = 'Daily Timeline & Burn-rate';
  } else if (activeTab === 'lending') {
    title = 'Udhar Khata';
    subtitle = 'Track Lent & Borrowed Funds';
  } else if (activeTab === 'import') {
    title = 'SMS Auto-Sync';
    subtitle = 'Bank Messages & Clipboard';
  }

  return (
    <header
      className="flex items-center justify-between px-4 pt-10 pb-3 flex-shrink-0 border-b select-none"
      style={{ backgroundColor: colors.bg, borderColor: colors.cardBorder }}
    >
      <div className="flex items-center gap-2.5">
        <img
          src={appLogo}
          alt="Rupeeve Logo"
          className="w-9 h-9 rounded-xl object-cover shadow-sm border"
          style={{ borderColor: colors.cardBorder }}
        />
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold tracking-tight" style={{ color: colors.ink }}>
              {title}
            </h1>
            {smsOnline === true && (
              <span title="SMS background sync online" style={{ color: colors.income }}>
                <Wifi size={13} />
              </span>
            )}
            {stats.budgetAlert && (
              <span title="Monthly budget limit alert" style={{ color: colors.expense }}>
                <Bell size={13} className="animate-bounce" />
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-[11px] font-medium leading-none mt-0.5" style={{ color: colors.inkSoft }}>
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        {/* QR Scanner Shortcut in Header */}
        <button
          onClick={() => openModal('qrScanner')}
          className="w-9 h-9 rounded-xl flex items-center justify-center border active:scale-95 transition-transform"
          style={{ backgroundColor: colors.card, borderColor: colors.cardBorder, color: colors.income }}
          title="Scan any UPI QR Code"
        >
          <QrCode size={18} />
        </button>

        {/* Search */}
        <button
          onClick={() => openModal('search')}
          className="w-9 h-9 rounded-xl flex items-center justify-center border active:scale-95 transition-transform"
          style={{ backgroundColor: colors.card, borderColor: colors.cardBorder, color: colors.inkSoft }}
          title="Search transactions"
        >
          <Search size={18} />
        </button>

        {/* Settings */}
        <button
          onClick={() => openModal('settings')}
          className="w-9 h-9 rounded-xl flex items-center justify-center border active:scale-95 transition-transform"
          style={{ backgroundColor: colors.card, borderColor: colors.cardBorder, color: colors.inkSoft }}
          title="Settings & security"
        >
          <Settings size={18} />
        </button>
      </div>
    </header>
  );
}
