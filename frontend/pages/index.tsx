// frontend/pages/index.tsx
import Link from 'next/link';
import AppShell from '../components/AppShell';

export default function Home() {
  return (
    <section style={{ padding: 80, textAlign: 'center' }}>
      <div style={{ maxWidth: 880, margin: '0 auto' }}>
        <h1 style={{ fontSize: 40, margin: 0, color: '#0f172a' }}>Welcome to Paggo OCR</h1>
        <p style={{ color: '#6b7280', fontSize: 18, marginTop: 12 }}>
          Upload documents (PDF / images), extract text using OCR and ask contextual questions using a Language Model.
        </p>

        <div style={{ marginTop: 28, display: 'flex', justifyContent: 'center', gap: 12 }}>
          <Link href="/login" className="btn btn-primary">Login</Link>
          <Link href="/register" className="btn btn.ghost">Register</Link>
        </div>

        <div style={{ marginTop: 40, display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap' }}>
          <div className="card" style={{ padding: 20, width: 300, textAlign:'left' }}>
            <h3 style={{ marginTop: 0 }}>Fast OCR</h3>
            <p style={{ color:'#6b7280' }}>Extract text from PDFs and images quickly.</p>
          </div>
          <div className="card" style={{ padding: 20, width: 300, textAlign:'left' }}>
            <h3 style={{ marginTop: 0 }}>LLM Q&A</h3>
            <p style={{ color:'#6b7280' }}>Ask questions about your documents and get context-aware answers.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
