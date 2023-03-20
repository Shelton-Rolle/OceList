// Package Imports
import { signInWithPopup, GithubAuthProvider } from 'firebase/auth';
import { Octokit } from 'octokit';

// Local Import
import auth from '../authInit';
import githubProvider from './githubInit';

export default async function AuthenticateWithGitHub() {
    let token;
    await signInWithPopup(auth, githubProvider)
        .then(async (result) => {
            const credential = GithubAuthProvider.credentialFromResult(result);
            token = credential?.accessToken;
        })
        .catch((error) => {
            console.error(error);
        });

    return token;
}
