import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { GetServerSideProps } from 'next';

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
        <div>
            {isCurrentUser === undefined ? (
                <p>Loading</p>
            ) : (
                <>
                    {isCurrentUser ? (
                        <>
                            <h1>This is the profile of the logged in user</h1>
                            <p>{currentUser?.displayName}</p>
                        </>
                    ) : (
                        <>
                            <h1>This is the profile of a different user</h1>
                            <p>{profileName}</p>
                        </>
                    )}
                    <a href="/profile/settings">Settings</a>
                </>
            )}
        </div>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const params = context?.params;

    return {
        props: {
            profileName: params?.username,
            data: { name: 'Hello' },
        },
    };
};
