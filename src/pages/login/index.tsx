import AuthenticateWithGitHub from '@/firebase/auth/gitHubAuth/auth';
import { GetGitHubUser } from '@/firebase/auth/gitHubAuth/octokit';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import { GithubUserObject } from '@/types/dataObjects';
import { IGithubUser } from '@/types/interfaces';
import GetUser from '@/database/GetUser';
import Head from 'next/head';
import { PageLayout } from '@/layouts/PageLayout';
import { AiFillGithub, AiOutlineArrowRight } from 'react-icons/ai';
import Link from 'next/link';

export default function Login() {
    const router = useRouter();
    const { setGithubData, currentUser } = useAuth();

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
            </Head>
            <PageLayout>
                <section className="flex justify-center items-center h-full">
                    {currentUser ? (
                        <div className="w-fit">
                            <h1 className="font-roboto font-bold text-3xl text-default-light">
                                You&apos;re Already logged in!{' '}
                            </h1>
                            <p className="font-paragraph font-medium text-base leading-8 mb-4">
                                Head to the Browse page to start finding new
                                projects!
                            </p>
                            <Link
                                href="/browse"
                                className="text-primary-light text-2xl font-poppins font-medium mt-12 flex items-center gap-3 duration-150 hover:text-default-light"
                            >
                                Browse <AiOutlineArrowRight />
                            </Link>
                        </div>
                    ) : (
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
                    )}
                </section>
            </PageLayout>
        </>
    );
}
