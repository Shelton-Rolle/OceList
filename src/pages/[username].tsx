import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { GetServerSideProps } from 'next';
import GetUser from '@/database/GetUser';
import CurrentUserProfile from '@/components/CurrentUserProfile';
import ExternalUserProfile from '@/components/ExternalUserProfile';
import Head from 'next/head';
import { PageLayout } from '@/layouts/PageLayout';

interface ProfilePageProps {
    profileName: string;
    data: any;
}

export default function ProfilePage({ profileName, data }: ProfilePageProps) {
    const { currentUser } = useAuth();
    const [isCurrentUser, setIsCurrentUser] = useState<boolean>();

    useEffect(() => {
        if (currentUser) {
            if (profileName === currentUser?.displayName) {
                setIsCurrentUser(true);
            } else {
                setIsCurrentUser(false);
            }
        }
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
            <PageLayout>
                {data === null ? (
                    <h1>User Not Found</h1>
                ) : (
                    <div>
                        {isCurrentUser ? (
                            <CurrentUserProfile data={data} />
                        ) : (
                            <ExternalUserProfile data={data} />
                        )}
                    </div>
                )}
            </PageLayout>
        </>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const params = context?.params;
    const username: string = params?.username as string;

    const data = await GetUser(username);

    return {
        props: {
            profileName: username,
            data,
        },
    };
};
