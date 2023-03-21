import Head from 'next/head';
import { useAuth } from '@/context/AuthContext';
import { useEffect } from 'react';

export default function Home() {
    const { currentUser, logout } = useAuth();

    useEffect(() => {
        console.log('Current User: ', currentUser);
    }, [currentUser]);

    return (
        <>
            <Head>
                <title>Landing</title>
                <meta name="description" content="Landing Page" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main>
                <h1>Landing Page</h1>
                <button onClick={logout}>Logout</button>
            </main>
        </>
    );
}
