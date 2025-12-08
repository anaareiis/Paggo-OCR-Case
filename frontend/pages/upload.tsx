// frontend/pages/upload.tsx
import { useState } from 'react';
import Router from 'next/router';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [userId, setUserId] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  // optional: if you want to attach userId (your API allowed userId optional)
  // in auth flow we rely on auth; upload endpoint is public in current backend.

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setError(null);
    setFile(e.target.files?.[0] ?? null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) {
      setError('Please select a file');
      return;
    }

    setError(null);
    setLoading(true);
    setProgress(0);

    // Use XMLHttpRequest for upload progress
    const fd = new FormData();
    fd.append('file', file);
    // If your backend expects a userId field:
    if (userId) fd.append('userId', userId);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${API}/documents/upload`, true);

    xhr.upload.onprogress = (ev) => {
      if (ev.lengthComputable) {
        setProgress(Math.round((ev.loaded / ev.total) * 100));
      }
    };

    xhr.onload = function () {
      setLoading(false);
      setProgress(null);
      if (xhr.status >= 200 && xhr.status < 300) {
        // success — redirect to documents list
        Router.push('/documents');
      } else {
        try {
          const json = JSON.parse(xhr.responseText);
          setError(json.message || JSON.stringify(json));
        } catch {
          setError(`Upload failed: ${xhr.status}`);
        }
      }
    };

    xhr.onerror = function () {
      setLoading(false);
      setProgress(null);
      setError('Network error during upload');
    };

    xhr.send(fd);
  }

  return (
    <div style={{ maxWidth: 720, margin: '3rem auto', padding: 16 }}>
      <h1>Upload Document</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <input type="file" onChange={onFileChange} />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>Optional: userId (for local tests)</label><br />
          <input value={userId} onChange={(e) => setUserId(e.target.value)} style={{ width: '100%' }} />
        </div>

        <button type="submit" disabled={loading}>{loading ? 'Uploading...' : 'Upload'}</button>
      </form>

      {progress !== null && (
        <div style={{ marginTop: 12 }}>
          <div>Progress: {progress}%</div>
          <div style={{ height: 8, background: '#eee', width: '100%', borderRadius: 4 }}>
            <div style={{ width: `${progress}%`, height: '100%', background: 'green', borderRadius: 4 }} />
          </div>
        </div>
      )}

      {error && <div style={{ color: 'crimson', marginTop: 12 }}>{error}</div>}
    </div>
  );
}
