import { useAuth } from '@/context/AuthContext';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function callback() {
    const router = useRouter();
    const { UpdateProfile, currentUser, currentUserData } = useAuth();

    async function HandleCallback() {
        let error;
        const { username } = router?.query;

        error = await UpdateProfile(
            username as string,
            process.env.NEXT_PUBLIC_DEFAULT_IMAGE
        );

        return error;
    }

    useEffect(() => {
        HandleCallback()
            .then((error) => {
                if (error) {
                    console.log('Profile Update ERROR: ', error);
                } else {
                    router.push(`/profile/${currentUser?.displayName}`);
                }
            })
            .catch((error) => {
                console.log('CALLBACK ERRORRR: ', error);
            });
    }, []);

    useEffect(() => {
        console.log('CUrrent User: ', currentUser);
        console.log('Current USer Data: ', currentUserData);
    }, [currentUser, currentUserData]);

    return <div>callback</div>;
}
