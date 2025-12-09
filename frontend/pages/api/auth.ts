// frontend/pages/api/auth.ts
export const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
export const COOKIE_NAME = process.env.NEXT_PUBLIC_AUTH_COOKIE_NAME || 'paggo_token';

export async function fetchWithToken(path: string, token?: string, opts: RequestInit = {}) {
  const headers = { ...(opts.headers as any || {}), Authorization: token ? `Bearer ${token}` : undefined };
  const r = await fetch(`${API}${path}`, { ...opts, headers });
  return r;
}

export async function login(username: string, password: string) {
  const resp = await fetch(`${API}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  if (!resp.ok) {
    const j = await resp.json();
    throw new Error(j.message || 'Login failed');
  }
  return resp.json();
}

export async function register(username: string, password: string) {
  const resp = await fetch(`${API}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });  

    if (!resp.ok) { 
    const j = await resp.json();
    throw new Error(j.message || 'Registration failed');
  }
  return resp.json();
}