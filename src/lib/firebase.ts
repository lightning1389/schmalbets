// Firebase Realtime Database REST API configuration
// No SDK needed — uses native fetch() for smaller bundle size

const FIREBASE_DB_URL = process.env.NEXT_PUBLIC_FIREBASE_DB_URL || 'https://schmalbets-default-rtdb.firebaseio.com';
const FIREBASE_API_KEY = process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyD2TZY0LOMu3J7IDZqxy8jcF7B--KcLlCg';

export const firebaseConfig = {
  databaseURL: FIREBASE_DB_URL,
  apiKey: FIREBASE_API_KEY,
};

// Firebase Auth REST API endpoint
const AUTH_URL = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`;

export interface AuthToken {
  idToken: string;
  email: string;
  expiresIn: string;
  localId: string;
}

/**
 * Sign in with email/password using Firebase Auth REST API.
 * Returns an idToken for authenticated RTDB writes.
 */
export async function signInWithEmail(email: string, password: string): Promise<AuthToken> {
  const res = await fetch(AUTH_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email,
      password,
      returnSecureToken: true,
    }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error?.error?.message || 'Authentication failed');
  }

  return res.json();
}

/**
 * Read data from RTDB (public, no auth needed).
 */
export async function dbRead<T>(path: string): Promise<T | null> {
  const res = await fetch(`${FIREBASE_DB_URL}/${path}.json`);
  if (!res.ok) return null;
  return res.json();
}

/**
 * Write data to RTDB (requires auth token).
 */
export async function dbWrite<T>(path: string, data: T, token: string): Promise<boolean> {
  const res = await fetch(`${FIREBASE_DB_URL}/${path}.json?auth=${encodeURIComponent(token)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.ok;
}

/**
 * Update (PATCH) data at a path in RTDB.
 */
export async function dbUpdate<T>(path: string, data: Partial<T>, token: string): Promise<boolean> {
  const res = await fetch(`${FIREBASE_DB_URL}/${path}.json?auth=${encodeURIComponent(token)}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.ok;
}

/**
 * Delete data at a path in RTDB.
 */
export async function dbDelete(path: string, token: string): Promise<boolean> {
  const res = await fetch(`${FIREBASE_DB_URL}/${path}.json?auth=${encodeURIComponent(token)}`, {
    method: 'DELETE',
  });
  return res.ok;
}
