// Rupeeve — Security PIN Unlock Screen
import React, { useState } from 'react';
import { Lock } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';
import appLogo from '../../../logo.png';

export default function PinLockScreen() {
  const { colors, unlockApp, showToast } = useApp();
  const [digits, setDigits] = useState('');
  const [shake, setShake] = useState(false);

  const handleKeyPress = async (k) => {
    if (digits.length >= 4) return;
    const next = digits + k;
    setDigits(next);

    if (next.length === 4) {
      const ok = await unlockApp(next);
      if (!ok) {
        setShake(true);
        setDigits('');
        showToast('⚠️ Incorrect PIN. Try again.');
        setTimeout(() => setShake(false), 500);
      }
    }
  };

  const handleBackspace = () => {
    setDigits(prev => prev.slice(0, -1));
  };

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center px-6 select-none"
      style={{ backgroundColor: colors.bg }}
    >
      <div className="w-full max-w-xs flex flex-col items-center">
        <img
          src={appLogo}
          alt="Rupeeve"
          className="w-16 h-16 rounded-3xl object-cover shadow-2xl mb-3 border-2"
          style={{ borderColor: colors.cardBorder }}
        />
        <h2 className="text-2xl font-extrabold tracking-tight" style={{ color: colors.ink }}>
          Rupeeve
        </h2>
        <p className="text-xs font-semibold mb-8" style={{ color: colors.inkSoft }}>
          Enter your 4-digit security PIN
        </p>

        {/* PIN Dots */}
        <div className={`flex gap-4 mb-10 ${shake ? 'animate-bounce' : ''}`}>
          {[0, 1, 2, 3].map(i => (
            <div
              key={i}
              className="w-4 h-4 rounded-full border transition-all duration-200"
              style={{
                backgroundColor: i < digits.length ? colors.income : 'transparent',
                borderColor: i < digits.length ? colors.income : colors.line
              }}
            />
          ))}
        </div>

        {/* NumPad */}
        <div className="grid grid-cols-3 gap-3 w-full">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '⌫'].map((k, i) => (
            <button
              key={i}
              onClick={() => k === '⌫' ? handleBackspace() : k ? handleKeyPress(k) : null}
              disabled={!k}
              className="h-16 rounded-2xl text-xl font-extrabold flex items-center justify-center border active:scale-90 transition-transform disabled:opacity-0"
              style={{
                backgroundColor: k ? colors.card : 'transparent',
                borderColor: k ? colors.cardBorder : 'transparent',
                color: colors.ink
              }}
            >
              {k}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
