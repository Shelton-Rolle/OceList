import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/router';

export default function ProfilePage() {
    const router = useRouter();
    const { currentUser, githubData } = useAuth();

    useEffect(() => {
        console.log('Current User: ', currentUser);
        console.log('Github Data: ', githubData);
    }, [currentUser, githubData]);

    // This page should get and display the data of the user whos username is in the url
    return (
        <div>
            <h1>User Profile Page</h1>
            <a href={`${router?.asPath}/settings`}>Settings</a>
        </div>
    );
}
