// frontend/pages/api/document-status.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { parse } from 'cookie';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const COOKIE_NAME = process.env.NEXT_PUBLIC_AUTH_COOKIE_NAME || 'paggo_token';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const cookies = parse(req.headers.cookie || '');
  const token = cookies[COOKIE_NAME];
  if (!token) return res.status(401).json({ message: 'not authenticated' });

  const documentId = req.query.documentId as string;
  try {
    const r = await fetch(`${API}/documents/${documentId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const body = await r.json().catch(() => ({}));
    return res.status(r.status).json(body);
  } catch (err: any) {
    res.status(500).json({ message: err.message || 'status proxy error' });
  }
}
