import { GetServerSideProps } from 'next';
import { parse } from 'cookie';
import { useState } from 'react';
import Link from 'next/link';
import Button from '../../components/Button';
import Card from '../../components/Card';
import Spinner from '../../components/Spinner';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const COOKIE_NAME = process.env.NEXT_PUBLIC_AUTH_COOKIE_NAME || 'paggo_token';

function formatBytes(bytes: number) {
  if (!bytes) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.min(units.length - 1, Math.floor(Math.log(bytes) / Math.log(1024)));
  return `${(bytes / Math.pow(1024, i)).toFixed(i ? 1 : 0)} ${units[i]}`;
}

export default function DocumentDetail({ doc, error }: any) {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const previewUrl = `${API}/${doc?.storagePath}`;

  if (error) {
    return (
      <div className="max-w-2xl mx-auto mt-10">
        <Card className="border-red-200 bg-red-50 text-red-700">{error}</Card>
      </div>
    );
  }

  async function ask() {
    if (!question) return;
    setLoading(true);
    setAnswer(null);
    try {
      const resp = await fetch(`/api/proxy-explain?documentId=${doc.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
      });
      const j = await resp.json();
      if (!resp.ok) throw new Error(j.message || 'Error');
      setAnswer(j.answer || 'No answer');
    } catch (err: any) {
      setAnswer('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16">
      <div className="flex items-center justify-between gap-4">
        <div>
          <Link href="/documents" className="text-sm text-[var(--muted)] hover:text-[var(--accent)]">
            ← Back to documents
          </Link>
          <h1 className="text-2xl font-semibold mt-1 break-all">{doc.originalName}</h1>
          <p className="text-sm text-[var(--muted)] mt-1">
            {doc.mimeType} · {formatBytes(doc.size)} · uploaded {new Date(doc.createdAt).toLocaleString()}
          </p>
        </div>
        <a href={`/api/download?documentId=${doc.id}`} className="shrink-0">
          <Button variant="ghost">Download ZIP</Button>
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-start">
        <div className="md:col-span-3">
          <Card className="!p-0 overflow-hidden">
            {doc.mimeType?.startsWith('image/') ? (
              <img src={previewUrl} alt="preview" className="w-full object-contain" />
            ) : (
              <iframe src={previewUrl} className="w-full h-[520px] border-0" title="document preview" />
            )}
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card>
            <div className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">
              Extracted text (OCR)
            </div>
            <div className="max-h-[420px] overflow-auto whitespace-pre-wrap text-sm leading-relaxed bg-[var(--bg)] border border-[var(--border)] rounded-lg p-3">
              {doc.ocrResult?.extractedText || 'No OCR text available for this document.'}
            </div>
          </Card>
        </div>
      </div>

      <Card>
        <div className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)] mb-3">
          Ask about this document
        </div>
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          rows={3}
          placeholder="e.g. What is the total amount on this invoice?"
          className="form-input"
        />
        <div className="flex items-center gap-3 mt-3">
          <Button variant="primary" onClick={ask} disabled={loading || !question}>
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <Spinner size={14} /> Asking...
              </span>
            ) : (
              'Ask LLM'
            )}
          </Button>
        </div>
        {answer && (
          <div className="mt-4 p-4 rounded-lg bg-amber-50 border border-amber-200 text-sm">
            <div className="font-semibold text-amber-900 mb-1">Answer</div>
            <div className="text-amber-900 whitespace-pre-wrap">{answer}</div>
          </div>
        )}
      </Card>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const cookies = parse(ctx.req.headers.cookie || '');
  const token = cookies[COOKIE_NAME];
  if (!token) return { redirect: { destination: '/login', permanent: false } };

  const id = ctx.params?.id as string;
  const r = await fetch(`${API}/documents/${id}`, { headers: { Authorization: `Bearer ${token}` }});
  if (!r.ok) {
    if (r.status === 401) return { redirect: { destination: '/login', permanent: false } };
    const err = await r.text();
    return { props: { error: err } };
  }
  const doc = await r.json();
  return { props: { doc } };
}
