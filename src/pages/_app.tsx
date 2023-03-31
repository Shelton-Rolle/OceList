import '@/styles/main.scss';
import type { AppProps } from 'next/app';
import { AuthProvider } from '@/context/AuthContext';
import { Analytics } from '@vercel/analytics/react';

export default function App({ Component, pageProps }: AppProps) {
    return (
        <AuthProvider>
            <Component {...pageProps} />
            <Analytics />
        </AuthProvider>
    );
}
