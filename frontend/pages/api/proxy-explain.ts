// frontend/pages/api/proxy-explain.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { parse } from 'cookie';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const COOKIE_NAME = process.env.NEXT_PUBLIC_AUTH_COOKIE_NAME || 'paggo_token';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const cookies = parse(req.headers.cookie || '');
  const token = cookies[COOKIE_NAME];
  if (!token) return res.status(401).json({ message: 'not authenticated' });

  // POST body contains question
  const { question } = req.body;
  const documentId = req.query.documentId as string;
  try {
    const r = await fetch(`${API}/documents/${documentId}/explain`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ question }),
    });
    const body = await r.json();
    res.status(r.status).json(body);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
}
