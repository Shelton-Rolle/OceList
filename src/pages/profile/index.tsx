import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function Profile() {
    const { currentUser } = useAuth();
    useEffect(() => {
        console.log('Current User ', currentUser);
    }, [currentUser]);

    // This page should display the data of the logged in user
    return <div>Profile Page</div>;
}
