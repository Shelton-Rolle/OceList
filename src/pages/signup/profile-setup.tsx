import { RootState } from '@/redux/store';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

export default function ProfileSetup() {
    const { user } = useSelector((state: RootState) => state?.user);

    useEffect(() => {
        console.log('Redux User: ', user);
    }, [user]);

    return <div>Select Github Repos to import</div>;
}
