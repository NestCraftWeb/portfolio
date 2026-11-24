// Rupeeve — Indian Bank & UPI SMS Parser
// Tested with HDFC, SBI, ICICI, Axis, Kotak, PNB, BoB, Canara, IDFC, Slice, Jupiter, Fi, CRED, etc.
import { detectCategory } from '../constants/categories.js';

const MONTH_MAP = {
  jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
  jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11
};

/**
 * Extract transaction date from SMS text, fallback to current time
 */
export function extractDateFromSms(text) {
  if (!text) return new Date().toISOString();

  const patterns = [
    // 24-Oct-2026, 24Oct26, 24/Oct/2026
    /(\d{1,2})[-\/\s]*(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*[-\/\s]*(\d{2,4})/i,
    // 24/10/2026, 24-10-26
    /\b(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})\b/,
    // 2026-10-24
    /\b(\d{4})-(\d{2})-(\d{2})\b/,
    // 24 Oct 2026
    /(\d{1,2})\s+(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+(\d{2,4})/i
  ];

  for (const re of patterns) {
    const m = text.match(re);
    if (!m) continue;
    try {
      let day, month, year;
      if (re.source.includes('jan|feb')) {
        day = parseInt(m[1], 10);
        const monStr = m[2].toLowerCase().slice(0, 3);
        month = MONTH_MAP[monStr];
        year = parseInt(m[3], 10);
      } else if (m[1].length === 4) {
        year = parseInt(m[1], 10);
        month = parseInt(m[2], 10) - 1;
        day = parseInt(m[3], 10);
      } else {
        day = parseInt(m[1], 10);
        month = parseInt(m[2], 10) - 1;
        year = parseInt(m[3], 10);
        if (month > 11) continue;
      }

      if (year !== undefined && year < 100) year += 2000;
      const d = new Date(year, month, day);
      if (!isNaN(d.getTime()) && d.getFullYear() >= 2020 && d <= new Date(Date.now() + 86400000)) {
        return d.toISOString();
      }
    } catch (_) {}
  }

  return new Date().toISOString();
}

/**
 * Cleans raw merchant / payee string
 */
function cleanMerchant(str) {
  if (!str) return '';
  return str
    .replace(/^(to|at|from|towards|by|vpa|info|ref)\s+/i, '')
    .replace(/\s+(on|via|using|ref|txn|dated|avl|bal|a\/c|ending).*$/i, '')
    .replace(/[.,*#-]+$/, '')
    .trim();
}

/**
 * Main single-message parser
 */
export function parseSmsMessage(rawMessage) {
  if (!rawMessage || typeof rawMessage !== 'string') {
    return { skipped: true, reason: 'Empty message' };
  }

  const raw = rawMessage.trim();
  const lower = raw.toLowerCase();

  // 1. Skip non-transactional messages (OTPs, offers, verification)
  const isOtp = lower.includes('otp') ||
                lower.includes('one time password') ||
                lower.includes('verification code') ||
                lower.includes('do not share') ||
                (lower.includes('offer') && !lower.includes('debited') && !lower.includes('credited'));
  if (isOtp) {
    return { skipped: true, reason: 'OTP/Promotional message', raw };
  }

  // 2. Determine Credit vs Debit
  const CREDIT_WORDS = ['credited', 'received', 'credit of', 'refund of', 'cashback of', 'deposited', 'reversed'];
  const DEBIT_WORDS = ['debited', 'paid', 'transferred', 'sent to', 'spent', 'withdrawn', 'purchase of', 'txn at'];

  const hasCredit = CREDIT_WORDS.some(w => lower.includes(w));
  const hasDebit = DEBIT_WORDS.some(w => lower.includes(w));

  let type = 'debit';
  if (hasCredit && !hasDebit) {
    type = 'credit';
  }

  // 3. Extract Amount (INR, Rs., Rs, ₹)
  const amountPatterns = [
    /(?:rs\.?|inr|₹)\s*([\d,]+(?:\.\d{1,2})?)/i,
    /(?:amount|amt)[:\s]+(?:rs\.?|inr|₹)?\s*([\d,]+(?:\.\d{1,2})?)/i,
    /([\d,]{2,}(?:\.\d{2}))\s*(?:rs\.?|inr|₹)/i
  ];

  let amount = 0;
  for (const p of amountPatterns) {
    const m = raw.match(p);
    if (m) {
      const parsed = parseFloat(m[1].replace(/,/g, ''));
      if (parsed > 0) {
        amount = parsed;
        break;
      }
    }
  }

  if (!amount || amount <= 0) {
    return { skipped: true, reason: 'No amount found', raw };
  }

  // 4. Extract Merchant / Recipient
  const merchantPatterns = [
    // UPI VPA: merchant@bank
    /(?:vpa|upi\s*id)[:\s]+([a-zA-Z0-9.\-_@]{3,50})/i,
    // "paid to X" / "transferred to X" / "debited to X"
    /(?:paid\s+to|sent\s+to|transferred\s+to|debited.*?\bto)\s+([A-Za-z0-9&.'\-\s]{2,40}?)(?:\s+(?:on|via|using|ref|txn|dated|for)|[,.]|\s*$)/i,
    // "at X" / "txn at X"
    /(?:at|txn\s+at)\s+([A-Za-z0-9&.'\-\s]{2,40}?)(?:\s+(?:on|via|using|ref|txn|dated|for|avl|towards)|[,.]|\s*$)/i,
    // "towards X"
    /\btowards\s+([A-Za-z0-9&.'\-\s]{2,40}?)(?:\s+(?:on|via|ref|txn|for)|[,.]|\s*$)/i,
    // "from X" (for credits)
    /(?:from|credited\s+by)\s+([A-Za-z0-9&.'\-\s]{2,40}?)(?:\s+(?:on|via|ref|txn|dated|for)|[,.]|\s*$)/i,
    // "Info: X"
    /(?:info|narration|remarks?)[:\s]+([A-Za-z0-9&.'\-\s]{2,40}?)(?:\s+(?:on|ref|txn)|[,.]|\s*$)/i
  ];

  let recipient = '';
  for (const p of merchantPatterns) {
    const m = raw.match(p);
    if (m && m[1]) {
      const cleaned = cleanMerchant(m[1]);
      if (cleaned.length >= 2 && cleaned.length <= 45 && !/^[X*\d\s]+$/.test(cleaned)) {
        recipient = cleaned;
        break;
      }
    }
  }

  if (!recipient) {
    recipient = type === 'credit' ? 'Income / Refund' : 'Payment / Merchant';
  }

  // 5. Extract Account Mask Hint
  const acMatch = raw.match(/(?:a\/c|ac|account|card)[:\s#*X]*([X*\d]{4,})/i);
  const accountHint = acMatch ? `A/c *${acMatch[1].slice(-4)}` : '';

  // 6. Extract Date
  const date = extractDateFromSms(raw);

  // 7. Auto Category
  const category = detectCategory(`${recipient} ${raw}`);

  return {
    skipped: false,
    amount,
    recipient,
    desc: recipient,
    category,
    type,
    accountHint,
    date,
    raw
  };
}
