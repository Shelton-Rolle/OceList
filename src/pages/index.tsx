import Head from 'next/head';
import { useAuth } from '@/context/AuthContext';
import { useEffect } from 'react';
import { PageLayout } from '@/layouts/PageLayout';

export default function Home() {
    const { currentUser, githubData, currentUserData, logout } = useAuth();

    async function fetchTest() {
        await fetch('/api/test')
            .then((res) => res.json())
            .then((res) => console.log('TEST API RES: ', res));
    }

    useEffect(() => {
        // console.log('Current User: ', currentUser);
        // console.log('Github Data: ', githubData);
        // console.log('Current User Database Data: ', currentUserData);
        fetchTest();
    }, [currentUser, githubData, currentUserData]);

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
            <PageLayout>
                <h1>Landing Page</h1>

                <div>
                    <a href={`/${currentUserData?.displayName}`}>Profile</a>
                </div>
                <button onClick={logout}>Logout</button>
            </PageLayout>
        </>
    );
}
