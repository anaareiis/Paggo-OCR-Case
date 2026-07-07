// frontend/pages/api/me.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { parse } from 'cookie';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const COOKIE_NAME = process.env.NEXT_PUBLIC_AUTH_COOKIE_NAME || 'paggo_token';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const cookies = parse(req.headers.cookie || '');
  const token = cookies[COOKIE_NAME];
  if (!token) return res.status(401).json({ message: 'not authenticated' });

  const r = await fetch(`${API}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!r.ok) return res.status(r.status).json({ message: 'invalid session' });
  const data = await r.json();
  res.status(200).json(data);
}
