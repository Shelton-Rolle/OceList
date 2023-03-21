import { useAuth } from '@/context/AuthContext';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Callback() {
    const router = useRouter();
    const { currentUser, currentUserData } = useAuth();

    useEffect(() => {
        if (currentUserData) {
            router.push('/');
        } else {
            if (currentUser?.email) {
                router.push('/signup/profile-setup');
            } else {
                router.push('/signup/require-email');
            }
        }
    }, []);
    return <div>callback</div>;
}
