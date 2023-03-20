import { RootState } from '@/redux/store';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

export default function ProfilePage() {
    const { user } = useSelector((state: RootState) => state?.user);

    useEffect(() => {
        console.log('Redux User Object: ', user);
    }, [user]);

    // This page should get and display the data of the user whos username is in the url
    return <div>User Profile Page</div>;
}
