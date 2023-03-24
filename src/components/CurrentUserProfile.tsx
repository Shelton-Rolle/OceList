import { CurrentUserProfileProps } from '@/types/props';
import { useEffect } from 'react';

export default function CurrentUserProfile({ data }: CurrentUserProfileProps) {
    useEffect(() => {
        console.log('HERE IS OUR USER DATA: ', data);
    }, []);

    return (
        <div>
            <h1>This is the profile of the logged in user</h1>
            <p>{data?.displayName}</p>
            <a href="/profile/settings">Settings</a>
        </div>
    );
}
