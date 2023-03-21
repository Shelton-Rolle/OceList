import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function ProfilePage() {
    const { currentUser, githubData } = useAuth();

    useEffect(() => {
        console.log('Current User: ', currentUser);
        console.log('Github Data: ', githubData);
    }, [currentUser, githubData]);

    // This page should get and display the data of the user whos username is in the url
    return <div>User Profile Page</div>;
}
