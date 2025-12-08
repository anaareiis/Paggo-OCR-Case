// frontend/pages/documents/index.tsx
import Link from 'next/link';
import { GetServerSideProps } from 'next';
import { parse } from 'cookie';
import { useState } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const COOKIE_NAME = process.env.NEXT_PUBLIC_AUTH_COOKIE_NAME || 'paggo_token';

export default function DocumentsPage({ data: initialData, error }: { data?: any, error?: string }) {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);

  async function refresh() {
    setLoading(true);
    try {
      const res = await fetch('/api/refresh-documents');
      const json = await res.json();
      if (res.ok) {
        setData(json);
      } else {
        alert(json.message || 'Failed to refresh');
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (error) {
    return (
      <div style={{ maxWidth: 800, margin: '3rem auto' }}>
        <h2>Error</h2>
        <div>{error}</div>
        <div style={{ marginTop: 12 }}>
          <Link href="/login">Go to Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 900, margin: '2rem auto', padding: 12 }}>
      <h1>Your documents</h1>
      <div style={{ marginBottom: 12 }}>
        <Link href="/upload">Upload</Link> • <Link href="/login">Login</Link> • <a href="#" onClick={async (e) => { e.preventDefault(); await fetch('/api/logout'); window.location.href = '/login'; }}>Logout</a>
        <button style={{ marginLeft: 12 }} onClick={refresh} disabled={loading}>{loading ? 'Refreshing...' : 'Refresh'}</button>
      </div>

      <div style={{ marginTop: 12 }}>
        <strong>Total:</strong> {data?.total ?? 0}
      </div>

      <ul style={{ marginTop: 16 }}>
        {(data?.items ?? []).length === 0 && <li>No documents yet</li>}
        {(data?.items ?? []).map((d: any) => (
          <li key={d.id} style={{ marginBottom: 16 }}>
            <strong>{d.originalName}</strong> — {d.mimeType} — {d.size} bytes<br />
            <Link href={`/documents/${d.id}`}>Open</Link> • <a href={`${API}/documents/${d.id}/download`} target="_blank" rel="noreferrer">Download</a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const cookies = parse(ctx.req.headers.cookie || '');
  const token = cookies[COOKIE_NAME];
  if (!token) {
    return { redirect: { destination: '/login', permanent: false } };
  }

  try {
    const r = await fetch(`${API}/documents?limit=10&offset=0`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!r.ok) {
      if (r.status === 401) {
        return { redirect: { destination: '/login', permanent: false } };
      }
      const err = await r.text();
      return { props: { error: err } };
    }
    const data = await r.json();
    return { props: { data } };
  } catch (err: any) {
    return { props: { error: err.message } };
  }
};
