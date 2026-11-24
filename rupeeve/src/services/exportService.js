// Rupeeve — Export & Import Service
import { Storage } from './storage.js';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

function escapeCsvField(val) {
  const str = String(val ?? '');
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}

export function exportTransactionsToCsv(transactions, month = null, year = null) {
  let rows = [...transactions].sort((a, b) => new Date(a.date) - new Date(b.date));

  if (month !== null && year !== null) {
    rows = rows.filter(t => {
      const d = new Date(t.date);
      return d.getMonth() === month && d.getFullYear() === year;
    });
  }

  const headers = ['Date', 'Time', 'Merchant / Description', 'Category', 'Type', 'Amount (INR)', 'Note / Account'];

  const csvRows = rows.map(t => {
    const d = new Date(t.date);
    return [
      d.toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' }),
      d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      escapeCsvField(t.desc || t.recipient || 'Expense'),
      escapeCsvField(t.category || 'other'),
      t.type === 'credit' ? 'Credit' : 'Debit',
      Math.round(t.amount || 0).toString(),
      escapeCsvField(t.note || t.accountHint || t.person || '')
    ];
  });

  const csvBody = [headers, ...csvRows]
    .map(row => row.join(','))
    .join('\r\n');

  // Prepend UTF-8 BOM so Excel & Sheets open Indian Rupee symbols and accents correctly
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csvBody], { type: 'text/csv;charset=utf-8;' });

  const fileName = month !== null && year !== null
    ? `Rupeeve_${MONTH_NAMES[month]}_${year}.csv`
    : `Rupeeve_All_Transactions_${new Date().toISOString().split('T')[0]}.csv`;

  downloadBlob(blob, fileName);
}

export function exportFullBackup() {
  const json = Storage.createBackup();
  const blob = new Blob([json], { type: 'application/json' });
  const fileName = `Rupeeve_Backup_${new Date().toISOString().split('T')[0]}.json`;
  downloadBlob(blob, fileName);
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}
