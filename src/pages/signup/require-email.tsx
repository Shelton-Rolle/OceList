import { FormEvent, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';

export default function RequireEmail() {
    const { updateUserEmail } = useAuth();
    const router = useRouter();
    const [email, setEmail] = useState<string>();

    async function HandleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        await updateUserEmail(email!);

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
