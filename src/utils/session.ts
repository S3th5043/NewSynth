import { readFromStorage, writeToStorage, removeFromStorage } from './storage';

export type Session = {
  email: string;
  verified: boolean;
};

const KEY = 'app:session';

export function getSession(): Session | null {
  return readFromStorage<Session | null>(KEY, null);
}

export function setSession(session: Session): void {
  writeToStorage(KEY, session);
}

export function clearSession(): void {
  removeFromStorage(KEY);
}
