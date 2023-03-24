import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { GetServerSideProps } from 'next';
import GetUser from '@/database/GetUser';

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

    useEffect(() => {
        console.log('HERE IS OUR USER DATA: ', data);
    }, []);

    return (
        <>
            {data === null ? (
                <h1>User Not Found</h1>
            ) : (
                <div>
                    <>
                        {isCurrentUser ? (
                            <>
                                <h1>
                                    This is the profile of the logged in user
                                </h1>
                                <p>{currentUser?.displayName}</p>
                                <a href="/profile/settings">Settings</a>
                            </>
                        ) : (
                            <>
                                <h1>This is the profile of a different user</h1>
                                <p>{profileName}</p>
                                <a href="/">Home</a>
                            </>
                        )}
                    </>
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
