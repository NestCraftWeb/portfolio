// Rupeeve — Mobile Bottom Navigation with Floating QR / Add Action
import React from 'react';
import { Home, Calendar, Users, ClipboardPaste, QrCode } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';

export default function BottomNav() {
  const { colors, activeTab, setActiveTab, openModal } = useApp();

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40 max-w-md mx-auto border-t"
      style={{
        backgroundColor: colors.card,
        borderColor: colors.cardBorder,
        paddingBottom: 'env(safe-area-inset-bottom, 0px)'
      }}
    >
      <div className="grid grid-cols-5 items-end h-16 select-none">
        {/* Home */}
        <NavButton
          label="Home"
          icon={Home}
          active={activeTab === 'home'}
          onClick={() => setActiveTab('home')}
          colors={colors}
        />

        {/* History */}
        <NavButton
          label="History"
          icon={Calendar}
          active={activeTab === 'history'}
          onClick={() => setActiveTab('history')}
          colors={colors}
        />

        {/* Center UPI QR Scan Floating Button */}
        <div className="flex flex-col items-center justify-center pb-2">
          <button
            onClick={() => openModal('qrScanner')}
            aria-label="Scan UPI QR Code"
            className="w-14 h-14 rounded-full flex flex-col items-center justify-center shadow-xl active:scale-90 transition-transform -mt-6 border-2"
            style={{
              backgroundColor: colors.income,
              borderColor: colors.card,
              color: '#0A0F1D'
            }}
          >
            <QrCode size={24} strokeWidth={2.5} />
            <span className="text-[9px] font-black tracking-tighter uppercase leading-none mt-0.5">SCAN</span>
          </button>
        </div>

        {/* Lending */}
        <NavButton
          label="Udhar"
          icon={Users}
          active={activeTab === 'lending'}
          onClick={() => setActiveTab('lending')}
          colors={colors}
        />

        {/* Sync */}
        <NavButton
          label="Sync"
          icon={ClipboardPaste}
          active={activeTab === 'import'}
          onClick={() => setActiveTab('import')}
          colors={colors}
        />
      </div>
    </div>
  );
}

function NavButton({ label, icon: Icon, active, onClick, colors }) {
  return (
    <button
      onClick={onClick}
      className="w-full h-full flex flex-col items-center justify-center gap-1 pb-1 active:opacity-75 transition-opacity"
    >
      <Icon
        size={20}
        color={active ? colors.income : colors.inkFaint}
        strokeWidth={active ? 2.5 : 2}
      />
      <span
        className="text-[10px] font-bold leading-none tracking-tight"
        style={{ color: active ? colors.ink : colors.inkFaint }}
      >
        {label}
      </span>
    </button>
  );
}
