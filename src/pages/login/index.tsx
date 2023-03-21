import AuthenticateWithGitHub from '@/firebase/auth/gitHubAuth/auth';
import { GetGitHubUser } from '@/firebase/auth/gitHubAuth/octokit';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import { GithubUserObject } from '@/types/dataObjects';
import { IGithubUser } from '@/types/interfaces';

export default function index() {
    const router = useRouter();
    const { setGithubData } = useAuth();

    async function LoginWithGithub() {
        await AuthenticateWithGitHub().then(({ token }) => {
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

                setGithubData(userObject);
                router.push('/login/callback');
            });
        });
    }
    return (
        <div>
            <button
                className="p-4 border border-black rounded-sm"
                onClick={LoginWithGithub}
            >
                Login With Github
            </button>
        </div>
    );
}
