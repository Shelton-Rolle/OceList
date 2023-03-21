import AuthenticateWithGitHub from '@/firebase/auth/gitHubAuth/auth';
import { GetGitHubUser } from '@/firebase/auth/gitHubAuth/octokit';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import { IGithubUser } from '@/types/interfaces';
import { GithubUserObject } from '@/types/dataObjects';

export default function index() {
    const { setGithubData } = useAuth();
    const router = useRouter();

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
                        projects: {},
                    };

                    if (user?.email) {
                        // Generate a temporary password for the user
                        setGithubData(userObject);
                        router.push('/signup/profile-setup');
                    } else {
                        setGithubData(userObject);
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
