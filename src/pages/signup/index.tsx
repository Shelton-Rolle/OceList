import AuthenticateWithGitHub from '@/firebase/auth/gitHubAuth/auth';
import { GetGitHubUser } from '@/firebase/auth/gitHubAuth/octokit';
import { update } from '@/redux/slices/userSlice';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';

export default function index() {
    const router = useRouter();
    const dispatch = useDispatch();

    async function SignupWithGitHub() {
        await AuthenticateWithGitHub()
            .then((token) =>
                GetGitHubUser(token!).then((user: any) => {
                    const userObject = {
                        ...user,
                        token,
                    };
                    // Possible that the user email will be null (https://stackoverflow.com/questions/35373995/github-user-email-is-null-despite-useremail-scope)

                    if ((user as any)?.email) {
                        // Generate a temporary password for the user
                        // Save user data to redux user object
                        dispatch(update(userObject));
                        // Navigate to /signup/profile-setup
                        router.push('/signup/profile-setup');
                    } else {
                        // Save user data to redux user object
                        dispatch(update(userObject));
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
