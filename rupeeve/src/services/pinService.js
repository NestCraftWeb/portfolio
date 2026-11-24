// Rupeeve — PIN Cryptographic Security Service (SHA-256)
import { Storage, STORAGE_KEYS } from './storage.js';

async function hashPin(pin) {
  const encoder = new TextEncoder();
  const data = encoder.encode(`${pin}:rupeeve:secure:salt`);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export const PinService = {
  hasPin() {
    return !!Storage.get(STORAGE_KEYS.PIN_HASH, null);
  },

  async setPin(pin) {
    if (!pin || pin.length !== 4) return false;
    const hash = await hashPin(pin);
    return Storage.set(STORAGE_KEYS.PIN_HASH, hash);
  },

  async verifyPin(pin) {
    const storedHash = Storage.get(STORAGE_KEYS.PIN_HASH, null);
    if (!storedHash) return true;
    const hash = await hashPin(pin);
    return hash === storedHash;
  },

  removePin() {
    Storage.remove(STORAGE_KEYS.PIN_HASH);
  }
};
