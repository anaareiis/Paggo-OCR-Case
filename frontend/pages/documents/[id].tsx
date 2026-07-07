// frontend/pages/documents/[id].tsx
import { GetServerSideProps } from 'next';
import { parse } from 'cookie';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const COOKIE_NAME = process.env.NEXT_PUBLIC_AUTH_COOKIE_NAME || 'paggo_token';

export default function DocumentDetails({ doc, error }: any) {
  if (error) return <div style={{ maxWidth: 700, margin: '3rem auto' }}>Error: {error}</div>;
  return (
    <div style={{ maxWidth: 900, margin: '2rem auto' }}>
      <h1>{doc.originalName}</h1>
      <div><a href={`${API}/documents/${doc.id}/download`} target="_blank" rel="noreferrer">Download</a></div>
      <h3>OCR Text</h3>
      <pre style={{ whiteSpace: 'pre-wrap', background: '#f6f6f6', padding: 12 }}>{doc.ocrResult?.extractedText ?? '(no text)'}</pre>
      <h3>Ask</h3>
      <form id="askForm">
        <input id="question" placeholder="Type a question..." style={{ width: '70%' }} />
        <button id="ask" type="button" onClick={async () => {
          const q = (document.getElementById('question') as HTMLInputElement).value;
          const resp = await fetch(`/api/proxy-explain?documentId=${doc.id}`, { method: 'POST', body: JSON.stringify({ question: q }), headers: { 'Content-Type': 'application/json' } });
          const j = await resp.json();
          alert(JSON.stringify(j));
        }}>Ask</button>
      </form>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const cookies = parse(ctx.req.headers.cookie || '');
  const token = cookies[COOKIE_NAME];
  if (!token) return { redirect: { destination: '/login', permanent: false } };

  const id = ctx.params?.id as string;
  try {
    const r = await fetch(`${API}/documents/${id}`, { headers: { Authorization: `Bearer ${token}` }});
    if (!r.ok) {
      if (r.status === 401) return { redirect: { destination: '/login', permanent: false } };
      const err = await r.text();
      return { props: { error: err } };
    }
    const doc = await r.json();
    return { props: { doc } };
  } catch (err: any) {
    return { props: { error: err.message } };
  }
};
