import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function ProfilePage() {
    const { currentUser, githubData, currentUserData } = useAuth();

    useEffect(() => {
        console.log('Current User: ', currentUser);
        console.log('Github Data: ', githubData);
        console.log('Current Database Data: ', currentUserData);
    }, [currentUser, githubData, currentUserData]);

    // This page should get and display the data of the user whos username is in the url
    return (
        <div>
            <h1>User Profile Page</h1>
            <a href="/profile/settings">Settings</a>
        </div>
    );
}
