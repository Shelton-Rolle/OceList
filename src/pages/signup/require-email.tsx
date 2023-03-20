import { update } from '@/redux/slices/userSlice';
import { RootState } from '@/redux/store';
import { FormEvent, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';

export default function RequireEmail() {
    const router = useRouter();
    const dispatch = useDispatch();
    const [email, setEmail] = useState<string>();
    const { user } = useSelector((state: RootState) => state?.user);

    async function HandleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const updatedUser = { ...user, email };

        await dispatch(update(updatedUser));

        router.push('/signup/profile-setup');
    }

    return (
        <div>
            <h1>Missing email</h1>
            <p>
                We were not able to retrieve the email associated with your
                github account. Please enter the email you would like to use for
                your profile.
            </p>
            <form onSubmit={(e) => HandleSubmit(e)}>
                <input
                    type="text"
                    placeholder="Email"
                    onChange={(e) => setEmail(e.target.value)}
                />
                <button type="submit">Continue</button>
            </form>
        </div>
    );
}
