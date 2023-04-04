import AuthenticateWithGitHub from '@/firebase/auth/gitHubAuth/auth';
import { GetGitHubUser } from '@/firebase/auth/gitHubAuth/octokit';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import { GithubUserObject, IUser } from '@/types/dataObjects';
import { IGithubUser } from '@/types/interfaces';
import { FormEvent, useState } from 'react';
import auth from '@/firebase/auth/authInit';
import { signInWithEmailAndPassword, User } from 'firebase/auth';
import GetUser from '@/database/GetUser';
import { FirebaseError } from 'firebase/app';
import Head from 'next/head';
import { PageLayout } from '@/layouts/PageLayout';
import { AiFillGithub } from 'react-icons/ai';

export default function Login() {
    const router = useRouter();
    const { setGithubData } = useAuth();

    async function LoginWithGithub() {
        await AuthenticateWithGitHub().then(({ token }) => {
            GetGitHubUser(token!).then(async (user) => {
                const existingUser = await GetUser(user?.login!);

                if (existingUser) {
                    router.push('/');
                } else {
                    const userData: GithubUserObject = user!;
                    const {
                        html_url,
                        id,
                        login,
                        public_repos,
                        email,
                        avatar_url,
                    } = userData;
                    const userObject: IGithubUser = {
                        html_url,
                        githubId: id,
                        avatar_url,
                        login,
                        public_repos,
                        githubToken: token,
                        email,
                        projects: [],
                    };
                    setGithubData(userObject);
                    router.push('/login/callback');
                }
            });
        });
    }

    return (
        <>
            <Head>
                <title>Login</title>
                <meta name="description" content="Login page" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <PageLayout>
                <section className="flex justify-center items-center h-full">
                    <div className="w-fit">
                        <p className="font-paragraph font-medium text-lg leading-8 mb-4">
                            Login with GitHub to get started!
                        </p>
                        <button
                            className="bg-[#161b22] px-6 py-3 rounded-md flex items-center gap-4 font-paragraph font-medium text-xl text-background-light"
                            onClick={LoginWithGithub}
                        >
                            <AiFillGithub size={30} /> Login With Github
                        </button>
                    </div>
                </section>
            </PageLayout>
        </>
    );
}
