// frontend/pages/documents/index.tsx
import Link from 'next/link';
import { GetServerSideProps } from 'next';
import { parse } from 'cookie';
import { useState } from 'react';
import { useRouter } from 'next/router';
import AppShell from '../../components/AppShell';
import Card from '../../components/Card';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const COOKIE_NAME = process.env.NEXT_PUBLIC_AUTH_COOKIE_NAME || 'paggo_token';

export default function DocumentsPage({ data, error }: any) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  if (error) {
    return (
    <div style={{ maxWidth: 800, margin: '48px auto' }}>
        <p style={{ color: 'red' }}>{error}</p>
    </div>
    );
  }

  async function handleDelete(id: string, name: string) {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setDeletingId(id);
    try {
      const resp = await fetch(`/api/delete-document?documentId=${id}`, { method: 'DELETE' });
      if (!resp.ok) {
        const j = await resp.json().catch(() => ({}));
        throw new Error(j.message || 'Failed to delete document');
      }
      router.replace(router.asPath);
    } catch (err: any) {
      alert('Error: ' + err.message);
      setDeletingId(null);
    }
  }

  return (
    <div style={{ maxWidth: 1000, margin: '40px auto' }}>
    <h1 style={{ marginBottom: 8 }}>Documents</h1>
    <div style={{ marginBottom: 18 }}>
        <Link href="/upload" className="btn btn-primary">Upload</Link>
    </div>

    <div style={{ display: 'grid', gap: 12 }}>
        {(data?.items ?? []).map((d: any) => (
        <Card key={d.id} className="flex items-center justify-between" style={{ display:'flex', justifyContent:'space-between' }}>
            <div>
            <div style={{ fontWeight:600 }}>{d.originalName}</div>
            <div style={{ color:'#6b7280', fontSize:13 }}>{d.mimeType} • {d.size} bytes</div>
            </div>
            <div style={{ display:'flex', gap:8 }}>
            <Link href={`/documents/${d.id}`} className="btn">Open</Link>
            <a href={`/api/download?documentId=${d.id}`} className="btn ghost">Download</a>
            <button
              className="btn"
              style={{ background: '#dc2626', color: '#fff', borderColor: '#dc2626' }}
              onClick={() => handleDelete(d.id, d.originalName)}
              disabled={deletingId === d.id}
            >
              {deletingId === d.id ? 'Deleting...' : 'Delete'}
            </button>
            </div>
        </Card>
        ))}
    </div>
    </div>
  );
}

/**
 * Server-side protection:
 * - checks cookie named NEXT_PUBLIC_AUTH_COOKIE_NAME (fallback 'paggo_token')
 * - if missing, redirect to /login (so page is private)
 * - if present, fetch list from backend including Authorization header
 */
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const cookies = parse(ctx.req.headers.cookie || '');
  const token = cookies[COOKIE_NAME];

  if (!token) {
    // not authenticated -> redirect to login
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  // forward token to backend
  try {
    const r = await fetch(`${API}/documents?limit=20&offset=0`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!r.ok) {
      if (r.status === 401) {
        return { redirect: { destination: '/login', permanent: false } };
      }
      const errText = await r.text();
      return { props: { error: errText } };
    }

    const data = await r.json();
    return { props: { data } };
  } catch (err:any) {
    return { props: { error: err.message || 'Failed to fetch documents' } };
  }
};
