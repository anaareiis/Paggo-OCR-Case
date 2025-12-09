// -----------------------------
// File: frontend/pages/api/register.ts
// -----------------------------
import type { NextApiRequest, NextApiResponse } from 'next';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  try {
    // forward request to backend /auth/register
    const r = await fetch(`${API}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });

    const payload = await r.text();
    // try parse as json
    let json: any;
    try { json = JSON.parse(payload); } catch { json = { message: payload }; }

    if (!r.ok) {
      return res.status(r.status).json(json);
    }

    // success — return backend body
    return res.status(201).json(json);
  } catch (err: any) {
    console.error('Register proxy error:', err);
    return res.status(500).json({ message: 'Internal proxy error' });
  }
}
