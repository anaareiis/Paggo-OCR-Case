// frontend/components/AppShell.tsx
import React from 'react';
import NavBar from './NavBar';

export default function AppShell({ children }: any) {
  return (
    <>
      <NavBar />
      <main className="container" style={{ paddingTop:24 }}>
        {children}
      </main>
      <footer className="site-footer">
        © Paggo OCR Case — 2025
      </footer>
    </>
  );
}
