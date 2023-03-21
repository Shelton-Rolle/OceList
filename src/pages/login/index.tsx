import AuthenticateWithGitHub from '@/firebase/auth/gitHubAuth/auth';
import { useRouter } from 'next/router';

export default function index() {
    const router = useRouter();

    async function LoginWithGithub() {
        await AuthenticateWithGitHub().then(() => {
            router.push('/');
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
