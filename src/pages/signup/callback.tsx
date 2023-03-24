import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function callback() {
    const [callPush, setCallPush] = useState<boolean>(false);
    const router = useRouter();
    const { UpdateProfile, currentUser } = useAuth();

    async function HandleCallback() {
        const { username } = router?.query;

        await UpdateProfile(
            username as string,
            process.env.NEXT_PUBLIC_DEFAULT_IMAGE
        )
            .then((error) => {
                if (error) {
                    console.log('Profile Update ERROR: ', error);
                } else {
                    setCallPush(true);
                }
            })
            .catch((error) => {
                console.log('CALLBACK ERRORRR: ', error);
            });
    }

    useEffect(() => {
        HandleCallback();
    }, []);

    useEffect(() => {
        if (callPush) router.push(`/profile/${currentUser?.displayName}`);
    }, [callPush]);

    return <div>callback</div>;
}
