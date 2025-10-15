import { readFromStorage, writeToStorage } from './storage';

export type Preferences = {
  reducedMotion: boolean;
  theme: 'light' | 'dark' | 'system';
};

const KEY = 'app:preferences';

export function getPreferences(): Preferences {
  return readFromStorage<Preferences>(KEY, { reducedMotion: false, theme: 'system' });
}

export function setPreferences(prefs: Preferences): void {
  writeToStorage(KEY, prefs);
}
