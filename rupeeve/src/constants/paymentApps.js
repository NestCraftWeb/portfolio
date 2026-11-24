// Rupeeve — Payment Apps Deep-Link Registry & UPI Launcher

export const PAYMENT_APPS = [
  {
    id: 'upi',
    name: 'Default UPI',
    label: 'Any UPI App',
    icon: '⚡',
    color: '#00E676',
    pkg: '',
    buildUri: (params) => {
      const qs = new URLSearchParams(params).toString();
      return `upi://pay?${qs}`;
    }
  },
  {
    id: 'gpay',
    name: 'Google Pay',
    label: 'GPay',
    icon: '🔵',
    color: '#4285F4',
    pkg: 'com.google.android.apps.nbu.paisa.user',
    buildUri: (params) => {
      const qs = new URLSearchParams(params).toString();
      return `tez://upi/pay?${qs}`;
    }
  },
  {
    id: 'phonepe',
    name: 'PhonePe',
    label: 'PhonePe',
    icon: '🟣',
    color: '#5F259F',
    pkg: 'com.phonepe.app',
    buildUri: (params) => {
      const qs = new URLSearchParams(params).toString();
      return `phonepe://pay?${qs}`;
    }
  },
  {
    id: 'paytm',
    name: 'Paytm',
    label: 'Paytm',
    icon: '🔷',
    color: '#00BAF2',
    pkg: 'net.one97.paytm',
    buildUri: (params) => {
      const qs = new URLSearchParams(params).toString();
      return `paytmmp://pay?${qs}`;
    }
  },
  {
    id: 'bhim',
    name: 'BHIM UPI',
    label: 'BHIM',
    icon: '🟢',
    color: '#008450',
    pkg: 'in.org.npci.upiapp',
    buildUri: (params) => {
      const qs = new URLSearchParams(params).toString();
      return `upi://pay?${qs}`;
    }
  },
  {
    id: 'cred',
    name: 'CRED UPI',
    label: 'CRED',
    icon: '⚫',
    color: '#18181B',
    pkg: 'com.dreamplug.androidapp',
    buildUri: (params) => {
      const qs = new URLSearchParams(params).toString();
      return `cred://upi/pay?${qs}`;
    }
  }
];

/**
 * Launch payment app using UPI parameters
 * @param {string} appId - id from PAYMENT_APPS
 * @param {object} upiParams - { pa, pn, am, tn, cu }
 */
export function launchPaymentApp(appId, upiParams) {
  const app = PAYMENT_APPS.find(a => a.id === appId) || PAYMENT_APPS[0];
  const cleanParams = {};
  if (upiParams.pa) cleanParams.pa = upiParams.pa.trim();
  if (upiParams.pn) cleanParams.pn = upiParams.pn.trim();
  if (upiParams.am && Number(upiParams.am) > 0) cleanParams.am = Number(upiParams.am).toFixed(2);
  if (upiParams.tn) cleanParams.tn = upiParams.tn.trim();
  cleanParams.cu = upiParams.cu || 'INR';

  const uri = app.buildUri(cleanParams);
  
  try {
    window.location.href = uri;
  } catch (e) {
    console.error('Deep link launch failed', e);
  }

  // Fallback: If not on Android or app not installed, try default upi:// intent
  if (app.id !== 'upi') {
    setTimeout(() => {
      try {
        const fallbackUri = PAYMENT_APPS[0].buildUri(cleanParams);
        window.location.href = fallbackUri;
      } catch (_) {}
    }, 1200);
  }
}
