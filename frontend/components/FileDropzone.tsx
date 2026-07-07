import React, { useRef, useState } from 'react';
import clsx from 'clsx';

export default function FileDropzone({ onFile }: { onFile: (f: File) => void }) {
  const ref = useRef<HTMLDivElement|null>(null);
  const [drag, setDrag] = useState(false);

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDrag(false);
    const f = e.dataTransfer.files?.[0];
    if (f) onFile(f);
  }

  return (
    <div
      ref={ref}
      onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={handleDrop}
      className={clsx("border-dashed border-2 rounded-md p-6 text-center", drag ? 'border-brand-500 bg-brand-50' : 'border-gray-200 bg-white')}
    >
      <div className="text-sm text-gray-600">Drag & drop a file here, or select using the button</div>
    </div>
  );
}
