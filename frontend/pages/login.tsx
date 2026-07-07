import { useState } from 'react';
import Router from 'next/router';

export default function LoginPage() {
  const [email, setEmail] = useState('ana@test.local');
  const [password, setPassword] = useState('secret123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const payload = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(payload?.message || 'Login failed');
        setLoading(false);
        return;
      }

      Router.push('/documents');
    } catch (err: any) {
      setError(err?.message || 'Network error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-card" role="main" aria-labelledby="signin-title">
        <h1 id="signin-title" className="title">Sign in</h1>
        <p className="subtitle">Access your documents</p>

        <form onSubmit={submit} className="stack">
          {error && <div className="text-red-600" role="alert">{error}</div>}

          <div>
            <label className="text-muted" htmlFor="email">Email</label>
            <input id="email" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required className="form-input" />
          </div>

          <div>
            <label className="text-muted" htmlFor="password">Password</label>
            <input id="password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required className="form-input" />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-start', gap: 12, alignItems: 'center' }}>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Signing...' : 'Sign in'}
            </button>
            <button type="button" className="btn ghost" onClick={() => { setEmail(''); setPassword(''); }}>
              Clear
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
