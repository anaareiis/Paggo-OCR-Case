import { GetServerSideProps } from 'next';
import { parse } from 'cookie';
import { useState } from 'react';
import Button from '../components/Button';
import Card from '../components/Card';
import Spinner from '../components/Spinner';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const COOKIE_NAME = process.env.NEXT_PUBLIC_AUTH_COOKIE_NAME || 'paggo_token';

export default function DocumentDetail({ doc, error }: any) {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState<string|null>(null);
  const [loading, setLoading] = useState(false);
  const previewUrl = `${API}/${doc.storagePath}`;

  if (error) return <div className="text-red-600">{error}</div>;

  async function ask() {
    if (!question) return;
    setLoading(true);
    setAnswer(null);
    try {
      const resp = await fetch(`/api/proxy-explain?documentId=${doc.id}`, {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({ question })
      });
      const j = await resp.json();
      if (!resp.ok) throw new Error(j.message || 'Error');
      setAnswer(j.answer || 'No answer');
    } catch (err:any) {
      setAnswer('Error: ' + err.message);
    } finally { setLoading(false); }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-start gap-6">
        <div style={{flex:1}}>
          <Card>
            <div className="text-lg font-semibold mb-2">{doc.originalName}</div>
            {doc.mimeType?.startsWith('image/') ? (
              <img src={previewUrl} alt="preview" className="w-full object-contain rounded" />
            ) : (
              <iframe src={previewUrl} className="w-full h-96 border rounded" />
            )}
          </Card>
        </div>

        <aside style={{width:360}}>
          <Card>
            <div className="text-sm text-gray-500 mb-2">OCR Text</div>
            <div className="ocr-block max-h-72 overflow-auto bg-gray-50 p-3 rounded">{doc.ocrResult?.extractedText ?? '(no OCR)'}</div>
            <div className="mt-4">
              <a href={`${API}/documents/${doc.id}/download`}><Button variant="ghost">Download ZIP</Button></a>
            </div>
          </Card>
        </aside>
      </div>

      <Card>
        <div className="mb-3">
          <label className="block text-sm font-medium">Ask about this document</label>
          <textarea value={question} onChange={(e)=>setQuestion(e.target.value)} rows={3} className="w-full p-2 border rounded" />
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={ask} disabled={loading}>{loading ? <><Spinner size={14}/> Asking...</> : 'Ask LLM'}</Button>
          {answer && <div className="ml-4 p-3 bg-yellow-50 rounded w-full"><strong>Answer</strong><div className="mt-2">{answer}</div></div>}
        </div>
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
