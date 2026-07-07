import { useState } from 'react';
import Link from 'next/link';
import Router from 'next/router';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string|null>(null);
  const [success, setSuccess] = useState<string|null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!email || !password) {
      setError('Email and password are required.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const payload = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(payload?.message || 'Registration failed');
        setLoading(false);
        return;
      }

      setSuccess('Account created. Returning to home...');
      setTimeout(() => Router.push('/'), 900);
    } catch (err: any) {
      setError(err?.message || 'Network error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-card" role="main" aria-labelledby="register-title">
        <h1 id="register-title" className="title">Create account</h1>
        <p className="subtitle">Register to upload and query documents</p>

        <form onSubmit={submit} className="stack">
          {error && <div className="text-red-600" role="alert">{error}</div>}
          {success && <div className="text-green-600" role="status">{success}</div>}

          <div>
            <label className="text-muted" htmlFor="email">Email</label>
            <input id="email" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required className="form-input" />
          </div>

          <div>
            <label className="text-muted" htmlFor="password">Password</label>
            <input id="password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} required className="form-input" minLength={6} />
          </div>

          <div>
            <label className="text-muted" htmlFor="confirm">Confirm password</label>
            <input id="confirm" type="password" value={confirm} onChange={(e)=>setConfirm(e.target.value)} required className="form-input" />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-start', gap: 12, alignItems: 'center' }}>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Creating...' : 'Create account'}
            </button>
            <button type="button" className="btn ghost" onClick={() => { setEmail(''); setPassword(''); setConfirm(''); }}>
              Clear
            </button>
          </div>
        </form>

        <div style={{ marginTop: 14, fontSize: 13 }}>
          Already have an account? 
          <Link href="/login" className="text-muted">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
