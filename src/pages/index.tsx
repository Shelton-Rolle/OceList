import Head from 'next/head';
import auth from '@/firebase/auth/authInit';
import { onAuthStateChanged } from 'firebase/auth';

export default function Home() {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            console.log('Current User: ', user);
        }
    });

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
            </main>
        </>
    );
}
