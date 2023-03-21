import '@/styles/main.css';
import type { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import { store } from '@/redux/store';
import { AuthProvider } from '@/context/AuthContext';

export default function App({ Component, pageProps }: AppProps) {
    return (
        <AuthProvider>
            <Provider store={store}>
                <Component {...pageProps} />
            </Provider>
        </AuthProvider>
    );
}
