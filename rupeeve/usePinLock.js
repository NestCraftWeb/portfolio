// PaisaKhata — PIN Lock Hook
import { useState, useEffect } from 'react';

const PIN_HASH_KEY = 'paisakhata-pin-hash';

async function hashPin(pin) {
  const encoder = new TextEncoder();
  const data = encoder.encode(pin + ':paisakhata:2026');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * PIN Lock hook — manages 4-digit PIN with SHA-256 hashing.
 */
export function usePinLock() {
  const [hasPin, setHasPin] = useState(false);
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(PIN_HASH_KEY);
    if (stored) {
      setHasPin(true);
      setIsLocked(true);
    }
  }, []);

  async function setPin(pin) {
    const hash = await hashPin(pin);
    localStorage.setItem(PIN_HASH_KEY, hash);
    setHasPin(true);
    setIsLocked(false);
  }

  async function verifyPin(pin) {
    const hash = await hashPin(pin);
    const stored = localStorage.getItem(PIN_HASH_KEY);
    if (hash === stored) {
      setIsLocked(false);
      return true;
    }
    return false;
  }

  function removePin() {
    localStorage.removeItem(PIN_HASH_KEY);
    setHasPin(false);
    setIsLocked(false);
  }

  function lock() {
    if (hasPin) setIsLocked(true);
  }

  return { hasPin, isLocked, setPin, verifyPin, removePin, lock };
}
