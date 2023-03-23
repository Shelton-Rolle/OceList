import AuthenticateWithGitHub from '@/firebase/auth/gitHubAuth/auth';
import { GetGitHubUser } from '@/firebase/auth/gitHubAuth/octokit';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import { IGithubUser } from '@/types/interfaces';
import { GithubUserObject } from '@/types/dataObjects';
import { FormEvent, useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import auth from '@/firebase/auth/authInit';
import CreateUser from '@/database/CreateUser';

export default function index() {
    const [errors, setErrors] = useState<any[]>([]);
    const [username, setUsername] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const { setGithubData, setCurrentUserData } = useAuth();
    const router = useRouter();

    async function SignupWithEmailAndPassword(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        try {
            await createUserWithEmailAndPassword(auth, email, password).then(
                async (credentials) => {
                    const user = credentials?.user;
                    await CreateUser({
                        ...user,
                        login: username,
                    }).then(({ result, user }) => {
                        if (result?.created) {
                            setCurrentUserData(user);
                            router.push(`/profile/${username}`);
                        }
                    });
                }
            );
        } catch (error: any) {
            const errorCode = error.code;
            const errorMessage = error.message;
            setErrors([errorCode, errorMessage]);
        }
    }

    async function SignupWithGitHub() {
        await AuthenticateWithGitHub()
            .then(({ token }) =>
                GetGitHubUser(token!).then((user) => {
                    const userData: GithubUserObject = user!;
                    const { html_url, id, login, public_repos } = userData;

                    const userObject: IGithubUser = {
                        html_url,
                        id,
                        login,
                        public_repos,
                        token,
                        projects: [],
                    };

                    setGithubData(userObject);

                    if (user?.email) {
                        router.push('/signup/profile-setup');
                    } else {
                        router.push('/signup/require-email');
                    }
                })
            )
            .catch((err) => console.error(err));
    }

    return (
        <>
            <Head>
                <title>Signup</title>
                <meta name="description" content="Signup page" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main>
                {errors.map((error) => (
                    <p className="p-4 font-bold">{error}</p>
                ))}
                <form onSubmit={(e) => SignupWithEmailAndPassword(e)}>
                    <input
                        type="text"
                        placeholder="Username"
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Email"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Password"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button type="submit">Signup</button>
                </form>
                <button
                    className="p-4 border border-black rounded-sm"
                    onClick={SignupWithGitHub}
                >
                    Github Signup
                </button>
            </main>
        </>
    );
}
