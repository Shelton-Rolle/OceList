import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

export default function RequireEmail() {
    const { updateUserEmail, setGithubData, githubData, currentUser } =
        useAuth();
    const router = useRouter();
    const [email, setEmail] = useState<string>();

    async function HandleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        await updateUserEmail(email!).then(() => {
            setGithubData({ ...githubData, email });
        });

        router.push('/profile-setup');
    }

    useEffect(() => {
        console.log('Current User: ', currentUser);
    }, [currentUser]);

    return (
        <section className="text-default-dark flex justify-center items-center h-screen max-w-lg mx-auto">
            <div className="text-default-dark">
                {currentUser ? (
                    <>
                        <h1 className="font-title font-bold text-2xl mb-4 md:text-3xl">
                            Already Done!
                        </h1>
                        <p className="mb-10 font-paragraph font-light leading-8">
                            We seem to already have an email on file for your
                            account! Use the link below to head back to the home
                            page.
                        </p>
                        <div className="py-1 w-fit border-b-2 border-secondary-dark border-opacity-0 duration-200 hover:border-opacity-100">
                            <Link
                                href="/"
                                className="text-secondary-dark text-xl"
                            >
                                Home
                            </Link>
                        </div>
                    </>
                ) : (
                    <>
                        <h1 className="font-title font-bold text-2xl mb-4 md:text-3xl">
                            Missing email
                        </h1>
                        <p className="font-paragraph font-light leading-8">
                            We were not able to retrieve the email associated
                            with your github account. Please enter the email you
                            would like to use for your profile.
                        </p>
                        <form
                            className="mt-8 flex flex-col items-start"
                            onSubmit={(e) => HandleSubmit(e)}
                        >
                            <input
                                type="text"
                                placeholder="Email"
                                className="mt-6 w-full px-4 py-2 rounded-md bg-transparent text-default-dark font-light font-paragraph border-2 border-accent-dark outline-none placeholder:font-paragraph placeholder:font-light placeholder:text-default-dark placeholder:opacity-30"
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <button
                                className="mt-4 px-5 py-3 bg-secondary-dark text-background-dark rounded-md"
                                type="submit"
                            >
                                Continue
                            </button>
                        </form>
                    </>
                )}
            </div>
        </section>
    );
}
