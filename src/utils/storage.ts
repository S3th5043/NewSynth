export type StoredValue<T> = { value: T; updatedAt: number };

export function readFromStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return defaultValue;
    const parsed = JSON.parse(raw) as StoredValue<T>;
    return parsed?.value ?? defaultValue;
  } catch {
    return defaultValue;
  }
}

export function writeToStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    const payload: StoredValue<T> = { value, updatedAt: Date.now() };
    window.localStorage.setItem(key, JSON.stringify(payload));
  } catch {
    // ignore
  }
}

export function removeFromStorage(key: string): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    // ignore
  }
}
