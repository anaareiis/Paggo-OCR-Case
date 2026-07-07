// frontend/pages/documents/[id].tsx
import { GetServerSideProps } from 'next';
import { parse } from 'cookie';
import { useState } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
const COOKIE_NAME = process.env.NEXT_PUBLIC_AUTH_COOKIE_NAME || 'paggo_token';

export default function DocumentDetails({ doc, error }: any) {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [askError, setAskError] = useState<string | null>(null);

  if (error) return <div style={{ maxWidth: 700, margin: '3rem auto' }}>Error: {error}</div>;

  const isImage = doc.mimeType?.startsWith('image/');
  const previewUrl = `${API}/${doc.storagePath}`; // works only if backend serves uploads statically

  async function ask() {
    if (!question) return setAskError('Type a question');
    setAskError(null);
    setLoading(true);
    try {
      const resp = await fetch(`/api/proxy-explain?documentId=${doc.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
      });
      const json = await resp.json();
      if (!resp.ok) {
        setAskError(json.message || JSON.stringify(json));
        setAnswer(null);
      } else {
        setAnswer(json.answer ?? JSON.stringify(json));
      }
    } catch (err: any) {
      setAskError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 900, margin: '2rem auto' }}>
      <h1>{doc.originalName}</h1>
      <div style={{ marginBottom: 12 }}>
        <a href={`${API}/documents/${doc.id}/download`} target="_blank" rel="noreferrer">Download (ZIP)</a>
      </div>

      <div style={{ display: 'flex', gap: 20 }}>
        <div style={{ flex: 1 }}>
          <h3>Preview</h3>
          {isImage ? (
            <img src={previewUrl} alt="preview" style={{ maxWidth: '100%', border: '1px solid #ddd' }} />
          ) : (
            <div>
              {doc.mimeType === 'application/pdf' ? (
                <div>
                  <p>PDF preview (if supported). If it doesn't display, click Download.</p>
                  <iframe src={previewUrl} style={{ width: '100%', height: 480, border: '1px solid #ddd' }} />
                </div>
              ) : (
                <div>No preview available. Click Download.</div>
              )}
            </div>
          )}
        </div>

        <div style={{ flex: 1 }}>
          <h3>OCR Text</h3>
          <pre style={{ whiteSpace: 'pre-wrap', background: '#f6f6f6', padding: 12, maxHeight: 420, overflow: 'auto' }}>
            {doc.ocrResult?.extractedText ?? '(no text)'}
          </pre>

          <h3 style={{ marginTop: 16 }}>Ask about this document</h3>
          <textarea value={question} onChange={(e) => setQuestion(e.target.value)} rows={3} style={{ width: '100%' }} />
          <div style={{ marginTop: 8 }}>
            <button onClick={ask} disabled={loading}>{loading ? 'Asking...' : 'Ask LLM'}</button>
            {askError && <div style={{ color: 'crimson', marginTop: 8 }}>{askError}</div>}
            {answer && (
              <div style={{ marginTop: 12 }}>
                <h4>Answer</h4>
                <div style={{ background: '#fffbea', padding: 12, borderRadius: 4 }}>{answer}</div>
              </div>
            )}
          </div>
        </div>
      </div>
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
