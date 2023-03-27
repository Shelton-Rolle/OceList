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
                    const { html_url, id, login, public_repos, email } =
                        userData;
                    const userObject: IGithubUser = {
                        html_url,
                        githubId: id,
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
                <button
                    className="p-4 border border-black rounded-sm"
                    onClick={LoginWithGithub}
                >
                    Login With Github
                </button>
            </PageLayout>
        </>
    );
}
