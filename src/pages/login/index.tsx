import AuthenticateWithGitHub from '@/firebase/auth/gitHubAuth/auth';
import { GetGitHubUser } from '@/firebase/auth/gitHubAuth/octokit';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import { GithubUserObject, IUser } from '@/types/dataObjects';
import { IGithubUser } from '@/types/interfaces';
import { FormEvent, useState } from 'react';
import auth from '@/firebase/auth/authInit';
import { signInWithEmailAndPassword } from 'firebase/auth';
import GetUser from '@/database/GetUser';
import { FirebaseError } from 'firebase/app';
import Head from 'next/head';

export default function index() {
    const [email, setEmail] = useState<string>();
    const [password, setPassword] = useState<string>();
    const [errors, setErrors] = useState<string[]>([]);
    const router = useRouter();
    const { setGithubData } = useAuth();

    async function LoginWithEmail(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        signInWithEmailAndPassword(auth, email!, password!)
            .then(async (credentials) => {
                const user = credentials?.user;
                if (user) {
                    router.push(`/profile/${user?.displayName}`);
                }
                setErrors(['unknown-credentials']);
            })
            .catch((error) => {
                const { code } = error;
                setErrors([code]);
            });
    }

    async function LoginWithGithub() {
        await AuthenticateWithGitHub().then(({ token }) => {
            GetGitHubUser(token!).then((user) => {
                const userData: GithubUserObject = user!;
                const { html_url, id, login, public_repos } = userData;

                const userObject: IGithubUser = {
                    html_url,
                    githubId: id,
                    login,
                    public_repos,
                    githubToken: token,
                    projects: [],
                };

                setGithubData(userObject);
                router.push('/login/callback');
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
            <main>
                {errors.map((error, index) => (
                    <p className="p-4 font-bold" key={index}>
                        {error}
                    </p>
                ))}
                <form onSubmit={(e) => LoginWithEmail(e)}>
                    <input
                        type="text"
                        placeholder="Email"
                        className="p-4 border border-black rounded-sm"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Password"
                        className="p-4 border border-black rounded-sm"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button type="submit">Login</button>
                </form>
                <button
                    className="p-4 border border-black rounded-sm"
                    onClick={LoginWithGithub}
                >
                    Login With Github
                </button>
            </main>
        </>
    );
}
