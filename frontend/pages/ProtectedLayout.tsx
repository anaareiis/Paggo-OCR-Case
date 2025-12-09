// frontend/pages/ProtectedLayout.tsx
import React from 'react';
import AppShell from '../components/AppShell';

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell>
      <div className="protected-wrapper">{children}</div>
    </AppShell>
  );
}
