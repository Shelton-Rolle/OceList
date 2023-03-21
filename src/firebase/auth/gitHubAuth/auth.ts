// Package Imports
import { signInWithPopup, GithubAuthProvider } from 'firebase/auth';

// Local Import
import auth from '../authInit';
import githubProvider from './githubInit';

export default async function AuthenticateWithGitHub() {
    let token;
    let user;

    await signInWithPopup(auth, githubProvider)
        .then(async (result) => {
            const credential = GithubAuthProvider.credentialFromResult(result);
            token = credential?.accessToken;
            user = result?.user;
        })
        .catch((error) => {
            console.error(error);
        });

    return { token, user };
}
