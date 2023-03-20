import { GithubAuthProvider } from 'firebase/auth';

const githubProvider = new GithubAuthProvider();
githubProvider.addScope('repo');
githubProvider.addScope('user');

export default githubProvider;
