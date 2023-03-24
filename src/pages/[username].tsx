import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { GetServerSideProps } from 'next';
import GetUser from '@/database/GetUser';
import CurrentUserProfile from '@/components/CurrentUserProfile';
import ExternalUserProfile from '@/components/ExternalUserProfile';

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
