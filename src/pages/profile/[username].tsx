import { RootState } from '@/redux/store';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

export default function ProfilePage() {
    const { user } = useSelector((state: RootState) => state?.user);

    useEffect(() => {
        console.log('Redux User Object: ', user);
    }, [user]);

    return <div>User Profile Page</div>;
}
