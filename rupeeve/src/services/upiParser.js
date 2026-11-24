// Rupeeve — UPI QR Code & String Parser
import { detectCategory } from '../constants/categories.js';

/**
 * Parses raw text scanned from QR code or user input.
 * Supports:
 * - `upi://pay?pa=...&pn=...&am=...&tn=...` (Standard NPCI UPI QR format)
 * - Raw UPI IDs (e.g. `merchant@okhdfcbank`, `9876543210@paytm`)
 * - BharatQR data or web URL containing UPI parameters
 */
export function parseUpiQr(rawText) {
  if (!rawText || typeof rawText !== 'string') return null;

  const text = rawText.trim();

  // 1. Standard upi://pay URI
  if (/^upi:\/\/pay/i.test(text) || text.includes('pa=')) {
    try {
      let queryString = text;
      if (text.includes('?')) {
        queryString = text.substring(text.indexOf('?') + 1);
      }
      const params = new URLSearchParams(queryString);
      
      const pa = params.get('pa') || '';
      const pn = decodeURIComponent(params.get('pn') || pa.split('@')[0] || 'Merchant').replace(/\+/g, ' ');
      const rawAm = params.get('am');
      const amount = rawAm ? parseFloat(rawAm) : null;
      const tn = decodeURIComponent(params.get('tn') || '').replace(/\+/g, ' ');
      const mc = params.get('mc') || '';
      const cu = params.get('cu') || 'INR';

      if (!pa) return null;

      const category = detectCategory(`${pn} ${tn}`, mc);

      return {
        valid: true,
        pa: pa.trim(),
        pn: pn.trim(),
        amount: amount && !isNaN(amount) && amount > 0 ? amount : null,
        note: tn.trim(),
        mc,
        cu,
        category,
        raw: text
      };
    } catch (e) {
      console.warn('Failed to parse UPI URLSearchParams', e);
    }
  }

  // 2. Direct UPI ID format (e.g. "sharma@icici" or "phone@paytm")
  const upiIdRegex = /\b([a-zA-Z0-9.\-_]{2,50}@[a-zA-Z0-9]{2,30})\b/;
  const match = text.match(upiIdRegex);
  if (match) {
    const pa = match[1];
    const defaultName = pa.split('@')[0].replace(/[._-]/g, ' ');
    const category = detectCategory(defaultName);

    return {
      valid: true,
      pa,
      pn: defaultName,
      amount: null,
      note: 'Direct UPI Payment',
      mc: '',
      cu: 'INR',
      category,
      raw: text
    };
  }

  return {
    valid: false,
    raw: text,
    error: 'Not a valid UPI payment QR code'
  };
}
