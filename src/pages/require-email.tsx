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

    return (
        <section className="w-screen h-screen flex justify-center items-center px-5">
            <div className="max-w-sm lg:max-w-lg">
                {currentUser ? (
                    <>
                        <h1 className="font-roboto font-bold text-xl mb-3 text-primary-light md:text-2xl lg:text-4xl">
                            Already Done!
                        </h1>
                        <p className="font-poppins font-light text-sm md:text-base leading-7 lg:text-lg lg:leading-8">
                            We seem to already have an email on file for your
                            account! Use the link below to head back to the home
                            page.
                        </p>

                        <div className="relative mt-8 lg:mt-20">
                            <Link
                                href="/"
                                className=" border-2 border-secondary-light px-6 py-2 rounded-md w-fit bg-secondary-light text-background-light lg:text-lg lg:px-12 lg:py-4"
                            >
                                Home
                            </Link>
                        </div>
                    </>
                ) : (
                    <>
                        <h1 className="font-roboto font-bold text-xl mb-3 text-primary-light md:text-2xl lg:text-4xl">
                            Missing email
                        </h1>
                        <p className="font-poppins font-light text-sm md:text-base leading-7 lg:text-lg lg:leading-8">
                            We were not able to retrieve the email associated
                            with your github account. Please enter the email you
                            would like to use for your profile.
                        </p>
                        <form
                            className="relative mt-8 lg:mt-20 flex flex-col"
                            onSubmit={(e) => HandleSubmit(e)}
                        >
                            <input
                                type="text"
                                placeholder="Email"
                                className="border-2 border-secondary-light rounded-md py-2 px-5 text-sm placeholder:text-accent-light w-full mt-6 mb-5 outline-none text-default-light font-poppins font-medium lg:text-base lg:px-5 lg:py-3"
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <button
                                className="border-2 border-secondary-light px-6 py-2 rounded-md w-fit bg-secondary-light text-background-light lg:text-lg lg:px-12 lg:py-4"
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
