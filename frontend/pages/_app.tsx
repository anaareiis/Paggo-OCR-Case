// frontend/pages/_app.tsx
import type { AppProps } from 'next/app';
import AppShell from '../components/AppShell';
import '../styles/globals.css';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AppShell>
      <Component {...pageProps} />
    </AppShell>
  );
}
