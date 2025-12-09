// frontend/components/NavBar.tsx
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function NavBar() {
  const [isLogged, setIsLogged] = useState<boolean | null>(null); // null = loading

  useEffect(() => {
    let mounted = true;
    // tenta obter sessão atual (crie /api/me que retorna { user } ou 401)
    fetch('/api/me', { credentials: 'same-origin' })
      .then(async (r) => {
        if (!mounted) return;
        if (r.ok) {
          setIsLogged(true);
        } else {
          setIsLogged(false);
        }
      })
      .catch(() => {
        if (mounted) setIsLogged(false);
      });
    return () => { mounted = false; };
  }, []);

  async function handleLogout() {
    // chame rota que limpa cookie no backend/frontend API
    await fetch('/api/logout', { method: 'POST', credentials: 'same-origin' });
    // força reload para o estado anônimo
    window.location.href = '/';
  }

  return (
    <header className="nav-root">
      <div className="container nav-inner">
        <Link href="/" className="nav-logo"> Paggo <span className="nav-logo-sub">OCR</span></Link>

        <div className="nav-links">
          {isLogged ? (
            <>
              <Link href="/documents" className="nav-link">Documents</Link>
              <Link href="/upload" className="nav-link">Upload</Link>
            </>
          ) : null}
        </div>

        <div className="nav-actions">
          {/* show login/register while isLogged==false; while null, show nothing to avoid flicker */}
          {isLogged === false && (
            <>
              <Link href="/login" className="btn small">Login</Link>
              <Link href="/register" className="btn outline">Register</Link>
            </>
          )}

          {isLogged === true && (
            <>
              <button onClick={handleLogout} className="btn small">Logout</button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
