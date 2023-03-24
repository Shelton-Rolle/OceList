import { useAuth } from '@/context/AuthContext';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function callback() {
    const router = useRouter();
    const { UpdateProfile } = useAuth();

    async function HandleCallback() {
        const { username } = router?.query;

        const error = await UpdateProfile(
            username as string,
            process.env.NEXT_PUBLIC_DEFAULT_IMAGE
        );

        if (error) {
            console.log('Profile Update ERROR: ', error);
        } else {
            router.push(`/profile/${username}`);
        }
    }

    useEffect(() => {
        HandleCallback();
    }, []);

    return <div>callback</div>;
}
