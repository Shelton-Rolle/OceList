import { RootState } from '@/redux/store';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

export default function Profile() {
    const { user } = useSelector((state: RootState) => state?.user);

    useEffect(() => {
        console.log('Redux User Object: ', user);
    }, [user]);

    return <div>Profile Page</div>;
}
