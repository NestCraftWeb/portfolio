// Rupeeve — CSV Export Utility
// Exports transactions to a UTF-8 BOM CSV compatible with Excel / Google Sheets

const MONTH_NAMES = ['January','February','March','April','May','June',
  'July','August','September','October','November','December'];

/**
 * Download transactions as a CSV file.
 * @param {Array} transactions - all transaction objects
 * @param {number|null} month - 0-based month index (optional, for filtering)
 * @param {number|null} year  - full year (optional, for filtering)
 */
export function exportToCSV(transactions, month = null, year = null) {
  let rows = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date));

  // Optional month filter
  if (month !== null && year !== null) {
    rows = rows.filter(t => {
      const d = new Date(t.date);
      return d.getMonth() === month && d.getFullYear() === year;
    });
  }

  const headers = ['Date', 'Time', 'Description', 'Category', 'Type', 'Amount (₹)', 'Person / Account'];

  const csvRows = rows.map(t => {
    const d = new Date(t.date);
    return [
      d.toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' }),
      d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      csvEscape(t.desc || ''),
      csvEscape(t.category || 'other'),
      t.type === 'credit' ? 'Credit' : 'Debit',
      String(Math.round(t.amount || 0)),
      csvEscape(t.person || t.accountHint || ''),
    ];
  });

  const csvContent = [headers, ...csvRows]
    .map(row => row.join(','))
    .join('\r\n');

  // UTF-8 BOM so Excel auto-detects encoding
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });

  const fileName = month !== null && year !== null
    ? `Rupeeve_${MONTH_NAMES[month]}_${year}.csv`
    : `Rupeeve_All_${new Date().toISOString().split('T')[0]}.csv`;

  // Download
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

/** Escape a value for CSV (wrap in quotes if contains comma/quote/newline) */
function csvEscape(val) {
  const str = String(val);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}

/**
 * Generate a plain-text monthly summary string (for sharing).
 */
export function monthlySummaryText(transactions, month, year) {
  const rows = transactions.filter(t => {
    const d = new Date(t.date);
    return d.getMonth() === month && d.getFullYear() === year;
  });

  const totalDebit  = rows.filter(t => t.type !== 'credit').reduce((s, t) => s + t.amount, 0);
  const totalCredit = rows.filter(t => t.type === 'credit').reduce((s, t) => s + t.amount, 0);

  const lines = [
    `Rupeeve Summary — ${MONTH_NAMES[month]} ${year}`,
    `Total Spent  : ₹${Math.round(totalDebit).toLocaleString('en-IN')}`,
    `Total Received: ₹${Math.round(totalCredit).toLocaleString('en-IN')}`,
    `Transactions : ${rows.length}`,
    '',
    'Top categories:',
  ];

  const byCat = {};
  rows.filter(t => t.type !== 'credit').forEach(t => { byCat[t.category] = (byCat[t.category] || 0) + t.amount; });
  Object.entries(byCat).sort((a, b) => b[1] - a[1]).slice(0, 5).forEach(([cat, amt]) => {
    lines.push(`  ${cat.padEnd(16)} ₹${Math.round(amt).toLocaleString('en-IN')}`);
  });

  return lines.join('\n');
}
