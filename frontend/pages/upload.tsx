import { useRef, useState } from 'react';
import Button from '../components/Button';
import FileDropzone from '../components/FileDropzone';
import Spinner from '../components/Spinner';
import Router from 'next/router';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function UploadPage() {
  const [file, setFile] = useState<File|null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState<number|null>(null);
  const [error, setError] = useState<string|null>(null);

  function onFilePicked(f: File) {
    setFile(f);
    setError(null);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) { setError('Pick a file'); return; }
    setLoading(true); setProgress(0);
    const fd = new FormData();
    fd.append('file', file);
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${API}/documents/upload`, true);
    xhr.upload.onprogress = (ev) => {
      if (ev.lengthComputable) setProgress(Math.round(100 * ev.loaded / ev.total));
    };
    xhr.onload = function() {
      setLoading(false);
      if (xhr.status >= 200 && xhr.status < 300) Router.push('/documents');
      else setError('Upload failed');
    };
    xhr.onerror = () => { setLoading(false); setError('Network error'); };
    xhr.send(fd);
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Upload document</h2>

      <FileDropzone onFile={onFilePicked} />
      <div className="mt-4">
        <input type="file" onChange={(e)=>e.target.files && onFilePicked(e.target.files[0])} />
      </div>

      {file && <div className="mt-3"><strong>Selected:</strong> {file.name}</div>}

      {progress != null && (
        <div className="mt-3">
          <div className="text-sm mb-1">Progress: {progress}%</div>
          <div className="w-full bg-gray-100 h-2 rounded"><div style={{width:`${progress}%`}} className="h-2 bg-brand-500 rounded" /></div>
        </div>
      )}

      {error && <div className="text-red-600 mt-3">{error}</div>}

      <div className="mt-4">
        <Button onClick={() => document.querySelector<HTMLInputElement>('input[type=file]')?.click()} className="mr-2">Select file</Button>
        <Button variant="primary" onClick={submit} disabled={loading}>
          {loading ? <span className="inline-flex items-center gap-2"><Spinner size={16} /> Uploading...</span> : 'Upload'}
        </Button>
      </div>
    </div>
  );
}
