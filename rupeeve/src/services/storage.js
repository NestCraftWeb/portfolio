// Rupeeve — Storage Service with Schema Versioning & Auto-Backup

export const STORAGE_KEYS = {
  TRANSACTIONS: 'rupeeve-transactions-v2',
  BUDGET: 'rupeeve-budget-v2',
  THEME_DARK: 'rupeeve-dark-mode-v2',
  PROFILE: 'rupeeve-profile-v2',
  BALANCE_OVERRIDE: 'rupeeve-balance-override-v2',
  PIN_HASH: 'rupeeve-pin-hash-v2'
};

export const Storage = {
  get(key, defaultValue = null) {
    try {
      const val = localStorage.getItem(key);
      if (val === null || val === undefined) return defaultValue;
      return JSON.parse(val);
    } catch (e) {
      console.warn(`Storage read error for key: ${key}`, e);
      return defaultValue;
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error(`Storage write error for key: ${key}`, e);
      return false;
    }
  },

  remove(key) {
    try {
      localStorage.removeItem(key);
    } catch (_) {}
  },

  clearAll() {
    try {
      localStorage.clear();
    } catch (_) {}
  },

  createBackup() {
    const backup = {};
    for (const [name, key] of Object.entries(STORAGE_KEYS)) {
      backup[name] = this.get(key, null);
    }
    backup._createdAt = new Date().toISOString();
    backup._version = '2.0.0';
    return JSON.stringify(backup, null, 2);
  },

  restoreBackup(jsonString) {
    try {
      const parsed = JSON.parse(jsonString);
      for (const [name, key] of Object.entries(STORAGE_KEYS)) {
        if (parsed[name] !== undefined) {
          this.set(key, parsed[name]);
        }
      }
      return true;
    } catch (e) {
      console.error('Backup restore failed', e);
      return false;
    }
  }
};
