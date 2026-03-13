'use client';

export type Identity = {
  name: string;
  email: string;
  cofounder_id: string;
};

const IDENTITY_KEY = 'cuber_identity';

export function getIdentity(): Identity | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem(IDENTITY_KEY);
    if (!stored) return null;
    return JSON.parse(stored) as Identity;
  } catch {
    return null;
  }
}

export function setIdentity(identity: Identity): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(IDENTITY_KEY, JSON.stringify(identity));
}

export function clearIdentity(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(IDENTITY_KEY);
}

const SESSION_KEY = 'cuber_session_id';

export function getSessionId(): string {
  if (typeof window === 'undefined') return '';
  let sessionId = localStorage.getItem(SESSION_KEY);
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem(SESSION_KEY, sessionId);
  }
  return sessionId;
}

export function clearSession(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(SESSION_KEY);
}
