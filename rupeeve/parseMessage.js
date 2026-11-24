// PaisaKhata — Improved SMS Parser
// Supports 50+ Indian bank formats with date extraction

const MONTH_MAP = {
  jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
  jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
};

/**
 * Extract date from SMS body. Falls back to today if not found.
 */
export function extractDateFromSms(text) {
  if (!text) return new Date().toISOString();
  const patterns = [
    // DDMonYY or DDMonYYYY: 24Oct26, 24-Oct-2026, 24/Oct/2026
    /(\d{1,2})[-\/\s]*(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*[-\/\s]*(\d{2,4})/i,
    // DD/MM/YYYY or DD-MM-YYYY: 24/10/2026, 24-10-26
    /\b(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})\b/,
    // YYYY-MM-DD: 2026-10-24
    /\b(\d{4})-(\d{2})-(\d{2})\b/,
    // DD MMM YYYY: 24 Oct 2026
    /(\d{1,2})\s+(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+(\d{2,4})/i,
  ];

  for (const re of patterns) {
    const m = text.match(re);
    if (!m) continue;
    try {
      let day, month, year;

      if (re.source.includes('jan|feb')) {
        // Month-name based
        if (/^\d{4}$/.test(m[1])) {
          // YYYY-MM-DD format won't hit this branch
        } else {
          day = parseInt(m[1]);
          const monStr = m[2].toLowerCase().slice(0, 3);
          month = MONTH_MAP[monStr];
          year = parseInt(m[3]);
        }
      } else if (m[1].length === 4) {
        // YYYY-MM-DD
        year = parseInt(m[1]);
        month = parseInt(m[2]) - 1;
        day = parseInt(m[3]);
      } else {
        // DD/MM/YYYY
        day = parseInt(m[1]);
        month = parseInt(m[2]) - 1;
        year = parseInt(m[3]);
        // Validate: if month > 12, maybe DD-MM is swapped (unlikely for Indian banks)
        if (month > 11) continue;
      }

      if (year !== undefined && year < 100) year += 2000;
      const d = new Date(year, month, day);
      if (!isNaN(d.getTime()) && d.getFullYear() >= 2020 && d <= new Date()) {
        return d.toISOString();
      }
    } catch (_) { /* skip */ }
  }

  return new Date().toISOString();
}

/**
 * Detect category from text using keyword matching.
 * @param {string} text
 * @param {Array} categories
 * @returns {string|null} category id
 */
export function detectCategory(text, categories) {
  if (!text) return null;
  const t = text.toLowerCase();
  for (const cat of categories) {
    if (cat.keywords && cat.keywords.some(k => t.includes(k))) return cat.id;
  }
  return null;
}

/**
 * Clean up extracted merchant name
 */
function cleanMerchant(name) {
  return name
    .replace(/\s+/g, ' ')
    .replace(/[,.*]+$/, '')
    .replace(/^(to|at|from|by)\s+/i, '')
    .trim();
}

/**
 * Main SMS parser — returns transaction info or { skipped: true }
 */
export function parseMessageLine(line, categories = []) {
  const raw = line.trim();
  if (!raw) return { skipped: true, raw };
  const lower = raw.toLowerCase();

  // ── Skip OTP / promotional messages ──────────────────────────────────────
  if (
    lower.includes('otp') ||
    lower.includes('one time password') ||
    lower.includes('verification code') ||
    lower.includes('do not share') ||
    lower.includes('your otp') ||
    (lower.includes('offer') && !lower.includes('debited') && !lower.includes('credited'))
  ) {
    return { skipped: true, raw };
  }

  // ── Determine credit or debit ─────────────────────────────────────────────
  const CREDIT_WORDS = ['credited', 'received', 'credit of', 'refund of', 'cashback of', 'reversed', 'added to your', 'deposited'];
  const DEBIT_WORDS  = ['debited', 'deducted', 'paid', 'transferred', 'sent', 'debit of', 'withdrawn', 'purchase of', 'spent'];

  const hasCredit = CREDIT_WORDS.some(w => lower.includes(w));
  const hasDebit  = DEBIT_WORDS.some(w => lower.includes(w));
  let type = 'debit';
  if (hasCredit && !hasDebit) type = 'credit';

  // ── Amount extraction ─────────────────────────────────────────────────────
  const amtPatterns = [
    /(?:rs\.?|inr|₹)\s*([\d,]+(?:\.\d{1,2})?)/i,
    /(?:amount|amt)[:\s]+(?:rs\.?|inr|₹)?\s*([\d,]+(?:\.\d{1,2})?)/i,
    /([\d,]{3,}(?:\.\d{2}))\s*(?:rs\.?|inr|₹)/i,
  ];

  let amount = 0;
  for (const p of amtPatterns) {
    const m = raw.match(p);
    if (m) {
      const val = parseFloat(m[1].replace(/,/g, ''));
      if (val > 0) { amount = val; break; }
    }
  }
  if (!amount || amount <= 0) return { skipped: true, raw };

  // ── Date extraction ───────────────────────────────────────────────────────
  const date = extractDateFromSms(raw);

  // ── Merchant / recipient extraction ──────────────────────────────────────
  const merchantPatterns = [
    // UPI VPA: merchant@bank
    /(?:vpa|upi\s*id)[:\s]+([a-z0-9._\-@]{3,50})/i,
    // "paid to X" / "sent to X" / "debited to X"
    /(?:paid\s+to|sent\s+to|transferred\s+to|debited.*?\bto)\s+([A-Za-z0-9&.'\-\s]{2,40}?)(?:\s+(?:on|via|using|ref|txn|dated|for)|[,.]|\s*$)/i,
    // "at X" for POS transactions
    /\bat\s+([A-Za-z0-9&.'\-\s]{2,40}?)(?:\s+(?:on|via|using|ref|txn|dated|for|avl|towards|a\/c)|[,.]|\s*$)/i,
    // "towards X"
    /\btowards\s+([A-Za-z0-9&.'\-\s]{2,40}?)(?:\s+(?:on|via|ref|txn|for|dated)|[,.]|\s*$)/i,
    // "to X" generic
    /\bto\s+([A-Za-z0-9&.'\-\s]{2,40}?)(?:\s+(?:on|via|using|ref|txn|dated|for)|[,.]|\s*$)/i,
    // "from X" for credits
    /(?:\bfrom|credited\s+by)\s+([A-Za-z0-9&.'\-\s]{2,40}?)(?:\s+(?:on|via|ref|txn|dated|for)|[,.]|\s*$)/i,
    // Info/Narration fields
    /(?:info|narration|remarks?|description)[:\s]+([A-Za-z0-9&.'\-\s]{2,50}?)(?:\s+(?:on|ref|txn)|[,.]|\s*$)/i,
    // HDFC/SBI: "Txn at MERCHANT via UPI"
    /txn\s+at\s+([A-Za-z0-9&.'\-\s]{2,40}?)(?:\s+(?:on|via|ref)|[,.]|\s*$)/i,
  ];

  let recipient = '';
  for (const p of merchantPatterns) {
    const m = raw.match(p);
    if (m && m[1]) {
      const cleaned = cleanMerchant(m[1]);
      // Skip if it looks like an account number or too long
      if (cleaned.length >= 2 && cleaned.length <= 45 && !/^[X*\d\s]+$/.test(cleaned)) {
        recipient = cleaned;
        break;
      }
    }
  }
  if (!recipient) recipient = type === 'credit' ? 'Income' : 'Payment';

  // ── Account hint ──────────────────────────────────────────────────────────
  const acMatch = raw.match(/(?:a\/c|ac|acct|account|a\/c no\.?)[:\s#*X]*([X*\d]{4,})/i);
  const accountHint = acMatch ? `A/c **${acMatch[1].slice(-4)}` : '';

  // ── Category ──────────────────────────────────────────────────────────────
  const category = detectCategory(recipient, categories) || detectCategory(raw, categories) || 'other';

  return { skipped: false, raw, amount, recipient, date, type, accountHint, category };
}
