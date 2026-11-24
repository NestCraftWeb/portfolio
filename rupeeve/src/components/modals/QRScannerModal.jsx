// Rupeeve — QR Code Scanner, UPI Redirect & Instant Ledger Auto-Recorder
import React, { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { QrCode, Upload, ArrowUpRight, Check, AlertCircle, RefreshCw } from 'lucide-react';
import BottomSheet from '../common/BottomSheet.jsx';
import { useApp } from '../../context/AppContext.jsx';
import { parseUpiQr } from '../../services/upiParser.js';
import { PAYMENT_APPS, launchPaymentApp } from '../../constants/paymentApps.js';
import { CATEGORIES, CATEGORY_MAP } from '../../constants/categories.js';

export default function QRScannerModal({ onClose }) {
  const { colors, addTransaction, showToast } = useApp();

  const [scanStep, setScanStep] = useState('scanning'); // 'scanning' | 'confirm' | 'error'
  const [parsedUpi, setParsedUpi] = useState(null);
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [category, setCategory] = useState('food');
  const [autoRecord, setAutoRecord] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const html5QrCodeRef = useRef(null);
  const scannerContainerId = 'rupeeve-qr-reader';

  // Start live camera QR scanner on mount
  useEffect(() => {
    let isMounted = true;

    async function startScanner() {
      try {
        const qr = new Html5Qrcode(scannerContainerId);
        html5QrCodeRef.current = qr;

        await qr.start(
          { facingMode: 'environment' },
          {
            fps: 15,
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1.0
          },
          (decodedText) => {
            if (!isMounted) return;
            handleQrCodeScanned(decodedText);
          },
          () => {
            // Ignore scan parse frame drops
          }
        );
      } catch (err) {
        console.warn('Camera scan init warning:', err);
        if (isMounted) {
          // If camera permission blocked or no camera, stay in scanning mode with file upload option
        }
      }
    }

    const timer = setTimeout(startScanner, 200);

    return () => {
      isMounted = false;
      clearTimeout(timer);
      if (html5QrCodeRef.current) {
        try {
          html5QrCodeRef.current.stop().then(() => {
            html5QrCodeRef.current.clear();
          }).catch(() => {});
        } catch (_) {}
      }
    };
  }, []);

  const stopCameraSafe = async () => {
    if (html5QrCodeRef.current) {
      try {
        await html5QrCodeRef.current.stop();
        html5QrCodeRef.current.clear();
      } catch (_) {}
    }
  };

  const handleQrCodeScanned = async (text) => {
    await stopCameraSafe();
    const result = parseUpiQr(text);

    if (result && result.valid) {
      setParsedUpi(result);
      setAmount(result.amount ? String(result.amount) : '');
      setNote(result.note || result.pn || '');
      setCategory(result.category || 'other');
      setScanStep('confirm');
    } else {
      setErrorMessage(result?.error || 'Unrecognized QR code. Please scan a valid UPI QR.');
      setScanStep('error');
    }
  };

  // Image file picker scanner fallback (e.g. from gallery or WhatsApp screenshot)
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      await stopCameraSafe();
      const qr = new Html5Qrcode(scannerContainerId);
      html5QrCodeRef.current = qr;
      const decodedText = await qr.scanFile(file, true);
      handleQrCodeScanned(decodedText);
    } catch (err) {
      setErrorMessage('Could not find a valid UPI QR code in that image. Try another screenshot.');
      setScanStep('error');
    }
  };

  // Pay and record transaction
  const handlePay = (appId) => {
    const payAmt = parseFloat(amount);
    if (!payAmt || isNaN(payAmt) || payAmt <= 0) {
      showToast('⚠️ Please enter a valid payment amount');
      return;
    }

    if (!parsedUpi || !parsedUpi.pa) {
      showToast('⚠️ Missing UPI Payee Address');
      return;
    }

    // 1. Auto-record transaction in Rupeeve ledger
    if (autoRecord) {
      addTransaction({
        amount: payAmt,
        desc: parsedUpi.pn || 'UPI Payment',
        category: category,
        type: 'debit',
        note: note,
        upiVpa: parsedUpi.pa,
        date: new Date().toISOString()
      });
    }

    // 2. Launch the selected payment app via deep-link
    launchPaymentApp(appId, {
      pa: parsedUpi.pa,
      pn: parsedUpi.pn,
      am: payAmt,
      tn: note || 'Rupeeve UPI Payment',
      cu: parsedUpi.cu || 'INR'
    });

    showToast(`🚀 Launching ${appId.toUpperCase()} & Recorded in Ledger!`);
    onClose();
  };

  return (
    <BottomSheet title="Scan & Pay UPI QR" onClose={onClose}>
      {/* ── STEP 1: CAMERA SCANNER ── */}
      {scanStep === 'scanning' && (
        <div className="flex flex-col items-center select-none">
          <p className="text-xs text-center mb-3" style={{ color: colors.inkSoft }}>
            Point your camera at any Bharat / UPI QR code (GPay, PhonePe, Paytm, Shop QR)
          </p>

          {/* QR Camera Preview Window */}
          <div
            className="w-full max-w-[280px] h-[280px] rounded-3xl overflow-hidden border-2 relative flex items-center justify-center shadow-2xl"
            style={{
              backgroundColor: '#000000',
              borderColor: colors.income
            }}
          >
            <div id={scannerContainerId} className="w-full h-full" />
            <div
              className="absolute inset-0 pointer-events-none border-4 border-dashed rounded-3xl opacity-40"
              style={{ borderColor: colors.income }}
            />
          </div>

          {/* Gallery Image Upload Fallback */}
          <div className="mt-5 w-full">
            <label
              className="w-full py-3.5 px-4 rounded-2xl border flex items-center justify-center gap-2 text-xs font-bold cursor-pointer active:scale-95 transition-transform shadow-sm"
              style={{
                backgroundColor: colors.card,
                borderColor: colors.cardBorder,
                color: colors.ink
              }}
            >
              <Upload size={16} color={colors.income} />
              <span>Upload QR Screenshot from Gallery</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>
      )}

      {/* ── STEP 2: CONFIRMATION & PAYMENT LAUNCHER ── */}
      {scanStep === 'confirm' && parsedUpi && (
        <div className="space-y-4 select-none">
          {/* Payee Info Card */}
          <div
            className="p-4 rounded-3xl border shadow-lg relative overflow-hidden"
            style={{
              backgroundColor: colors.card,
              borderColor: colors.cardBorder
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: colors.incomeSoft }}
              >
                <QrCode size={22} color={colors.income} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-base font-extrabold truncate" style={{ color: colors.ink }}>
                  {parsedUpi.pn}
                </p>
                <p className="text-xs font-semibold truncate" style={{ color: colors.inkSoft }}>
                  {parsedUpi.pa}
                </p>
              </div>
            </div>
          </div>

          {/* Amount Input */}
          <div
            className="p-4 rounded-2xl border"
            style={{ backgroundColor: colors.card, borderColor: colors.cardBorder }}
          >
            <label className="text-xs font-bold block mb-1.5" style={{ color: colors.inkSoft }}>
              Amount to Pay (INR)
            </label>
            <div className="flex items-center gap-2 pb-1 border-b" style={{ borderColor: colors.line }}>
              <span className="text-2xl font-bold" style={{ color: colors.income }}>₹</span>
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

          {/* Category Selector */}
          <div>
            <label className="text-xs font-bold block mb-2" style={{ color: colors.inkSoft }}>
              Category
            </label>
            <div className="flex gap-2 overflow-x-auto pb-1" style={{ WebkitOverflowScrolling: 'touch' }}>
              {CATEGORIES.map(cat => {
                const Icon = cat.icon;
                const active = category === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setCategory(cat.id)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl border flex-shrink-0 text-xs font-bold active:scale-95 transition-transform"
                    style={{
                      backgroundColor: active ? cat.color : colors.card,
                      borderColor: active ? cat.color : colors.cardBorder,
                      color: active ? '#FFFFFF' : colors.inkSoft
                    }}
                  >
                    <Icon size={14} color={active ? '#FFFFFF' : cat.color} />
                    <span>{cat.label.split(' ')[0]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Auto-record checkbox */}
          <label className="flex items-center gap-2.5 cursor-pointer py-1">
            <input
              type="checkbox"
              checked={autoRecord}
              onChange={(e) => setAutoRecord(e.target.checked)}
              className="w-4 h-4 rounded accent-emerald-500"
            />
            <span className="text-xs font-semibold" style={{ color: colors.ink }}>
              Automatically log this transaction in Rupeeve
            </span>
          </label>

          {/* Payment App Selection Buttons */}
          <div className="pt-2">
            <p className="text-xs font-bold mb-2.5" style={{ color: colors.inkSoft }}>
              Select Payment App to Pay:
            </p>
            <div className="grid grid-cols-2 gap-2.5">
              {PAYMENT_APPS.map(app => (
                <button
                  key={app.id}
                  onClick={() => handlePay(app.id)}
                  className="py-3 px-3 rounded-2xl border flex items-center justify-between shadow-sm active:scale-95 transition-transform"
                  style={{
                    backgroundColor: colors.card,
                    borderColor: colors.cardBorder
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{app.icon}</span>
                    <span className="text-xs font-bold" style={{ color: colors.ink }}>
                      {app.label}
                    </span>
                  </div>
                  <ArrowUpRight size={14} color={colors.income} />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── STEP 3: SCAN ERROR / RETRY ── */}
      {scanStep === 'error' && (
        <div className="text-center py-6 select-none space-y-4">
          <div
            className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center"
            style={{ backgroundColor: colors.expenseSoft }}
          >
            <AlertCircle size={28} color={colors.expense} />
          </div>
          <div>
            <h4 className="text-sm font-bold" style={{ color: colors.ink }}>
              Scan Unsuccessful
            </h4>
            <p className="text-xs mt-1 px-4" style={{ color: colors.inkSoft }}>
              {errorMessage}
            </p>
          </div>
          <button
            onClick={() => setScanStep('scanning')}
            className="px-6 py-3 rounded-2xl text-xs font-bold flex items-center gap-2 mx-auto active:scale-95 transition-transform"
            style={{ backgroundColor: colors.income, color: '#0A0F1D' }}
          >
            <RefreshCw size={14} />
            <span>Try Scanning Again</span>
          </button>
        </div>
      )}
    </BottomSheet>
  );
}
