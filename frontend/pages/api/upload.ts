// frontend/pages/api/upload.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { parse } from 'cookie';

// Multipart body must reach the backend byte-for-byte (boundary intact),
// so the default JSON body parser has to be disabled here.
export const config = { api: { bodyParser: false } };

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const COOKIE_NAME = process.env.NEXT_PUBLIC_AUTH_COOKIE_NAME || 'paggo_token';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  const cookies = parse(req.headers.cookie || '');
  const token = cookies[COOKIE_NAME];
  if (!token) return res.status(401).json({ message: 'not authenticated' });

  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(chunk as Buffer);
  }
  const body = Buffer.concat(chunks);

  try {
    const r = await fetch(`${API}/documents/upload`, {
      method: 'POST',
      headers: {
        'Content-Type': req.headers['content-type'] || 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
      body,
    });
    const data = await r.json().catch(() => ({}));
    res.status(r.status).json(data);
  } catch (err: any) {
    res.status(500).json({ message: err.message || 'upload proxy error' });
  }
}
