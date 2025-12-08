// frontend/pages/api/login.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { serialize } from 'cookie';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const COOKIE_NAME = process.env.NEXT_PUBLIC_AUTH_COOKIE_NAME || 'paggo_token';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  const body = req.body;

  try {
    const r = await fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!r.ok) {
      const err = await r.json().catch(() => ({}));
      return res.status(r.status).json(err);
    }

    const data = await r.json();
    const token = data.access_token;

    // set httpOnly cookie
    // parse expiry from JWT? simpler: set cookie maxAge to 15m (900s) or use env
    const maxAge = 60 * 60 * 24 * 7; // 7 days default - adjust as you prefer

    res.setHeader('Set-Cookie', serialize(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge,
    }));

    // return user info to client
    return res.status(200).json({ user: data.user });
  } catch (err: any) {
    console.error('login proxy error', err);
    return res.status(500).json({ message: 'login proxy error' });
  }
}
