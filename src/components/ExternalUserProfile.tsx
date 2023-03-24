import { ExternalUserProfileProps } from '@/types/props';
import { useEffect } from 'react';

export default function ExternalUserProfile({
    data,
}: ExternalUserProfileProps) {
    useEffect(() => {
        console.log('HERE IS OUR USER DATA: ', data);
    }, []);

    return (
        <div>
            <h1>This is the profile of a different user</h1>
            <p>{data?.displayName}</p>
            <a href="/">Home</a>
        </div>
    );
}
